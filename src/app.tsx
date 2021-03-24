import React from 'react';
import { Route, useHistory } from 'react-router';

import { ThreeColumnLayout, ScrollableOverlay } from '@oida/ui-react-core';
import { MapComponentFromModule as MapComponent } from '@oida/ui-react-mobx';
import { DatasetAnalysesDashboard, DatasetDiscoveryDrawer } from '@oida/eo-mobx-react';

import { AppHeader, DatasetTimeline, DatasetLayerPane, MapMouseCoords } from './components';
import { AppState } from './store' ;

import '../style/app.less';

export type AppProps = {
    appState: AppState;
};

export const App = (props: AppProps) => {

    const history = useHistory();

    return (
        <React.Fragment>
            <MapComponent/>
            <ThreeColumnLayout
                className='app-layout'
                left={
                    <DatasetLayerPane
                        explorerState={props.appState.datasetExplorer}
                        onAddLayerClick={() => history.push('/discovery', {updateLocationFromState: true})}
                    />
                }
                main={
                    <React.Fragment>
                        <AppHeader/>
                        <ScrollableOverlay className='analysis-scrollable-overlay'>
                            <DatasetAnalysesDashboard
                                datasetsExplorer={props.appState.datasetExplorer}
                                numCols={40}
                                rowSnapHeight={10}
                                compactType={null}
                                preventCollision={true}
                                defaultWidgetPosition={{
                                    x: 20,
                                    y: 0,
                                    w: 20,
                                    h: 20
                                }}
                            />
                        </ScrollableOverlay>
                    </React.Fragment>
                }
                bottom={
                    <React.Fragment>
                        <DatasetTimeline
                            datasetExplorer={props.appState.datasetExplorer}
                        />
                        <MapMouseCoords/>
                    </React.Fragment>
                }
            />
            <Route path='/discovery'>
                <React.Fragment>
                    <DatasetDiscoveryDrawer
                        datasetDiscovery={props.appState.datasetDiscovery}
                        datasetExplorer={props.appState.datasetExplorer}
                        width={500}
                        zIndex={100}
                        onClose={() => {
                            history.push(`/`);
                        }}
                    />
                </React.Fragment>
            </Route>
        </React.Fragment>
    );
};
