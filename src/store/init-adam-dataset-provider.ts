import {
    AdamDatasetFactoryConfig, AdamDatasetRenderMode, AdamFeaturedDataset, AdamFeaturedDatasetDiscoveryProvider,
    AdamFeaturedDatasetDiscoveryProviderProps, AdamOpensearchDatasetDiscoveryProvider, AdamOpensearchDatasetDiscoveryProviderProps,
    AdamOpensearchDatasetDiscoveryProviderPropsV2,
    AdamOpensearchDatasetDiscoveryProviderV2,
    AdamWcsCoverageDescriptionClient, getAdamDatasetFactory, isMultiBandCoverage
} from '@oidajs/eo-adapters-adam';
import { FeatureDatasetDiscoveryProviderFactory, FeaturedDatasetConfig, FeaturedDatasetDiscoveryProvider } from './discovery';
import { FosDatasetFactoryConfig, getFosDatasetFactory } from './fos';

export const initAdamFeaturedDatasetProvider = (config: Omit<AdamFeaturedDatasetDiscoveryProviderProps, 'providerType'>) => {
    return new AdamFeaturedDatasetDiscoveryProvider(config);
};

export const initAdamOpensearchDatasetProvider = (config: Omit<AdamOpensearchDatasetDiscoveryProviderProps, 'providerType'>) => {
    return new AdamOpensearchDatasetDiscoveryProvider(config);
};

export const initAdamOpensearchDatasetProviderV2 = (config: Omit<AdamOpensearchDatasetDiscoveryProviderPropsV2, 'providerType'>) => {
    return new AdamOpensearchDatasetDiscoveryProviderV2(config);
};

export type FeaturedDatasetType = (AdamFeaturedDataset & {datasetType: 'edav'}) | (FeaturedDatasetConfig & {datasetType: 'fos'});
export const initFeaturedDatasetsProvider = (config: {
    id: string,
    name: string,
    edavServices: AdamDatasetFactoryConfig,
    datasets: FeaturedDatasetType[],
    fosService: FosDatasetFactoryConfig
}) => {

    const coverageDescriptionClient = new AdamWcsCoverageDescriptionClient({
        wcsUrl: config.edavServices.wcsServiceUrl
    });
    const edavFactory = getAdamDatasetFactory(config.edavServices);
    const fosFactory = getFosDatasetFactory(config.fosService);

    const datasetFactory: FeatureDatasetDiscoveryProviderFactory<FeaturedDatasetType> = (config) => {
        if (config.datasetType === 'edav') {
            let coverageId: string;
            if (isMultiBandCoverage(config.coverages)) {
                coverageId = config.coverages.wcsCoverage;
            } else {
                coverageId = config.coverages[0].wcsCoverage;
            }
            return coverageDescriptionClient.getCoverageDetails(coverageId).then((coverages) => {
                if (!coverages.length) {
                    throw new Error('Invalid dataset');
                } else {
                    const coverage = coverages[0];
                    let fixedTime: Date | undefined;

                    if (config.fixedTime) {
                        fixedTime = new Date(config.fixedTime);
                    } else if (coverage.time.start.getTime() === coverage.time.end.getTime()) {
                        fixedTime = new Date(coverage.time.start);
                    }
                    return edavFactory({
                        ...config,
                        coverageExtent: {
                            bbox: coverage.extent,
                            srs: coverage.srs,
                            srsDef: coverage.srsDef
                        },
                        renderMode: AdamDatasetRenderMode.ClientSide,
                        color: config.color,
                        fixedTime: fixedTime
                    });
                }
            });
        } else if (config.datasetType === 'fos') {
            return fosFactory(config);
        } else {
            throw new Error('Unknown dataset type');
        }
    };
    return new FeaturedDatasetDiscoveryProvider({
        id: config.id,
        name: config.name,
        datasetFactory: datasetFactory,
        datasets: config.datasets
    });
};
