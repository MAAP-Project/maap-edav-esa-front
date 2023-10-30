import React from 'react';
import moment from 'moment';

import { getGeometryExtent, IFeatureStyle } from '@oidajs/core';
import {
    DatasetConfig,
    DatasetVectorFeature,
    defaultVectoreFeatureStyleFactory,
    getVectorFeaturesFilterer,
    VectorFeatureDescriptor,
    VECTOR_VIZ_TYPE
} from '@oidajs/eo-mobx';
import { getPlottyColorScales } from '@oidajs/eo-geotiff';
import { AdamOpenSearchClient, getAdamVectorDownloadConfig } from '@oidajs/eo-adapters-adam';

import { FeaturedDatasetConfig } from '../discovery';
import { FosApiClient, FosApiClientConfig, FosPlot } from './fos-api-client';

export type FosDatasetFactoryConfig = FosApiClientConfig & {
    dasAccess: {
        opensearchUrl: string;
        datasetId: string;
    };
};

export const getFosDatasetFactory = (config: FosDatasetFactoryConfig) => {
    const fosClient = new FosApiClient(config);

    const fosPlotFeature: VectorFeatureDescriptor = {
        properties: [
            {
                type: 'string',
                id: 'Name',
                name: 'Name'
            },
            {
                type: 'string',
                id: 'Country',
                name: 'Country'
            },
            {
                type: 'number',
                id: 'Area',
                name: 'Area',
                filterable: true,
                quantity: {
                    id: 'area',
                    units: 'ha'
                },
                domain: {
                    min: 0,
                    max: 3
                }
            },
            {
                type: 'number',
                id: 'Altitude',
                name: 'Altitude',
                filterable: true,
                quantity: {
                    id: 'length',
                    units: 'm'
                },
                domain: {
                    min: 0,
                    max: 2000
                }
            },
            {
                type: 'number',
                id: 'Slope',
                name: 'Slope',
                quantity: {
                    id: 'percentage',
                    units: '%'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 100
                }
            },
            {
                type: 'number',
                id: 'agb_local',
                name: 'Above Ground Biomass (local)',
                description:
                    'Above ground biomass estimated using local equations or equation 4 in Chave et al., 2014 with wood density, DBH and H derived from local height-diameter relationships',
                quantity: {
                    id: 'biomass',
                    units: 't ha-1'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 1000
                }
            },
            {
                type: 'number',
                id: 'agb_feldpausch',
                name: 'Above Ground Biomass (Feldpausch)',
                description:
                    'Above ground biomass estimated using equation 4 in Chave et al., 2014 with wood density, DBH and H derived from Feldpausch et al, 2012 height-diameter relationship',
                quantity: {
                    id: 'biomass',
                    units: 't ha-1'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 1000
                }
            },
            {
                type: 'number',
                id: 'agb_chave',
                name: 'Above Ground Biomass (Chave)',
                description:
                    'Above ground biomass estimated using equation 7 in Chave et al., 2014 with wood density, DBH and H implicitly taken into consideration through the use of the bioclimatic predictor E',
                quantity: {
                    id: 'biomass',
                    units: 't ha-1'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 1000
                }
            },
            {
                type: 'number',
                id: 'h_lorey_local',
                name: "Height Lorey's (local)",
                description: 'DBH weighted mean tree height calculated based on local H=f(DBH) curve',
                quantity: {
                    id: 'length',
                    units: 'm'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 50
                }
            },
            {
                type: 'number',
                id: 'h_lorey_feldpausch',
                name: "Height Lorey's (Feldpausch)",
                description: 'Mean height calculated based on the curve by Feldpausch',
                quantity: {
                    id: 'length',
                    units: 'm'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 50
                }
            },
            {
                type: 'number',
                id: 'h_lorey_chave',
                name: "Height Lorey's (Chave)",
                description: 'Mean height calculated based on the curve by Chave',
                quantity: {
                    id: 'length',
                    units: 'm'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 50
                }
            },
            {
                type: 'number',
                id: 'h_max_local',
                name: 'Height Max (local)',
                description: 'Height of the tallest tree calculated based on local H=f(DBH) curve',
                quantity: {
                    id: 'length',
                    units: 'm'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 80
                }
            },
            {
                type: 'number',
                id: 'h_max_feldpausch',
                name: 'Height Max (Feldpausch)',
                description: 'Max height calculated based on the curve by Feldpausch',
                quantity: {
                    id: 'length',
                    units: 'm'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 80
                }
            },
            {
                type: 'number',
                id: 'h_max_chave',
                name: 'Height Max (Chave)',
                description: 'Max height calculated based on the curve by Chave',
                quantity: {
                    id: 'length',
                    units: 'm'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 80
                }
            },
            {
                type: 'number',
                id: 'basal_area',
                name: 'Basal Area',
                quantity: {
                    id: 'tree_area',
                    units: 'm2 ha-1'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 100
                }
            },
            {
                type: 'number',
                id: 'gsv',
                name: 'Growing Stock Volume',
                quantity: {
                    id: 'tree_volume',
                    units: 'm3 ha-1'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 1500
                }
            },
            {
                type: 'number',
                id: 'wood_density',
                name: 'Wood density',
                quantity: {
                    id: 'wood_density',
                    units: 't m-3'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 1
                }
            },
            {
                type: 'number',
                id: 'tree_density',
                name: 'Stem density',
                quantity: {
                    id: 'stem_density',
                    units: 'stem ha-1'
                },
                filterable: true,
                domain: {
                    min: 0,
                    max: 3000
                }
            },
            {
                type: 'number',
                id: 'min_dbh',
                name: 'Min DBH',
                filterable: true,
                description: 'Minimum diameter of trees at breast height included in the census',
                quantity: {
                    id: 'length',
                    units: 'cm'
                },
                domain: {
                    min: 0,
                    max: 10
                }
            },
            {
                type: 'date',
                id: 'Established',
                name: 'Establishment date',
                formatter: (value) => {
                    return moment.utc(value).format('YYYY');
                }
            },
            {
                type: 'date',
                id: 'censusDate',
                name: 'Census date',
                formatter: (value) => {
                    return moment.utc(value).format('YYYY');
                }
            },
            {
                type: 'string',
                id: 'Network',
                name: 'Network'
            },
            {
                type: 'string',
                id: 'Institutions',
                name: 'Institutions',
                isArray: true
            },
            {
                type: 'string',
                id: 'PIs',
                name: 'Principal Investigators',
                isArray: true
            },
            {
                type: 'string',
                id: 'Url',
                name: 'Data provider',
                subType: 'url'
            },
            {
                type: 'string',
                id: 'BiomassProcessingProtocol',
                name: 'Biomass processing protocol',
                subType: 'url',
                formatter: (value) => {
                    return (
                        <a href={`${config.url}/Docs/biomass_processing_protocol/${value}`} target='_blank'>
                            {value}
                        </a>
                    );
                }
            },
            {
                type: 'composite',
                id: 'taxonomicIdentifications',
                name: 'Taxonomic Identifications',
                isArray: true,
                properties: [
                    {
                        type: 'string',
                        id: 'Genus',
                        name: 'Genus'
                    },
                    {
                        type: 'string',
                        id: 'Species',
                        name: 'Species'
                    },
                    {
                        type: 'number',
                        id: 'Percentage',
                        name: 'Percentage'
                    },
                    {
                        type: 'number',
                        id: 'Count',
                        name: 'Count'
                    }
                ],
                formatter: (value) => {
                    if (!value) {
                        return 'N/A';
                    } else {
                        return `${value.Genus} ${value.Species}: ${value.Percentage}% (${value.Count})`;
                    }
                }
            },
            {
                type: 'string',
                id: 'Photos',
                name: 'Pictures',
                isArray: true,
                formatter: (value, idx) => {
                    const url = `${config.url}/Images/sites/${value}`;
                    return <img src={url} key={`Photos_${idx}`} />;
                }
            }
        ]
    };

    const adamOpensearchClient = new AdamOpenSearchClient({
        serviceUrl: config.dasAccess.opensearchUrl
    });

    const datasetFactory = (fosDataset: FeaturedDatasetConfig) => {
        const maxRequestDepth = 4;
        const maxBBoxSize = 90;

        const splitBBox = (bbox, gridWidth = 2, gridHeight = 2) => {
            const bboxWidth = bbox[2] - bbox[0];
            const bboxHeight = bbox[3] - bbox[1];

            const requestWidth = bboxWidth / gridWidth;
            const requestHeight = bboxHeight / gridHeight;

            const outputBBoxes: number[][] = [];
            for (let i = 0; i < gridWidth; ++i) {
                for (let j = 0; j < gridHeight; ++j) {
                    const bottomLeft = [bbox[0] + i * requestWidth, bbox[1] + j * requestHeight];

                    outputBBoxes.push([bottomLeft[0], bottomLeft[1], bottomLeft[0] + requestWidth, bottomLeft[1] + requestHeight]);
                }
            }

            return outputBBoxes;
        };

        const getDataForBbox = (bbox: number[], gridWidth: number, gridHeight: number, requestDepth: number): Promise<FosPlot[]> => {
            const plots: FosPlot[] = [];
            if (requestDepth > maxRequestDepth) {
                return Promise.resolve(plots);
            }

            const requestBBoxes = splitBBox(bbox, gridWidth, gridHeight);

            // FOS apis returns a 500 errors when there are too many features in the request bbox
            // When this happens we split the requests in four subregions recursevely (up to a maximum depth)
            const requests = requestBBoxes.map((bbox) => {
                return fosClient.getPlotData(bbox).catch(() => {
                    return getDataForBbox(bbox, 2, 2, requestDepth + 1);
                });
            });

            return Promise.all(requests).then((responses) => {
                responses.forEach((response) => {
                    plots.push(...response);
                });

                return plots;
            });
        };

        let cachedData: {
            bbox: number[];
            data: FosPlot[];
        } = {
            bbox: [0, 0, 0, 0],
            data: []
        };

        const featureFilterer = getVectorFeaturesFilterer(fosPlotFeature);
        const datasetConfig: DatasetConfig = {
            id: fosDataset.id,
            name: fosDataset.name,
            filters: [],
            mapView: {
                type: VECTOR_VIZ_TYPE,
                config: {
                    dataProvider: (vectorViz) => {
                        const aoi = vectorViz.dataset.aoi?.geometry;
                        const bbox = aoi ? getGeometryExtent(aoi) || [-180, -90, 180, 90] : [-180, -90, 180, 90];

                        const filters = vectorViz.propertyFilters.asArray();
                        if (bbox.every((item, idx) => item === cachedData.bbox[idx])) {
                            return Promise.resolve(featureFilterer(cachedData.data, filters));
                        } else {
                            const bboxWidth = bbox[2] - bbox[0];
                            const bboxHeight = bbox[3] - bbox[1];

                            const gridWidth = Math.ceil(bboxWidth / maxBBoxSize);
                            const gridHeight = Math.ceil(bboxHeight / maxBBoxSize);

                            return getDataForBbox(bbox, gridWidth, gridHeight, 0).then((plots) => {
                                cachedData = {
                                    bbox: bbox,
                                    data: plots
                                };

                                return featureFilterer(plots, filters);
                            });
                        }
                    },
                    featureStyleFactory: (config) => {
                        const defaultStyleGetter = defaultVectoreFeatureStyleFactory(config);
                        return (feature: DatasetVectorFeature) => {
                            const defaultStyle = defaultStyleGetter(feature) as IFeatureStyle;
                            defaultStyle.polygon!.visible = feature.visible.value && (feature.selected.value || feature.hovered.value);
                            return defaultStyle;
                        };
                    },
                    featureDescriptor: fosPlotFeature,
                    colorScales: getPlottyColorScales()
                }
            },
            download: getAdamVectorDownloadConfig({
                opensearchClient: adamOpensearchClient,
                datasetId: config.dasAccess.datasetId,
                fixedTime: true
            })
        };

        return Promise.resolve(datasetConfig);
    };

    return datasetFactory;
};
