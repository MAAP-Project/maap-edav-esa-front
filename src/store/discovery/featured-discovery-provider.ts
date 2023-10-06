import { autorun } from 'mobx';

import { Geometry, SortOrder } from '@oidajs/core';
import { DatasetConfig, DatasetDiscoveryProvider, DatasetDiscoveryProviderProps } from '@oidajs/eo-mobx';
import { Entity, QueryParams, QueryParamsProps } from '@oidajs/state-mobx';

export const FEATURED_DATASET_DISCOVERY_ITEM_TYPE = 'featured_discovery_item';

export type FeaturedDatasetConfig = {
    id: string;
    name: string;
    preview?: string | Promise<string>;
    description?: string;
    geometry?: Geometry;
};

export class FeaturedDatasetDiscoveryProviderItem<T extends FeaturedDatasetConfig = FeaturedDatasetConfig> extends Entity {
    metadata: T;

    constructor(props: T) {
        super({
            entityType: FEATURED_DATASET_DISCOVERY_ITEM_TYPE,
            id: props.id
        });

        this.metadata = props;
    }

    get geometry() {
        return this.metadata.geometry;
    }
}

export type FeaturedDatasetDiscoveryJsonSchema = {
    id: string;
    datasetId: string;
};

export const FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE = 'featured_dataset_discovery_provider';

export type FeatureDatasetDiscoveryProviderFactory<T extends FeaturedDatasetConfig = FeaturedDatasetConfig> = (
    featuredDataset: T
) => Promise<DatasetConfig>;

export type FeaturedDatasetDiscoveryProviderProps<T extends FeaturedDatasetConfig = FeaturedDatasetConfig> = {
    datasets: T[];
    datasetFactory: FeatureDatasetDiscoveryProviderFactory<T>;
    queryParams?: QueryParamsProps;
} & DatasetDiscoveryProviderProps<typeof FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE>;

export class FeaturedDatasetDiscoveryProvider<T extends FeaturedDatasetConfig = FeaturedDatasetConfig> extends DatasetDiscoveryProvider<
    FeaturedDatasetDiscoveryProviderItem<T>,
    FeaturedDatasetDiscoveryJsonSchema
> {
    readonly criteria: QueryParams;
    protected datasetFactory_: FeatureDatasetDiscoveryProviderFactory<T>;

    protected datasets_: FeaturedDatasetDiscoveryProviderItem<T>[];

    constructor(props: Omit<FeaturedDatasetDiscoveryProviderProps<T>, 'providerType'>) {
        super({
            providerType: FEATURED_DATASET_DISCOVERY_PROVIDER_TYPE,
            ...props
        });

        this.criteria = new QueryParams(props.queryParams);
        this.datasets_ = props.datasets.map((dataset) => new FeaturedDatasetDiscoveryProviderItem(dataset));
        this.datasetFactory_ = props.datasetFactory;

        this.afterInit_();
    }

    createDataset(item: FeaturedDatasetDiscoveryProviderItem<T>, id?: string) {
        return this.datasetFactory_(item.metadata).then((config) => {
            if (id) {
                config.id = id;
            }
            return {
                ...config,
                factoryInit: {
                    factoryType: this.getFactoryId_(),
                    initConfig: {
                        id: config.id,
                        datasetId: item.id
                    }
                }
            };
        });
    }

    createDatasetFromConfig(config: FeaturedDatasetDiscoveryJsonSchema) {
        const dataset = this.datasets_.find((dataset) => dataset.id === config.datasetId);
        if (!dataset) {
            throw new Error(`No dataset with id ${config.datasetId} found`);
        }
        return this.createDataset(dataset);
    }

    protected afterInit_() {
        autorun(() => {
            if (this.active.value) {
                const filtered = this.getFilteredDatasets_();
                this.setResults_(filtered.datasets);
                this.criteria.paging.setTotal(filtered.total);
            }
        });
    }

    protected getFilteredDatasets_() {
        let datasets = this.datasets_.slice();
        const queryParams = this.criteria.data;

        if (queryParams.filters) {
            queryParams.filters.forEach((filter) => {
                if (filter.key === 'q') {
                    datasets = datasets.filter((dataset) => {
                        return dataset.metadata.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
                    });
                }
            });
        }
        if (queryParams.sortBy) {
            if (queryParams.sortBy.key === 'name') {
                datasets = datasets.sort((d1, d2) => {
                    if (d1.metadata.name > d2.metadata.name) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
            }

            if (queryParams.sortBy.order !== SortOrder.Ascending) {
                datasets = datasets.reverse();
            }
        }

        if (queryParams.paging) {
            datasets = datasets.slice(queryParams.paging.offset, queryParams.paging.offset + queryParams.paging.pageSize);
        }

        return {
            datasets: datasets,
            total: this.datasets_.length
        };
    }
}
