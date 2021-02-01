import {
    formatMapCoord, MapCoordQuantity,
    formatDate, DateQuantity,
    formatFilesize, FilesizeQuantity, FilesizeUnit
} from '@oida/core';

import { FormattersModule } from '@oida/ui-react-mobx';

export const initFormattersModule = () => {
    const formatters = [
        {
            quantity: MapCoordQuantity,
            formatter: formatMapCoord,
            formatterOptionPresets: [
                {
                    id: 'dms',
                    name: 'DMS',
                    options: {
                        format: 'dms',
                    }
                },
                {
                    id: 'deg',
                    name: 'Decimal',
                    options: {
                        format: 'dec',
                        precision: 3
                    }
                }
            ],
            initialOptions: 'dms'
        }, {
            quantity: DateQuantity,
            formatter: formatDate,
            formatterOptionPresets: [
                {
                    id: 'utc',
                    name: 'UTC',
                    options: {
                        format: 'YYYY-MM-DD HH:mm:ss',
                    }
                }
            ],
            initialOptions: 'utc'
        }, {
            quantity: FilesizeQuantity,
            formatter: formatFilesize,
            formatterOptionPresets: [
                {
                    id: 'auto',
                    name: 'Auto',
                    options: {
                        inputUnits: FilesizeUnit.Byte,
                        precision: 0,
                        appendUnits: true
                    }
                }
            ],
            initialOptions: 'auto'
        }
    ];

    const formattersModule = new FormattersModule({
        config: {
            formatters: formatters
        }
    });

    return formattersModule;
};
