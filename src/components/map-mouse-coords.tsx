import React from 'react';

import { MapCoordQuantity } from '@oidajs/core';
import { MapMouseCoords as MapMouseCoordsPresentational } from '@oidajs/ui-react-antd';
import { useMapMouseCoordsFromModule, useFormatter } from '@oidajs/ui-react-mobx';

export const MapMouseCoords = () => {
    const { coords } = useMapMouseCoordsFromModule();
    const formatCoord = useFormatter(MapCoordQuantity);

    const formatLat = formatCoord
        ? (lat) => {
              return formatCoord(lat, { coordType: 'lat' });
          }
        : undefined;

    const formatLon = formatCoord
        ? (lon) => {
              return formatCoord(lon, { coordType: 'lon' });
          }
        : undefined;

    return <MapMouseCoordsPresentational coords={coords} formatLat={formatLat} formatLon={formatLon} />;
};
