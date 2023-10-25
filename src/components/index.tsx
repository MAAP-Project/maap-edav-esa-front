import React from 'react';

import { DatasetDiscoveryProviderFactory } from '@oidajs/eo-mobx-react';
import {
    ADAM_FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE,
    ADAM_OPENSEARCH_DATASET_DISCOVERY_PROVIDER_TYPE,
    AdamFeaturedDatasetDiscoveryProvider,
    AdamOpensearchDatasetDiscoveryProvider,
    ADAM_OPENSEARCH_DATASET_DISCOVERY_PROVIDER_TYPE_V2,
    AdamOpensearchDatasetDiscoveryProviderV2
} from '@oidajs/eo-adapters-adam';

import { AdamFeaturedDatasetDiscoveryProvider as AdamFeaturedDatasetDiscoveryProviderComponent } from './adam-featured-dataset-discovery-provider';
import { AdamOpensearchDatasetDiscoveryProvider as AdamOpensearchDatasetDiscoveryProviderComponent } from './adam-opensearch-dataset-discovery-provider';
import { AdamOpensearchDatasetDiscoveryProviderV2 as AdamOpensearchDatasetDiscoveryProviderComponentV2 } from './adam-opensearch-dataset-discovery-provider-v2';
import { FeaturedDatasetDiscoveryProviderComponent } from './featured-dataset-discovery-provider';
import { FeaturedDatasetDiscoveryProvider, FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE } from '../store';

declare module '@oidajs/eo-mobx-react' {
    interface DatasetDiscoveryProviderDefinitions {
        [ADAM_FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE]: {
            provider: AdamFeaturedDatasetDiscoveryProvider;
        };
        [ADAM_OPENSEARCH_DATASET_DISCOVERY_PROVIDER_TYPE]: {
            provider: AdamOpensearchDatasetDiscoveryProvider;
        };
        [FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE]: {
            provider: FeaturedDatasetDiscoveryProvider;
        };
        [ADAM_OPENSEARCH_DATASET_DISCOVERY_PROVIDER_TYPE_V2]: {
            provider: AdamOpensearchDatasetDiscoveryProviderV2;
        };
    }
}

DatasetDiscoveryProviderFactory.register(ADAM_FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE, (config) => {
    return <AdamFeaturedDatasetDiscoveryProviderComponent {...config} />;
});

DatasetDiscoveryProviderFactory.register(ADAM_OPENSEARCH_DATASET_DISCOVERY_PROVIDER_TYPE, (config) => {
    return <AdamOpensearchDatasetDiscoveryProviderComponent {...config} />;
});

DatasetDiscoveryProviderFactory.register(FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE, (config) => {
    return <FeaturedDatasetDiscoveryProviderComponent {...config} />;
});

DatasetDiscoveryProviderFactory.register(ADAM_OPENSEARCH_DATASET_DISCOVERY_PROVIDER_TYPE_V2, (config) => {
    return <AdamOpensearchDatasetDiscoveryProviderComponentV2 {...config} />;
});

export * from './dataset-layer-pane';
export * from './dataset-timeline';
export * from './adam-featured-dataset-discovery-provider';
export * from './adam-opensearch-dataset-discovery-provider';
export * from './adam-opensearch-dataset-discovery-provider-v2';
export * from './featured-dataset-discovery-provider';
export * from './app-header';
export * from './map-mouse-coords';
export * from './map-tools';
export * from './layer-swipe-control';
