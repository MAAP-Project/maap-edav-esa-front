import { v4 as uuid } from 'uuid';
import wkx from 'wkx';

import {
    AxiosInstanceWithCancellation, createAxiosInstance
} from '@oida/core';

export type FosApiClientConfig = {
    url: string;
    applicationId: string;
    intendedUse: string;
    axiosInstance?: AxiosInstanceWithCancellation;
};

export class FosApiClient {

    protected config_: FosApiClientConfig;
    protected axiosInstance_: AxiosInstanceWithCancellation;

    constructor(config: FosApiClientConfig) {
        this.config_ = config;
        this.axiosInstance_ = config.axiosInstance || createAxiosInstance();
    }

    getPlotData(bbox: number[]) {
        return this.axiosInstance_.cancelableRequest<GeoJSON.FeatureCollection>({
            url: `${this.config_.url}/DownloadBBox_extern/${bbox.join(',')}/${this.config_.intendedUse}/${this.config_.applicationId}`
        }).then((response) => {

            let plots: any[] = [];
            response.data.features.forEach((feature) => {

                const props = feature.properties;
                if (!props) {
                    return;
                }

                const data = props.Data;
                if (!data) {
                    return;
                }

                const { Plots, ...featureData } = data;

                Plots?.forEach((plot) => {

                    try {
                        let { Geometry, Geometry_Corner, Censuses, ...plotData } = plot;

                        const geometries: GeoJSON.Geometry[] = [];

                        if (Geometry) {
                            geometries.push(wkx.Geometry.parse(Geometry).toGeoJSON() as GeoJSON.Geometry);
                        }
                        if (Geometry_Corner) {
                            geometries.push(wkx.Geometry.parse(Geometry_Corner).toGeoJSON() as GeoJSON.Geometry);
                        }
                        if (!geometries.length) {
                            return;
                        }

                        const census = Censuses[0];
                        const measurements: Record<string, number> = {};
                        census.Measurements.forEach((measurement) => {
                            if (measurement.Type === 'AGB Local HD') {
                                if (measurement.Method === 'Average') {
                                    measurements['agb_local'] = measurement.ValueFloat;
                                } else if (measurement.Method === '2.5 Percent Quantil') {
                                    measurements['agb_local_2.5'] = measurement.ValueFloat;
                                } else if (measurement.Method === '2.5 Percent Quantil') {
                                    measurements['agb_local_97.5'] =  measurement.ValueFloat;
                                }
                            } else if (measurement.Type === 'AGB Feldpausch') {
                                if (measurement.Method === 'Average') {
                                    measurements['agb_feldpausch'] = measurement.ValueFloat;
                                } else if (measurement.Method === '2.5 Percent Quantil') {
                                    measurements['agb_feldpausch_2.5'] = measurement.ValueFloat;
                                } else if (measurement.Method === '2.5 Percent Quantil') {
                                    measurements['agb_feldpausch_97.5'] =  measurement.ValueFloat;
                                }
                            } else if (measurement.Type === 'AGB Chave') {
                                if (measurement.Method === 'Average') {
                                    measurements['agb_chave'] = measurement.ValueFloat;
                                } else if (measurement.Method === '2.5 Percent Quantil') {
                                    measurements['agb_chave_2.5'] = measurement.ValueFloat;
                                } else if (measurement.Method === '2.5 Percent Quantil') {
                                    measurements['agb_chave_97.5'] =  measurement.ValueFloat;
                                }
                            } else if (measurement.Type === 'H Lorey') {
                                if (measurement.Method === 'Local') {
                                    measurements['h_lorey_local'] = measurement.ValueFloat;
                                } else if (measurement.Method === 'Chave') {
                                    measurements['h_lorey_chave'] = measurement.ValueFloat;
                                } else if (measurement.Method === 'Feldpausch') {
                                    measurements['h_lorey_feldpausch'] =  measurement.ValueFloat;
                                }
                            } else if (measurement.Type === 'H Max') {
                                if (measurement.Method === 'Local') {
                                    measurements['h_max_local'] = measurement.ValueFloat;
                                } else if (measurement.Method === 'Chave') {
                                    measurements['h_max_chave'] = measurement.ValueFloat;
                                } else if (measurement.Method === 'Feldpausch') {
                                    measurements['h_max_feldpausch'] =  measurement.ValueFloat;
                                }
                            } else if (measurement.Type === 'Basal Area') {
                                measurements['basal_area'] = measurement.ValueFloat;
                            } else if (measurement.Type === 'Tree Density') {
                                measurements['tree_density'] = measurement.ValueInt;
                            } else if (measurement.Type === 'Wood Density') {
                                measurements['wood_density'] = measurement.ValueFloat;
                            } else if (measurement.Type === 'Min DBH') {
                                measurements['min_dbh'] = measurement.ValueInt;
                            } else if (measurement.Type === 'Growing Stock Volume') {
                                measurements['gsv'] = measurement.ValueFloat;
                            }
                        });

                        plots.push({
                            id: plotData.Id || uuid(),
                            geometry: {
                                type: 'GeometryCollection',
                                geometries: geometries
                            },
                            properties: {
                                ...featureData,
                                ...plotData,
                                ...measurements,
                                censusDate: census.From,
                                taxonomicIdentifications: census.TaxonomicIdentifications,
                                Name: `${featureData.Name} (${plotData.Name})`
                            }
                        });
                    } catch {

                    }
                });
            });

            return plots;

        });
    }
}

