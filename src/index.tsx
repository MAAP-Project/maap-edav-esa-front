import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import axios from 'axios';
import { Pool } from 'geotiff';

import { createAppStoreContext } from '@oidajs/ui-react-mobx';
import { GeotiffRenderer } from '@oidajs/eo-geotiff';

import { createAppStore } from './store' ;
import { App } from './app';


Promise.all([
    axios.get('data/config.json'),
    axios.get('data/discovery.json')
]).then(([configResponse, discoveryResponse]) => {

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

    GeotiffRenderer.setDecoder(new Pool());

    render(
        (
            <Router basename={baseHref}>
                <DndProvider backend={HTML5Backend}>
                    <App appState={appState}/>
                </DndProvider>
            </Router>
        ),
        document.getElementById('app_container')
    );

});
