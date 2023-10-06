import {
    DatasetAnalysis,
    DatasetAreaSeries,
    DatasetAreaValues,
    DatasetAreaValuesAnalysis,
    DatasetPointSeries,
    DatasetPointSeriesAnalysis,
    DatasetToolConfig,
    DatasetTransectValues,
    DATASET_AREA_SERIES_PROCESSING,
    DATASET_AREA_VALUES_PROCESSING,
    POINT_SERIES_PROCESSING,
    TRANSECT_VALUES_PROCESSING
} from '@oidajs/eo-mobx';
import { ComboToolConfig } from '@oidajs/eo-mobx-react';

export const getAnalyticsTools = (datasetExplorer) => {
    const tools: ComboToolConfig[] = [
        {
            type: POINT_SERIES_PROCESSING,
            name: 'Point series',
            condition: (dataset) => {
                return !!dataset.config.tools?.find((tool) => tool.type === POINT_SERIES_PROCESSING);
            },
            analysisFactory: (dataset) => {
                if (!dataset) {
                    const explorerItem = datasetExplorer.items.find((item) => {
                        return item.dataset.config.tools?.find((tool) => tool.type === POINT_SERIES_PROCESSING);
                    });
                    if (explorerItem) {
                        const pointSeriesTool = explorerItem.dataset.config.tools?.find((tool) => {
                            return tool.type === POINT_SERIES_PROCESSING;
                        }) as DatasetToolConfig<typeof POINT_SERIES_PROCESSING>;

                        return new DatasetPointSeriesAnalysis({
                            processings: [
                                new DatasetPointSeries({
                                    dataset: explorerItem.dataset,
                                    config: pointSeriesTool.config,
                                    parent: explorerItem.mapViz,
                                    ...pointSeriesTool.defaultParams
                                })
                            ]
                        });
                    } else {
                        throw new Error('Unable to find a compatible dataset');
                    }
                } else {
                    const explorerItem = datasetExplorer.items.find((item) => {
                        return item.dataset.id === dataset.id;
                    });
                    const pointSeriesTool = dataset?.config.tools?.find((tool) => {
                        return tool.type === POINT_SERIES_PROCESSING;
                    }) as DatasetToolConfig<typeof POINT_SERIES_PROCESSING> | undefined;
                    return new DatasetPointSeriesAnalysis({
                        processings: pointSeriesTool
                            ? [
                                  new DatasetPointSeries({
                                      dataset: dataset!,
                                      config: pointSeriesTool.config,
                                      parent: explorerItem?.mapViz,
                                      ...pointSeriesTool.defaultParams
                                  })
                              ]
                            : undefined
                    });
                }
            }
        },
        {
            type: TRANSECT_VALUES_PROCESSING,
            name: 'Transect values',
            condition: (dataset) => {
                return !!dataset.config.tools?.find((tool) => tool.type === TRANSECT_VALUES_PROCESSING);
            },
            analysisFactory: (dataset) => {
                if (!dataset) {
                    const explorerItem = datasetExplorer.items.find((item) => {
                        return item.dataset.config.tools?.find((tool) => tool.type === TRANSECT_VALUES_PROCESSING);
                    });
                    if (explorerItem) {
                        const transectValuesTool = explorerItem.dataset.config.tools?.find((tool) => {
                            return tool.type === TRANSECT_VALUES_PROCESSING;
                        }) as DatasetToolConfig<typeof TRANSECT_VALUES_PROCESSING>;

                        return new DatasetAnalysis<typeof TRANSECT_VALUES_PROCESSING, DatasetTransectValues>({
                            type: TRANSECT_VALUES_PROCESSING,
                            processings: [
                                new DatasetTransectValues({
                                    dataset: explorerItem.dataset,
                                    config: transectValuesTool.config,
                                    parent: explorerItem.mapViz,
                                    ...transectValuesTool.defaultParams
                                })
                            ]
                        });
                    } else {
                        throw new Error('Unable to find a compatible dataset');
                    }
                } else {
                    const explorerItem = datasetExplorer.items.find((item) => {
                        return item.dataset.id === dataset.id;
                    });
                    const transectValuesTool = dataset?.config.tools?.find((tool) => {
                        return tool.type === TRANSECT_VALUES_PROCESSING;
                    }) as DatasetToolConfig<typeof TRANSECT_VALUES_PROCESSING> | undefined;
                    return new DatasetAnalysis<typeof TRANSECT_VALUES_PROCESSING, DatasetTransectValues>({
                        type: TRANSECT_VALUES_PROCESSING,
                        processings: transectValuesTool
                            ? [
                                  new DatasetTransectValues({
                                      dataset: dataset!,
                                      config: transectValuesTool.config,
                                      parent: explorerItem?.mapViz,
                                      ...transectValuesTool.defaultParams
                                  })
                              ]
                            : undefined
                    });
                }
            }
        },
        {
            type: DATASET_AREA_VALUES_PROCESSING,
            name: 'Area Statistics',
            condition: (dataset) => {
                const areaSeriesTool = dataset.config.tools?.find((tool) => {
                    return tool.type === DATASET_AREA_VALUES_PROCESSING;
                }) as DatasetToolConfig<typeof DATASET_AREA_VALUES_PROCESSING> | undefined;
                return !!areaSeriesTool && areaSeriesTool.config.supportedData.stats;
            },
            analysisFactory: (dataset) => {
                if (!dataset) {
                    const explorerItem = datasetExplorer.items.find((item) => {
                        return item.dataset.config.tools?.find((tool) => tool.type === DATASET_AREA_VALUES_PROCESSING);
                    });
                    if (explorerItem) {
                        const areaValuesTool = explorerItem.dataset.config.tools?.find((tool) => {
                            return tool.type === DATASET_AREA_VALUES_PROCESSING;
                        }) as DatasetToolConfig<typeof DATASET_AREA_VALUES_PROCESSING>;

                        return new DatasetAreaValuesAnalysis({
                            processings: [
                                new DatasetAreaValues({
                                    dataset: explorerItem.dataset,
                                    config: areaValuesTool.config,
                                    parent: explorerItem.mapViz,
                                    ...areaValuesTool.defaultParams
                                })
                            ]
                        });
                    } else {
                        throw new Error('Unable to find a compatible dataset');
                    }
                } else {
                    const explorerItem = datasetExplorer.items.find((item) => {
                        return item.dataset.id === dataset.id;
                    });

                    const areaValuesTool = dataset?.config.tools?.find((tool) => {
                        return tool.type === DATASET_AREA_VALUES_PROCESSING;
                    }) as DatasetToolConfig<typeof DATASET_AREA_VALUES_PROCESSING> | undefined;
                    return new DatasetAreaValuesAnalysis({
                        processings: areaValuesTool
                            ? [
                                  new DatasetAreaValues({
                                      dataset: dataset!,
                                      config: areaValuesTool.config,
                                      parent: explorerItem.mapViz,
                                      ...areaValuesTool.defaultParams
                                  })
                              ]
                            : undefined
                    });
                }
            }
        },
        {
            type: DATASET_AREA_SERIES_PROCESSING,
            name: 'Area Series',
            condition: (dataset) => {
                const areaSeriesTool = dataset.config.tools?.find((tool) => {
                    return tool.type === DATASET_AREA_SERIES_PROCESSING;
                }) as DatasetToolConfig<typeof DATASET_AREA_SERIES_PROCESSING> | undefined;
                return !!areaSeriesTool && areaSeriesTool.config.supportedData.stats;
            },
            analysisFactory: (dataset) => {
                if (!dataset) {
                    const explorerItem = datasetExplorer.items.find((item) => {
                        return item.dataset.config.tools?.find((tool) => tool.type === POINT_SERIES_PROCESSING);
                    });
                    if (explorerItem) {
                        const areaSeriesTool = explorerItem.dataset.config.tools?.find((tool) => {
                            return tool.type === DATASET_AREA_SERIES_PROCESSING;
                        }) as DatasetToolConfig<typeof DATASET_AREA_SERIES_PROCESSING>;

                        return new DatasetAnalysis<typeof DATASET_AREA_SERIES_PROCESSING, DatasetAreaSeries>({
                            type: DATASET_AREA_SERIES_PROCESSING,
                            processings: [
                                new DatasetAreaSeries({
                                    dataset: explorerItem.dataset,
                                    config: areaSeriesTool.config,
                                    parent: explorerItem.mapViz,
                                    ...areaSeriesTool.defaultParams
                                })
                            ]
                        });
                    } else {
                        throw new Error('Unable to find a compatible dataset');
                    }
                } else {
                    const explorerItem = datasetExplorer.items.find((item) => {
                        return item.dataset.id === dataset.id;
                    });

                    const areaSeriesTool = dataset?.config.tools?.find((tool) => {
                        return tool.type === DATASET_AREA_SERIES_PROCESSING;
                    }) as DatasetToolConfig<typeof DATASET_AREA_SERIES_PROCESSING> | undefined;
                    return new DatasetAnalysis<typeof DATASET_AREA_SERIES_PROCESSING, DatasetAreaSeries>({
                        type: DATASET_AREA_SERIES_PROCESSING,
                        processings: areaSeriesTool
                            ? [
                                  new DatasetAreaSeries({
                                      dataset: dataset!,
                                      config: areaSeriesTool.config,
                                      parent: explorerItem.mapViz,
                                      ...areaSeriesTool.defaultParams
                                  })
                              ]
                            : undefined
                    });
                }
            }
        }
    ];

    return tools;
};
