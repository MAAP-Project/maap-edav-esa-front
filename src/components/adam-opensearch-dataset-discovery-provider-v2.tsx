import React from 'react';

import { Button, Checkbox, Descriptions, Empty, Popover, Spin, Tabs, Typography, App } from 'antd';
import { PlusOutlined, AimOutlined, InfoCircleOutlined, LeftOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { AoiAction, DATE_RANGE_FIELD_ID, getAoiFieldFactory, isAbsoluteUrl, LoadingState } from '@oidajs/core';
import { DataCollectionDetailedListItem, DataCollectionList, DataForm, DatasetCollectionListItemMeta } from '@oidajs/ui-react-antd';
import {
    useCenterOnMapFromModule,
    useDataPaging,
    useDataSorting,
    useEntityCollectionList,
    useFormData,
    useMapSelection,
    useSelector
} from '@oidajs/ui-react-mobx';
import { DatasetConfig, DatasetExplorer } from '@oidajs/eo-mobx';
import {
    AdamOpensearchDatasetDiscoveryProviderV2 as AdamDatasetDiscoveryProviderState,
    AdamOpensearchDatasetDiscoveryProviderItemV2,
    AdamOpenSearchDatasetQuery,
    AdamOpensearchDatasetDiscoveryStep,
    AdamOpensearchDatasetMetadataV2
} from '@oidajs/eo-adapters-adam';

export type AdamOpensearchDatasetDiscoveryResultsProps = {
    queryState: AdamOpenSearchDatasetQuery;
    onAddToMap?: (item: AdamOpensearchDatasetDiscoveryProviderItemV2) => void;
};

export const AdamOpensearchDatasetDiscoveryResults = (props: AdamOpensearchDatasetDiscoveryResultsProps) => {
    const centerOnMap = useCenterOnMapFromModule();

    const actions = [
        {
            name: 'Center on map',
            content: 'Center on map',
            icon: <AimOutlined />,
            callback: (item: AdamOpensearchDatasetDiscoveryProviderItemV2) => {
                centerOnMap(item.geometry, {
                    animate: true
                });
            },
            condition: (item: AdamOpensearchDatasetDiscoveryProviderItemV2) => {
                return !!item.geometry;
            }
        },
        {
            name: 'Add to map',
            content: 'Add to map',
            icon: <PlusOutlined />,
            callback: (item: AdamOpensearchDatasetDiscoveryProviderItemV2) => {
                if (props.onAddToMap) {
                    props.onAddToMap(item);
                }
            },
            condition: (item: AdamOpensearchDatasetDiscoveryProviderItemV2) => {
                return (
                    !!item.dataset.services &&
                    item.dataset.services.some((service) => service.ref === 'access-service') &&
                    Object.values(item.product.subDatasets).some((subdataset) => !!subdataset.wcsPath)
                );
            }
        }
    ];

    const loadingState = useSelector(() => props.queryState.fetcher.loadingStatus.value, [props.queryState]);

    const pagingProps = useDataPaging(props.queryState.params.paging);
    const sortingProps = useDataSorting({
        sortingState: props.queryState.params.sorting,
        sortableFields: [
            {
                key: 'productDate',
                name: 'Date'
            }
        ]
    });

    const mapSelection = useMapSelection();

    const items = useEntityCollectionList<AdamOpensearchDatasetDiscoveryProviderItemV2>({
        items: props.queryState.results,
        actions: actions,
        selectionManager: mapSelection
    });

    if (!items) {
        return null;
    }

    return (
        <DataCollectionList<AdamOpensearchDatasetDiscoveryProviderItemV2>
            className='dataset-discovery-results adam-dataset-discovery-results'
            content={(item) => {
                const metadata: DatasetCollectionListItemMeta[] = [
                    {
                        label: 'Acquisition time',
                        value: item.product.productDate
                    }
                ];

                if (item.product.productType) {
                    metadata.push({
                        label: 'Product type',
                        value: item.product.productType
                    });
                }

                if (item.product.orbitNumber) {
                    metadata.push({
                        label: 'Orbit number',
                        value: item.product.orbitNumber
                    });
                }

                if (item.product.swath) {
                    metadata.push({
                        label: 'Swath',
                        value: item.product.swath
                    });
                }
                if (item.product.downloadLink && isAbsoluteUrl(item.product.downloadLink)) {
                    metadata.push({
                        label: 'Download URL',
                        value: (
                            <Typography.Paragraph
                                copyable={{
                                    text: item.product.downloadLink,
                                    tooltips: [item.product.downloadLink, 'Copied to clipboard']
                                }}
                            />
                        )
                    });
                }
                return (
                    <DataCollectionDetailedListItem
                        title={item.product.productId.substring(item.product.productId.lastIndexOf('/') + 1)}
                        preview={item.product.quicklook || item.product.thumbnail}
                        metadata={metadata}
                    />
                );
            }}
            items={{
                ...items,
                loadingState: loadingState
            }}
            itemLayout='vertical'
            paging={pagingProps}
            sorting={sortingProps}
            autoScrollOnSelection={true}
        />
    );
};

export type AdamOpensearchDatasetDiscoveryProviderResultsProps = {
    provider: AdamDatasetDiscoveryProviderState;
    onDatasetAdd: (datasetConfig: DatasetConfig) => void;
};

export const AdamOpensearchDatasetDiscoveryProviderResults = (props: AdamOpensearchDatasetDiscoveryProviderResultsProps) => {
    const { message } = App.useApp();

    const tabs = useSelector(() =>
        Object.entries(props.provider.datasetQueries).map(([datasetId, query]) => {
            return {
                key: datasetId,
                label: props.provider.datasets.find((dataset) => dataset.datasetId === datasetId)?.title || datasetId,
                children: (
                    <AdamOpensearchDatasetDiscoveryResults
                        queryState={query}
                        onAddToMap={(item) => {
                            return props.provider
                                .createDataset(item)
                                .then((datasetConfig) => {
                                    props.onDatasetAdd(datasetConfig);
                                })
                                .catch((error) => {
                                    message.error(`Unable to initialize map layer: ${error}`);
                                });
                        }}
                    />
                )
            };
        })
    );

    const activeTab = useSelector(() => props.provider.activeResults);

    return (
        <div className='adam-dataset-discovery-provider adam-opensearch-dataset-discovery-provider-results'>
            <Button type='primary' block={true} onClick={() => props.provider.reset()}>
                <LeftOutlined />
                Back to search
            </Button>
            <Tabs
                activeKey={activeTab}
                items={tabs}
                onChange={(activeKey) => props.provider.setActiveResults(activeKey)}
                size='small'
                destroyInactiveTabPane={true}
            />
        </div>
    );
};

export type AdamOpensearchDatasetInfoProps = {
    dataset: AdamOpensearchDatasetMetadataV2;
};

export const AdamOpensearchDatasetInfo = (props: AdamOpensearchDatasetInfoProps) => {
    return (
        <div className='adam-opensearch-dataset-info'>
            <div className='adam-opensearch-dataset-info-description'>{props.dataset.description}</div>
            <Descriptions size='small' column={1}>
                {props.dataset.profile.mission && <Descriptions.Item label='Mission'>{props.dataset.profile.mission}</Descriptions.Item>}
                {props.dataset.profile.sensor && <Descriptions.Item label='Sensor'>{props.dataset.profile.sensor}</Descriptions.Item>}
                {props.dataset.profile.productType && (
                    <Descriptions.Item label='Product type'>{props.dataset.profile.productType}</Descriptions.Item>
                )}
                {props.dataset.profile.processingLevel && (
                    <Descriptions.Item label='Processing level'>{props.dataset.profile.processingLevel}</Descriptions.Item>
                )}
                {props.dataset.subDatasets && (
                    <Descriptions.Item label='Subdatasets'>{Object.keys(props.dataset.subDatasets).join(', ')}</Descriptions.Item>
                )}
            </Descriptions>
            <Descriptions size='small' title='Availability' column={1}>
                {props.dataset.minDate && <Descriptions.Item label='Start date'>{props.dataset.minDate}</Descriptions.Item>}
                {props.dataset.maxDate && <Descriptions.Item label='End date'>{props.dataset.maxDate}</Descriptions.Item>}
                {props.dataset.numberOfRecords && (
                    <Descriptions.Item label='Total products'>{props.dataset.numberOfRecords}</Descriptions.Item>
                )}
            </Descriptions>
            <Descriptions size='small' title='Source' column={1}>
                <Descriptions.Item label='Provider'>
                    {props.dataset.license.dataProviderUrl && isAbsoluteUrl(props.dataset.license.dataProviderUrl) ? (
                        <a target='_blank' href={props.dataset.license.dataProviderUrl}>
                            {props.dataset.license.dataProviderName}
                        </a>
                    ) : (
                        <React.Fragment>{props.dataset.license.dataProviderName}</React.Fragment>
                    )}
                </Descriptions.Item>
                {props.dataset.license.documentationURL && isAbsoluteUrl(props.dataset.license.documentationURL) && (
                    <Descriptions.Item label='Documentation'>
                        <a target='_blank' href={props.dataset.license.documentationURL}>
                            {props.dataset.license.documentationURL}
                        </a>
                    </Descriptions.Item>
                )}
            </Descriptions>
        </div>
    );
};

export type AdamOpensearchDatasetDiscoveryProviderQueryProps = {
    provider: AdamDatasetDiscoveryProviderState;
};

export const AdamOpensearchDatasetDiscoveryProviderQuery = (props: AdamOpensearchDatasetDiscoveryProviderQueryProps) => {
    const datasetLoadingState = useSelector(() => props.provider.datasetsLoadingState, [props.provider]);

    const datasets = useSelector(
        () =>
            props.provider.datasets.map((dataset) => {
                return (
                    <div className='adam-opensearch-dataset-discovery-provider-query-dataset' key={dataset.datasetId}>
                        <Checkbox
                            checked={props.provider.isDatasetEnabled(dataset.datasetId)}
                            onChange={(evt) => {
                                props.provider.setDatasetEnabled(dataset.datasetId, evt.target.checked);
                            }}
                        >
                            {dataset.title}
                        </Checkbox>
                        <Popover content={<AdamOpensearchDatasetInfo dataset={dataset} />} trigger='click'>
                            <InfoCircleOutlined />
                        </Popover>
                    </div>
                );
            }),
        [props.provider]
    );

    const canSearch = useSelector(() => props.provider.canSearch);

    const aoiFieldFactory = getAoiFieldFactory();
    const commonFields = useFormData({
        fieldValues: props.provider.commonQueryFilters,
        fields: [
            aoiFieldFactory({
                name: 'geometry',
                supportedActions: [AoiAction.DrawBBox, AoiAction.DrawPolygon],
                supportedGeometries: [
                    {
                        type: 'BBox'
                    },
                    {
                        type: 'Polygon'
                    }
                ],
                title: 'Area of interest'
            }),
            {
                type: DATE_RANGE_FIELD_ID,
                name: 'date',
                title: 'Time range',
                config: {}
            }
        ]
    });

    return (
        <div className='adam-opensearch-dataset-discovery-provider-query'>
            {datasetLoadingState === LoadingState.Error ? (
                <Empty
                    image={<CloseCircleOutlined />}
                    description='Error retrieving datasets'
                    imageStyle={{ fontSize: '30px', height: '40px' }}
                />
            ) : (
                <React.Fragment>
                    <div className='adam-opensearch-dataset-discovery-provider-query-datasets'>
                        <div className='adam-opensearch-dataset-discovery-provider-query-datasets-title'>Datasets</div>
                        <Spin spinning={datasetLoadingState === LoadingState.Loading}>
                            {datasetLoadingState === LoadingState.Success && !datasets.length ? (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No datasets found in current catalogue' />
                            ) : (
                                <div className='adam-opensearch-dataset-discovery-provider-query-datasets-items'>{datasets}</div>
                            )}
                        </Spin>
                    </div>
                    {commonFields && <DataForm {...commonFields} />}
                    <Button type='primary' disabled={!canSearch} onClick={() => props.provider.search()}>
                        Search
                    </Button>
                </React.Fragment>
            )}
        </div>
    );
};

export type AdamOpensearchDatasetDiscoveryProviderV2Props = {
    provider: AdamDatasetDiscoveryProviderState;
    datasetExplorer: DatasetExplorer;
    onDatasetAdd?: () => void;
};

export const AdamOpensearchDatasetDiscoveryProviderV2 = (props: AdamOpensearchDatasetDiscoveryProviderV2Props) => {
    const currentStep = useSelector(() => props.provider.currentStep, [props.provider]);

    if (currentStep === AdamOpensearchDatasetDiscoveryStep.QueryDefinition) {
        return <AdamOpensearchDatasetDiscoveryProviderQuery key={props.provider.id} provider={props.provider} />;
    } else {
        return (
            <AdamOpensearchDatasetDiscoveryProviderResults
                key={props.provider.id}
                provider={props.provider}
                onDatasetAdd={(datasetConfig) => {
                    props.datasetExplorer.addDataset(datasetConfig);
                    if (props.onDatasetAdd) {
                        props.onDatasetAdd();
                    }
                }}
            />
        );
    }
};
