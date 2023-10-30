import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { App as AntdApp, ConfigProvider } from 'antd';
import axios from 'axios';
import { Pool } from 'geotiff';

import { createAppStoreContext } from '@oidajs/ui-react-mobx';
import { GeotiffRenderer } from '@oidajs/eo-geotiff';

import { createAppStore } from './store';
import { App } from './app';
import theme from '../style/theme';

Promise.all([axios.get('data/config.json'), axios.get('data/discovery.json')]).then(([configResponse, discoveryResponse]) => {
    let baseHref = '/';
    const baseElement = document.querySelector('base');
    if (baseElement) {
        baseHref = baseElement.getAttribute('href') || '/';
    }

    const config = {
        ...configResponse.data,
        discovery: discoveryResponse.data
    };
    const appState = createAppStore(config);
    createAppStoreContext(appState);

    GeotiffRenderer.setDecoder(new Pool(2));

    const appContainer = document.getElementById('app_container');
    if (appContainer) {
        const root = createRoot(appContainer);
        root.render(
            <Router basename={baseHref}>
                <DndProvider backend={HTML5Backend}>
                    <ConfigProvider theme={theme}>
                        <AntdApp>
                            <App appState={appState} />
                        </AntdApp>
                    </ConfigProvider>
                </DndProvider>
            </Router>
        );
    }
});
