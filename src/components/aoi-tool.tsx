import React from 'react';

import { AoiAction, AoiFieldConfig, getAoiFieldFactory } from '@oidajs/core';
import { AoiDrawTool } from '@oidajs/ui-react-antd';
import { DatasetExplorer } from '@oidajs/eo-mobx';
import { useSelector } from '@oidajs/ui-react-mobx';

export type AoiToolProps = {
    explorerState: DatasetExplorer;
};

export const AoiTool = (props: AoiToolProps) => {
    const aoiFieldFactory = getAoiFieldFactory();

    const aoiField = aoiFieldFactory({
        name: 'aoi',
        supportedActions: [AoiAction.DrawBBox, AoiAction.DrawPolygon, AoiAction.Import],
        supportedGeometries: [{ type: 'BBox' }, { type: 'Polygon' }],
        title: 'Area of interest'
    });

    const aoiValue = useSelector(() => {
        return props.explorerState.aoi;
    });

    const onAoiChange = (value) => {
        props.explorerState.setAoi(value);
    };

    let aoiFieldConfig: AoiFieldConfig;

    if (typeof aoiField.config === 'function') {
        aoiFieldConfig = aoiField.config({
            value: aoiValue,
            onChange: onAoiChange
        });
    } else {
        aoiFieldConfig = aoiField.config;
    }

    return <AoiDrawTool value={aoiValue} onChange={onAoiChange} config={aoiFieldConfig} size='middle' />;
};
