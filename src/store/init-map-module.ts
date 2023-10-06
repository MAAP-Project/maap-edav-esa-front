import { MapModule } from '@oidajs/ui-react-mobx';

import '@oidajs/map-ol';
import '@oidajs/map-cesium';
import '@oidajs/map-cesium-ol-tile-source';
import { FeatureHoverInteraction, FeatureSelectInteraction } from '@oidajs/state-mobx';

export const initMapModule = (config) => {
    const defaultInitialState = {
        renderer: {
            id: 'cesium'
        },
        view: {
            viewport: {
                center: [12, 41],
                resolution: 3000
            },
            config: {
                animateOnChange: true
            }
        }
    };

    const { baseLayers, projections, renderers, initialOptions, initialState } = config;

    const mapModule = new MapModule({
        map: {
            ...defaultInitialState,
            ...initialState,
            view: {
                viewport: {
                    ...defaultInitialState.view.viewport,
                    ...initialState.view.viewport
                },
                config: {
                    ...defaultInitialState.view.config,
                    ...initialState.view.config
                }
            }
        },
        config: {
            baseLayers: baseLayers,
            projections: projections,
            renderers: renderers,
            initialOptions: initialOptions
        }
    });

    mapModule.map.interactions.add(
        new FeatureHoverInteraction({
            selectionManager: mapModule.selectionManager
        })
    );

    mapModule.map.interactions.add(
        new FeatureSelectInteraction({
            config: {
                multiple: true
            },
            selectionManager: mapModule.selectionManager
        })
    );

    return mapModule;
};
