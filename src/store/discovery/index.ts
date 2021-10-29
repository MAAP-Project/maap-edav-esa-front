import { DatasetDiscoveryProvider } from '@oida/eo-mobx';

import { FeaturedDatasetDiscoveryProvider, FeaturedDatasetDiscoveryProviderProps, FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE } from './featured-discovery-provider';

declare module '@oida/eo-mobx' {
    interface DatasetDiscoveryProviderDefinitions {
        [FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE]: FeaturedDatasetDiscoveryProviderProps;
    }

    interface DatasetDiscoveryProviderTypes {
        [FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE]: FeaturedDatasetDiscoveryProvider;
    }
}

DatasetDiscoveryProvider.register
<typeof FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE, FeaturedDatasetDiscoveryProvider, FeaturedDatasetDiscoveryProviderProps>
(FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE, FeaturedDatasetDiscoveryProvider);

export * from './featured-discovery-provider';
