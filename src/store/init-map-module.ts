import { MapModule } from '@oida/ui-react-mobx';

import '@oida/map-ol';
import '@oida/map-cesium';
import '@oida/map-cesium-ol-tile-source';
import { FeatureHoverInteraction, FeatureSelectInteraction } from '@oida/state-mobx';

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

            }
        }
    };

    const { baseLayers, projections, renderers, initialOptions, initialState } = config;

    const mapModule = new MapModule({
        map: {
            ...defaultInitialState,
            ...initialState
        },
        config: {
             baseLayers: baseLayers,
             projections: projections,
             renderers: renderers,
             initialOptions: initialOptions
        }
    });

    mapModule.map.interactions.add(new FeatureHoverInteraction({
        selectionManager: mapModule.selectionManager
    }));

    mapModule.map.interactions.add(new FeatureSelectInteraction({
        config: {
            multiple: true
        },
        selectionManager: mapModule.selectionManager
    }));

    return mapModule;
};
