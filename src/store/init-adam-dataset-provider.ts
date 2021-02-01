import {
    AdamFeaturedDatasetDiscoveryProvider, AdamFeaturedDatasetDiscoveryProviderProps,
    AdamOpensearchDatasetDiscoveryProvider, AdamOpensearchDatasetDiscoveryProviderProps
} from '@oida/eo-adapters-adam';

export const initAdamFeaturedDatasetProvider = (config: Omit<AdamFeaturedDatasetDiscoveryProviderProps, 'providerType'>) => {
    return new AdamFeaturedDatasetDiscoveryProvider(config);
};

export const initAdamOpensearchDatasetProvider = (config: Omit<AdamOpensearchDatasetDiscoveryProviderProps, 'providerType'>) => {
    return new AdamOpensearchDatasetDiscoveryProvider(config);
};

