import React from 'react';

import { PlusOutlined } from '@ant-design/icons';

import { DataCollectionCompactListItem, DataCollectionList } from '@oida/ui-react-antd';
import { useDataPaging, useEntityCollectionList, useSelector } from '@oida/ui-react-mobx';
import { DatasetExplorer } from '@oida/eo-mobx';
import { DatasetDiscoveryProviderFactory } from '@oida/eo-mobx-react';
import {
    AdamOpensearchDatasetDiscoveryProvider as AdamDatasetDiscoveryProviderState,
    AdamOpensearchDatasetDiscoveryProviderItem,
    ADAM_OPENSEARCH_DATASET_DISCOVERY_PROVIDER_TYPE
} from '@oida/eo-adapters-adam';


export type AdamOpensearchDatasetDiscoveryProviderProps = {
    provider: AdamDatasetDiscoveryProviderState;
    datasetExplorer: DatasetExplorer
};

export const AdamOpensearchdDatasetDiscoveryProvider = (props: AdamOpensearchDatasetDiscoveryProviderProps) => {

    const actions = [
        {
            name: 'Add to map',
            content: 'Add to map',
            icon: (<PlusOutlined/>),
            callback: (item: AdamOpensearchDatasetDiscoveryProviderItem) => {
                props.provider.createDataset(item.metadata).then((datasetConfig) => {
                    props.datasetExplorer.addDataset(datasetConfig);
                });
            },
            condition: (entity) => {
                return true;
            }
        }
    ];

    const loadingState = useSelector(() => props.provider.loadingState.value);

    const pagingProps = useDataPaging(props.provider.criteria.paging);


    const items = useEntityCollectionList<AdamOpensearchDatasetDiscoveryProviderItem>({
        items: props.provider.results,
        actions: actions
    });

    if (!items) {
        return null;
    }

    return (
        <div className='adam-dataset-discovery-provider'>
            <DataCollectionList<AdamOpensearchDatasetDiscoveryProviderItem>
                className='dataset-discovery-results adam-dataset-discovery-results'
                content={(item) => {
                    return (
                        <DataCollectionCompactListItem
                            title={item.metadata.extendedDatasetName}
                            metadata={[{
                                label: '',
                                value: item.metadata.description
                            }]}
                        />
                    );
                }}
                items={{
                    ...items,
                    loadingState: loadingState
                }}
                itemLayout='vertical'
                paging={pagingProps}
                autoScrollOnSelection={true}
            />
        </div>
    );
};

DatasetDiscoveryProviderFactory.register(ADAM_OPENSEARCH_DATASET_DISCOVERY_PROVIDER_TYPE, (config) => {
    return <AdamOpensearchdDatasetDiscoveryProvider {...config}/>;
});
