import React from 'react';

import { message } from 'antd';
import { PlusOutlined, AimOutlined } from '@ant-design/icons';

import { DataCollectionCompactListItem, DataCollectionList } from '@oida/ui-react-antd';
import { useCenterOnMapFromModule, useDataPaging, useEntityCollectionList, useMapSelection, useSelector } from '@oida/ui-react-mobx';
import { DatasetExplorer } from '@oida/eo-mobx';
import {
    AdamOpensearchDatasetDiscoveryProvider as AdamDatasetDiscoveryProviderState,
    AdamOpensearchDatasetDiscoveryProviderItem
} from '@oida/eo-adapters-adam';


export type AdamOpensearchDatasetDiscoveryProviderProps = {
    provider: AdamDatasetDiscoveryProviderState;
    datasetExplorer: DatasetExplorer
};

export const AdamOpensearchDatasetDiscoveryProvider = (props: AdamOpensearchDatasetDiscoveryProviderProps) => {


    const centerOnMap = useCenterOnMapFromModule();

    const actions = [
        {
            name: 'Center on map',
            content: 'Center on map',
            icon: (<AimOutlined/>),
            callback: (item: AdamOpensearchDatasetDiscoveryProviderItem) => {
                centerOnMap(item.geometry, {
                    animate: true
                });
            },
            condition: (item: AdamOpensearchDatasetDiscoveryProviderItem) => {
                return !!item.geometry;
            }
        },
        {
            name: 'Add to map',
            content: 'Add to map',
            icon: (<PlusOutlined/>),
            callback: (item: AdamOpensearchDatasetDiscoveryProviderItem) => {
                return props.provider.createDataset(item).then((datasetConfig) => {
                    props.datasetExplorer.addDataset(datasetConfig);
                }).catch((error) => {
                    message.error(`Unable to initialize map layer: ${error}`);
                });
            },
            condition: (entity) => {
                return true;
            }
        }
    ];

    const loadingState = useSelector(() => props.provider.loadingState.value, [props.provider]);

    const pagingProps = useDataPaging(props.provider.criteria.paging);
    const mapSelection = useMapSelection();

    const items = useEntityCollectionList<AdamOpensearchDatasetDiscoveryProviderItem>({
        items: props.provider.results,
        actions: actions,
        selectionManager: mapSelection
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
                            title={item.metadata.title}
                            description={item.metadata.description}
                            maxDescriptionRows={4}
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
