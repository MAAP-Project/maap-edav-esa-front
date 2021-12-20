import React from 'react';

import { MapNavTools } from '@oidajs/ui-react-antd';
import { useMapNavControlsFromModule } from '@oidajs/ui-react-mobx';


export const MapNavControls = () => {
    const navActions = useMapNavControlsFromModule();
    return <MapNavTools {...navActions} />;
};
