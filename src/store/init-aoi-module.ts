import { AoiModule, MapModule, GeoJsonAoiParser } from '@oidajs/ui-react-mobx';

export const initAoiModule = (mapModule: MapModule) => {

    const aoiModule = new AoiModule({
        mapModule: mapModule,
        config: {
            aoiFormats: [{
                id: 'geojson',
                name: 'GeoJSON',
                supportedFileTypes: ['json', 'geojson'],
                parser: GeoJsonAoiParser
            }]
        }
    });

    return aoiModule;
};
