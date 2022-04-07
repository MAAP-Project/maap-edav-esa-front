import React from 'react';
import moment from 'moment';

import { getGeometryExtent, IFeatureStyle } from '@oidajs/core';
import {
    DatasetConfig, DatasetVectorFeature, defaultVectoreFeatureStyleFactory,
    getVectorFeaturesFilterer, VectorFeatureDescriptor, VECTOR_VIZ_TYPE
} from '@oidajs/eo-mobx';
import { getPlottyColorScales } from '@oidajs/eo-geotiff';

import { FeaturedDatasetConfig } from '../discovery';
import { FosApiClient, FosApiClientConfig } from './fos-api-client';


export const getFosDatasetFactory = (config: FosApiClientConfig) => {

    const fosClient = new FosApiClient(config);

    const fosPlotFeature: VectorFeatureDescriptor =  {
        typeName: 'fosPlot',
        properties: [{
            type: 'string',
            id: 'Name',
            name: 'Name'
        }, {
            type: 'string',
            id: 'Country',
            name: 'Country'
        }, {
            type: 'number',
            id: 'Area',
            name: 'Area',
            filterable: true,
            units: 'ha',
            domain: {
                min: 0,
                max: 3
            }
        }, {
            type: 'number',
            id: 'Altitude',
            name: 'Altitude',
            filterable: true,
            units: 'm',
            domain: {
                min: 0,
                max: 2000
            }
        }, {
            type: 'number',
            id: 'Slope',
            name: 'Slope',
            units: '%',
            filterable: true,
            domain: {
                min: 0,
                max: 100
            }
        }, {
            type: 'number',
            id: 'agb_local',
            name: 'Above Ground Biomass (local)',
            description: 'Above ground biomass estimated using local equations or equation 4 in Chave et al., 2014 with wood density, DBH and H derived from local height-diameter relationships',
            units: 't ha-1',
            filterable: true,
            domain: {
                min: 0,
                max: 1000
            }
        }, {
            type: 'number',
            id: 'agb_feldpausch',
            name: 'Above Ground Biomass (Feldpausch)',
            description: 'Above ground biomass estimated using equation 4 in Chave et al., 2014 with wood density, DBH and H derived from Feldpausch et al, 2012 height-diameter relationship',
            units: 't ha-1',
            filterable: true,
            domain: {
                min: 0,
                max: 1000
            }
        }, {
            type: 'number',
            id: 'agb_chave',
            name: 'Above Ground Biomass (Chave)',
            description: 'Above ground biomass estimated using equation 7 in Chave et al., 2014 with wood density, DBH and H implicitly taken into consideration through the use of the bioclimatic predictor E',
            units: 't ha-1',
            filterable: true,
            domain: {
                min: 0,
                max: 1000
            }
        }, {
            type: 'number',
            id: 'h_lorey_local',
            name: 'Height Lorey\'s (local)',
            description: 'DBH weighted mean tree height calculated based on local H=f(DBH) curve',
            units: 'm',
            filterable: true,
            domain: {
                min: 0,
                max: 50
            }
        }, {
            type: 'number',
            id: 'h_lorey_feldpausch',
            name: 'Height Lorey\'s (Feldpausch)',
            description: 'Mean height calculated based on the curve by Feldpausch',
            units: 'm',
            filterable: true,
            domain: {
                min: 0,
                max: 50
            }
        }, {
            type: 'number',
            id: 'h_lorey_chave',
            name: 'Height Lorey\'s (Chave)',
            description: 'Mean height calculated based on the curve by Chave',
            units: 'm',
            filterable: true,
            domain: {
                min: 0,
                max: 50
            }
        }, {
            type: 'number',
            id: 'h_max_local',
            name: 'Height Max (local)',
            description: 'Height of the tallest tree calculated based on local H=f(DBH) curve',
            units: 'm',
            filterable: true,
            domain: {
                min: 0,
                max: 80
            }
        }, {
            type: 'number',
            id: 'h_max_feldpausch',
            name: 'Height Max (Feldpausch)',
            description: 'Max height calculated based on the curve by Feldpausch',
            units: 'm',
            filterable: true,
            domain: {
                min: 0,
                max: 80
            }
        }, {
            type: 'number',
            id: 'h_max_chave',
            name: 'Height Max (Chave)',
            description: 'Max height calculated based on the curve by Chave',
            units: 'm',
            filterable: true,
            domain: {
                min: 0,
                max: 80
            }
        }, {
            type: 'number',
            id: 'basal_area',
            name: 'Basal Area',
            units: 'm2 ha-1',
            filterable: true,
            domain: {
                min: 0,
                max: 100
            }
        }, {
            type: 'number',
            id: 'gsv',
            name: 'Growing Stock Volume',
            units: 'm3 ha-1',
            filterable: true,
            domain: {
                min: 0,
                max: 1500
            }
        }, {
            type: 'number',
            id: 'wood_density',
            name: 'Wood density',
            units: 't m-3',
            filterable: true,
            domain: {
                min: 0,
                max: 1
            }
        }, {
            type: 'number',
            id: 'tree_density',
            name: 'Stem density',
            units: 'stem ha-1',
            filterable: true,
            domain: {
                min: 0,
                max: 3000
            }
        }, {
            type: 'number',
            id: 'min_dbh',
            name: 'Min DBH',
            filterable: true,
            description: 'Minimum diameter of trees at breast height included in the census',
            units: 'cm',
            domain: {
                min: 0,
                max: 10
            }
        }, {
            type: 'date',
            id: 'Established',
            name: 'Establishment date',
            formatter: (value) => {
                return moment.utc(value).format('YYYY');
            }
        }, {
            type: 'date',
            id: 'censusDate',
            name: 'Census date',
            formatter: (value) => {
                return moment.utc(value).format('YYYY');
            }
        }, {
            type: 'string',
            id: 'Network',
            name: 'Network'
        }, {
            type: 'string',
            id: 'Institutions',
            name: 'Institutions',
            isArray: true
        }, {
            type: 'string',
            id: 'PIs',
            name: 'Principal Investigators',
            isArray: true
        }, {
            type: 'string',
            id: 'Url',
            name: 'Data provider',
            subType: 'url'
        }, {
            type: 'string',
            id: 'BiomassProcessingProtocol',
            name: 'Biomass processing protocol',
            subType: 'url',
            formatter: (value) => {
                return <a href={`${config.url}/Docs/biomass_processing_protocol/${value}`} target='_blank'>{value}</a>;
            }
        }, {
            type: 'composite',
            id: 'taxonomicIdentifications',
            name: 'Taxonomic Identifications',
            isArray: true,
            properties: [{
                type: 'string',
                id: 'Genus',
                name: 'Genus'
            }, {
                type: 'string',
                id: 'Species',
                name: 'Species'
            }, {
                type: 'number',
                id: 'Percentage',
                name: 'Percentage'
            }, {
                type: 'number',
                id: 'Count',
                name: 'Count'
            }],
            formatter: (value) => {
                if (!value) {
                    return 'N/A';
                } else {
                    return `${value.Genus} ${value.Species}: ${value.Percentage}% (${value.Count})`;
                }
            }
        }, {
            type: 'string',
            id: 'Photos',
            name: 'Pictures',
            isArray: true,
            formatter: (value, idx) => {
                const url = `${config.url}/Images/sites/${value}`;
                return <img src={url} key={`Photos_${idx}`}/>;
            }
        }]
    };

    const datasetFactory = (fosDataset: FeaturedDatasetConfig) => {


        let cachedData: {
            bbox: number[],
            data: any[]
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
                        const bbox = aoi ? getGeometryExtent(aoi) : undefined;
                        if (!bbox) {


                            const filters = vectorViz.propertyFilters.asArray();
                            if (cachedData.bbox.length === 0) {
                                return Promise.resolve(featureFilterer(cachedData.data, filters));
                            } else {
                                const gridSize = [4, 2];
                                const bboxes: number[][] = [];
                                const bw = 360 / gridSize[0];
                                const bh = 180 / gridSize[1];

                                for (let i = 0; i < gridSize[0]; ++i) {
                                    for (let j = 0; j < gridSize[1]; ++j) {
                                        const bl = [-180 + bw * i, -90 + bh * j];
                                        bboxes.push([bl[0], bl[1], bl[0] + bw, bl[1] + bh]);
                                    }
                                }
                                return Promise.all(bboxes.map((bbox) => {
                                    return fosClient.getPlotData(bbox).catch(() => {
                                        const bw = (bbox[2] - bbox[0]) / 2;
                                        const bh = (bbox[3] - bbox[1]) / 2;
                                        return Promise.all([
                                            fosClient.getPlotData([bbox[0], bbox[1], bbox[0] + bw, bbox[1] + bh]),
                                            fosClient.getPlotData([bbox[0] + bw, bbox[1], bbox[0] + 2 * bw, bbox[1] + bh]),
                                            fosClient.getPlotData([bbox[0], bbox[1] + bh, bbox[0], bbox[1] + 2 * bh]),
                                            fosClient.getPlotData([bbox[0] + bw, bbox[1] + bh, bbox[0] + 2 * bw, bbox[1] + 2 * bh])
                                        ]).then((data) => {
                                            return ([] as any).concat(...data);
                                        });
                                    });
                                })).then((data) => {
                                    cachedData = {
                                        bbox: [],
                                        data: ([] as any).concat(...data)
                                    };

                                    return featureFilterer(cachedData.data, filters);
                                });
                            }
                        } else {
                            const filters = vectorViz.propertyFilters.asArray();
                            if (bbox.every((item, idx) => item === cachedData.bbox[idx])) {
                                return Promise.resolve(featureFilterer(cachedData.data, filters));
                            } else {
                                return fosClient.getPlotData(bbox).then((data) => {
                                    cachedData = {
                                        bbox: bbox,
                                        data: data
                                    };
                                    return featureFilterer(data, filters);
                                });
                            }
                        }
                    },
                    featureStyleFactory: (color?: string) => {
                        const defaultStyleGetter = defaultVectoreFeatureStyleFactory(color);
                        return (feature: DatasetVectorFeature) => {
                            const defaultStyle = defaultStyleGetter(feature) as IFeatureStyle;
                            defaultStyle.polygon!.visible = feature.visible.value && (feature.selected.value || feature.hovered.value);
                            return defaultStyle;
                        };
                    },
                    featureDescriptor: fosPlotFeature,
                    colorScales: getPlottyColorScales()
                }
            }
        };

        return Promise.resolve(datasetConfig);
    };

    return datasetFactory;
};
