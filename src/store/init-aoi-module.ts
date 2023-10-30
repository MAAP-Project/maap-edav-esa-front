import { AoiModule, MapModule, GeoJsonAoiParser, defaultAoiStyleGetter } from '@oidajs/ui-react-mobx';

export const initAoiModule = (mapModule: MapModule) => {
    const aoiModule = new AoiModule({
        mapModule: mapModule,
        config: {
            aoiFormats: [
                {
                    id: 'geojson',
                    name: 'GeoJSON',
                    supportedFileTypes: ['json', 'geojson'],
                    parser: GeoJsonAoiParser
                }
            ]
        },
        aoiStyleGetter: (aoi) => {
            const style = defaultAoiStyleGetter(aoi);
            if (style.polygon) {
                style.polygon.fillColor = [0, 0, 0, 0.01];
                style.polygon.visible = aoi.visible.value || aoi.hovered.value;
            }
            return style;
        }
    });

    return aoiModule;
};
