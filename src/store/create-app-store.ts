import { GroupLayer } from '@oida/state-mobx';
import { HasAppModules, AppModules } from '@oida/ui-react-mobx';
import { DatasetExplorer, DatasetDiscovery, DatasetDiscoveryProps } from '@oida/eo-mobx';
import { AdamOpensearchDatasetDiscoveryClient } from '@oida/eo-adapters-adam';

import { initMapModule } from './init-map-module';
import { initAoiModule } from './init-aoi-module';
import { initFormattersModule } from './init-formatters-module';

import { initBreadcrumbModule } from './init-breadcrumb-module';
import { initFeaturedDatasetsProvider, initAdamOpensearchDatasetProvider } from './init-adam-dataset-provider';
import { WcsUrlMapper } from './wcs-url-mapper';


export type AppStateProps = {
    discovery: DatasetDiscoveryProps;
    wcsUrlMapper: WcsUrlMapper;
};

export class AppState implements HasAppModules {

    readonly modules: AppModules;
    readonly datasetExplorer: DatasetExplorer;
    readonly datasetDiscovery: DatasetDiscovery;
    readonly wcsUrlMapper: WcsUrlMapper;

    constructor(props: AppStateProps) {
        this.modules = new AppModules();
        this.datasetExplorer = new DatasetExplorer({
            mapLayer: new GroupLayer({
                id: 'datasetExplorerRoot'
            })
        });
        this.datasetDiscovery = new DatasetDiscovery(props.discovery);
        this.wcsUrlMapper = props.wcsUrlMapper;
    }
}

export const createAppStore = (config) => {

    const wcsUrlMapper = new WcsUrlMapper({
        discoveryProviders: config.discovery
    });
    const appState = new AppState({
        discovery: {
            providers: config.discovery.map((item) => {
                if (item.opensearchUrl) {
                    return initAdamOpensearchDatasetProvider({
                        id: item.id,
                        name: item.name,
                        factoryConfig: {
                            wcsServiceUrl: item.wcsUrl,
                            wpsServiceUrl: item.wpsUrl,
                            cswServiceUrl: item.cswUrl,
                            opensearchUrl: item.opensearchUrl
                        },
                        searchClient: new AdamOpensearchDatasetDiscoveryClient({
                            serviceUrl: item.opensearchUrl,
                            wcsUrl: item.wcsUrl,
                            additionalDatasetConfig: item.additionalDatasetConfig
                        }),
                        isStatic: item.staticCatalogue,
                        active: false
                    });
                } else {
                    return initFeaturedDatasetsProvider(item);
                }
            })
        },
        wcsUrlMapper: wcsUrlMapper
    });

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

    return appState;
};

