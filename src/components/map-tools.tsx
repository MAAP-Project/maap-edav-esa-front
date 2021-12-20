import React from 'react';

import { DatasetExplorer } from '@oidajs/eo-mobx';

import { MapNavControls } from './map-nav-controls';
import { AoiTool } from './aoi-tool';

export type MapToolsProps = {
    explorerState: DatasetExplorer;
};

export const MapTools = (props: MapToolsProps) => {
    return (
        <div className='map-tools'>
            <AoiTool explorerState={props.explorerState}/>
            <MapNavControls/>
        </div>
    );
};
