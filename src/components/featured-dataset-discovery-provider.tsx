import React from 'react';
import { App } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { IFormFieldDefinition, STRING_FIELD_ID } from '@oidajs/core';
import { DataCollectionCompactListItem, DataCollectionList } from '@oidajs/ui-react-antd';
import {
    useFormData,
    useDataPaging,
    useDataSorting,
    useEntityCollectionList,
    useQueryCriteriaUrlBinding,
    useMapSelection
} from '@oidajs/ui-react-mobx';
import { DatasetExplorer } from '@oidajs/eo-mobx';

import { FeaturedDatasetDiscoveryProvider, FeaturedDatasetDiscoveryProviderItem } from '../store';

export type FeaturedDatasetDiscoveryProviderComponentProps = {
    provider: FeaturedDatasetDiscoveryProvider;
    datasetExplorer: DatasetExplorer;
    onDatasetAdd?: () => void;
};

export const FeaturedDatasetDiscoveryProviderComponent = (props: FeaturedDatasetDiscoveryProviderComponentProps) => {
    const { message } = App.useApp();

    const searchFilters: IFormFieldDefinition[] = [
        {
            name: 'q',
            type: STRING_FIELD_ID,
            config: {},
            rendererConfig: {
                props: {
                    prefix: <SearchOutlined />
                }
            }
        }
    ];

    const actions = [
        {
            name: 'Add to map',
            content: 'Add to map',
            icon: <PlusOutlined />,
            callback: (item: FeaturedDatasetDiscoveryProviderItem) => {
                return props.provider
                    .createDataset(item)
                    .then((datasetConfig) => {
                        props.datasetExplorer.addDataset(datasetConfig);
                        if (props.onDatasetAdd) {
                            props.onDatasetAdd();
                        }
                    })
                    .catch((error) => {
                        message.error(`Unable to initialize map layer: ${error}`);
                    });
            },
            condition: (entity) => {
                return true;
            }
        }
    ];

    useQueryCriteriaUrlBinding({
        criteria: props.provider.criteria
    });

    const pagingProps = useDataPaging(props.provider.criteria.paging);

    const filteringProps = useFormData({
        fieldValues: props.provider.criteria.filters,
        fields: searchFilters
    });

    const sortingProps = useDataSorting({
        sortableFields: [{ key: 'name', name: 'Name' }],
        sortingState: props.provider.criteria.sorting
    });

    const mapSelection = useMapSelection();

    const items = useEntityCollectionList<FeaturedDatasetDiscoveryProviderItem>({
        items: props.provider.results,
        actions: actions,
        selectionManager: mapSelection
    });

    if (!items) {
        return null;
    }

    return (
        <div className='adam-dataset-discovery-provider'>
            <DataCollectionList<FeaturedDatasetDiscoveryProviderItem>
                className='dataset-discovery-results adam-dataset-discovery-results'
                content={(item) => {
                    return (
                        <DataCollectionCompactListItem
                            title={item.metadata.name}
                            description={item.metadata.description}
                            preview={item.metadata.preview}
                            maxDescriptionRows={4}
                        />
                    );
                }}
                items={items}
                itemLayout='vertical'
                paging={pagingProps}
                sorting={sortingProps}
                filters={
                    filteringProps
                        ? {
                              ...filteringProps,
                              mainFilter: 'q'
                          }
                        : undefined
                }
                autoScrollOnSelection={false}
            />
        </div>
    );
};
