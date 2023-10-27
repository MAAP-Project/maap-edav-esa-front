import { reaction } from 'mobx';

import { AxiosInstanceWithCancellation, Color, IFeatureStyle } from '@oidajs/core';
import { GroupLayer } from '@oidajs/state-mobx';
import { HasAppModules, AppModules, bindAoiValueToMap } from '@oidajs/ui-react-mobx';
import { DatasetExplorer, DatasetDiscovery, DatasetDiscoveryProps, defaultDiscoveryFootprintStyle } from '@oidajs/eo-mobx';
import {
    AdamOpensearchDatasetDiscoveryClient,
    AdamOpensearchDatasetDiscoveryClientV2,
    AdamOpensearchMetadataModelVersion
} from '@oidajs/eo-adapters-adam';

import { initMapModule } from './init-map-module';
import { initAoiModule } from './init-aoi-module';
import { initFormattersModule } from './init-formatters-module';

import { initBreadcrumbModule } from './init-breadcrumb-module';
import {
    initFeaturedDatasetsProvider,
    initAdamOpensearchDatasetProvider,
    initAdamOpensearchDatasetProviderV2
} from './init-adam-dataset-provider';
import { WcsUrlMapper } from './wcs-url-mapper';
import { UserSession } from './user-session';

export type AppStateProps = {
    discovery: DatasetDiscoveryProps;
    wcsUrlMapper: WcsUrlMapper;
};

export class AppState implements HasAppModules {
    readonly modules: AppModules;
    readonly datasetExplorer: DatasetExplorer;
    readonly datasetDiscovery: DatasetDiscovery;
    readonly userSession: UserSession;
    readonly wcsUrlMapper: WcsUrlMapper;

    constructor(props: AppStateProps) {
        this.modules = new AppModules();
        this.datasetExplorer = new DatasetExplorer({
            mapLayer: new GroupLayer({
                id: 'datasetExplorerRoot'
            })
        });
        this.datasetDiscovery = new DatasetDiscovery(props.discovery);
        this.userSession = new UserSession();
        this.wcsUrlMapper = props.wcsUrlMapper;
    }
}

export const createAppStore = (config) => {
    const wcsUrlMapper = new WcsUrlMapper({
        discoveryProviders: config.discovery
    });
    const appState = new AppState({
        discovery: {
            footprintStyle: (item) => {
                const style = defaultDiscoveryFootprintStyle(item) as IFeatureStyle;
                if (style.polygon) {
                    const strokeColor = style.polygon.strokeColor;
                    if (strokeColor) {
                        const fillColor: Color = [strokeColor[0], strokeColor[1], strokeColor[2], 0.01];
                        if (item.hovered.value || item.selected.value) {
                            fillColor[3] = 0.2;
                        }

                        style.polygon.fillColor = fillColor;
                    }
                }
                return style;
            }
        },
        wcsUrlMapper: wcsUrlMapper
    });

    const protectedProviders: Set<string> = new Set();

    appState.datasetDiscovery.addProviders(
        config.discovery.map((item) => {
            let axiosInstance: AxiosInstanceWithCancellation | undefined;
            if (item.protected) {
                protectedProviders.add(item.id);
                axiosInstance = appState.userSession.axiosInstance;
            }
            if (item.opensearchUrl) {
                return initAdamOpensearchDatasetProvider({
                    id: item.id,
                    name: item.name,
                    factoryConfig: {
                        axiosInstance: axiosInstance,
                        wcsServiceUrl: item.wcsUrl,
                        wpsServiceUrl: item.wpsUrl,
                        cswServiceUrl: item.cswUrl,
                        opensearchUrl: item.opensearchUrl,
                        opensearchMetadataModelVersion: item.opensearchVersion
                    },
                    searchClient: new AdamOpensearchDatasetDiscoveryClient({
                        axiosInstance: axiosInstance,
                        serviceUrl: item.opensearchUrl,
                        wcsUrl: item.wcsUrl,
                        additionalDatasetConfig: item.additionalDatasetConfig,
                        metadataModelVersion: item.opensearchVersion || AdamOpensearchMetadataModelVersion.V3
                    }),
                    isStatic: item.staticCatalogue,
                    active: false,
                    disabled: item.protected && !appState.userSession.accessToken
                });
            } else if (item.opensearchUrlV2) {
                return initAdamOpensearchDatasetProviderV2({
                    id: item.id,
                    name: item.name,
                    searchClient: new AdamOpensearchDatasetDiscoveryClientV2({
                        axiosInstance: axiosInstance,
                        serviceUrl: item.opensearchUrlV2,
                        additionalDatasetConfig: item.additionalDatasetConfig
                    }),
                    axiosInstance: axiosInstance,
                    disabled: item.protected && !appState.userSession.accessToken,
                    active: false
                });
            } else {
                return initFeaturedDatasetsProvider({
                    ...item,
                    axiosInstance: axiosInstance
                });
            }
        })
    );

    const mapModule = initMapModule(config.map);
    appState.modules.addModule(mapModule);

    const formattersModule = initFormattersModule();
    appState.modules.addModule(formattersModule);

    const aoiModule = initAoiModule(mapModule);
    appState.modules.addModule(aoiModule);

    const breacrumbModule = initBreadcrumbModule();
    appState.modules.addModule(breacrumbModule);

    mapModule.map.layers.children.add(appState.datasetExplorer.mapLayer);
    mapModule.map.layers.children.add(appState.datasetDiscovery.footprintLayer);

    appState.datasetExplorer.setToi(new Date());

    bindAoiValueToMap({
        aois: aoiModule.aois,
        getter: () => appState.datasetExplorer.aoi,
        setter: (value) => appState.datasetExplorer.setAoi(value),
        map: mapModule.map,
        color: '#1f8fcb'
    });

    reaction(
        () => appState.userSession.accessToken,
        (accessToken) => {
            appState.datasetDiscovery.providers.forEach((provider) => {
                if (protectedProviders.has(provider.id)) {
                    provider.setDisabled(!accessToken);
                }
            });
        }
    );

    return appState;
};
