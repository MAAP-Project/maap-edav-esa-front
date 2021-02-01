import React from 'react';

import { BOOLEAN_FIELD_ID, AnyFormFieldDefinition } from '@oida/core';
import { ChoiceSelectorCombo, FormRenderer } from '@oida/ui-react-antd';
import {
    useSelector, useMapModule,
    useMapBaseLayerSelectorFromModule, useMapRendererSelectorFromModule, useMapProjectionSelectorFromModule
} from '@oida/ui-react-mobx';


const cesiumRendererOptions: AnyFormFieldDefinition[] = [{
    name: 'allowFreeCameraRotation',
    type: BOOLEAN_FIELD_ID,
    title: 'Allow free rotation',
    rendererConfig: {
        id: 'switch'
    },
    config: {}
}];

export const AppSettings = () => {

    let baseLayerSelectorProps = useMapBaseLayerSelectorFromModule();
    let rendererSelectorProps = useMapRendererSelectorFromModule();
    let projectionSelectorProps = useMapProjectionSelectorFromModule();

    let mapState = useMapModule();

    let mapRenderer = useSelector(() => {
        let renderer = mapState.map.renderer;
        return {
            id: renderer.id,
            props: new Map<string, any>(Object.entries(renderer.options))
        };
    });

    const onRendererPropChange = (name, value) => mapState.map.renderer.setOptions({
        [name]: value
    });

    return (
        <div className='app-settings'>
            <div className='app-settings-control'>
                <div className='app-settings-control-title'>Map background:</div>
                <ChoiceSelectorCombo {...baseLayerSelectorProps}/>
            </div>
            {mapRenderer.id === 'ol' && <div className='app-settings-control'>
                <div className='app-settings-control-title'>Map projection:</div>
                <ChoiceSelectorCombo {...projectionSelectorProps}/>
            </div>}
            <div className='app-settings-control'>
                <div className='app-settings-control-title'>Map rendering mode:</div>
                <ChoiceSelectorCombo {...rendererSelectorProps}/>
            </div>
            {mapRenderer.id === 'cesium' && <FormRenderer
                fields={cesiumRendererOptions}
                values={mapRenderer.props}
                onFieldChange={onRendererPropChange}
            />}
        </div>
    );

};
