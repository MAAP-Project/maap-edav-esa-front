import React from 'react';

import { BOOLEAN_FIELD_ID, IFormFieldDefinition } from '@oidajs/core';
import { ChoiceSelectorCombo, DataForm } from '@oidajs/ui-react-antd';
import {
    useSelector,
    useMapModule,
    useMapBaseLayerSelectorFromModule,
    useMapRendererSelectorFromModule,
    useMapProjectionSelectorFromModule
} from '@oidajs/ui-react-mobx';

const cesiumRendererOptions: IFormFieldDefinition[] = [
    {
        name: 'allowFreeCameraRotation',
        type: BOOLEAN_FIELD_ID,
        title: 'Allow free rotation',
        rendererConfig: {
            id: 'switch'
        },
        config: {}
    }
];

export const AppSettings = () => {
    const baseLayerSelectorProps = useMapBaseLayerSelectorFromModule();
    const rendererSelectorProps = useMapRendererSelectorFromModule();
    const projectionSelectorProps = useMapProjectionSelectorFromModule();

    const mapState = useMapModule();

    const mapRenderer = useSelector(() => {
        const renderer = mapState.map.renderer;
        return {
            id: renderer.id,
            props: new Map<string, any>(Object.entries(renderer.options))
        };
    });

    const onRendererPropChange = (name, value) =>
        mapState.map.renderer.setOptions({
            [name]: value
        });

    return (
        <div className='app-settings'>
            <div className='app-settings-control'>
                <div className='app-settings-control-title'>Map background:</div>
                <ChoiceSelectorCombo {...baseLayerSelectorProps} />
            </div>
            {mapRenderer.id === 'ol' && (
                <div className='app-settings-control'>
                    <div className='app-settings-control-title'>Map projection:</div>
                    <ChoiceSelectorCombo {...projectionSelectorProps} />
                </div>
            )}
            <div className='app-settings-control'>
                <div className='app-settings-control-title'>Map rendering mode:</div>
                <ChoiceSelectorCombo {...rendererSelectorProps} />
            </div>
            {mapRenderer.id === 'cesium' && (
                <DataForm fields={cesiumRendererOptions} values={mapRenderer.props} onFieldChange={onRendererPropChange} />
            )}
        </div>
    );
};
