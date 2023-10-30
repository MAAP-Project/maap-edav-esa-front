import React from 'react';

import { useSelector } from '@oidajs/ui-react-mobx';
import { DatasetExplorer } from '@oidajs/eo-mobx';
import { DatasetDiscoveryTimeline } from '@oidajs/eo-mobx-react';

export type DatasetTimelineProps = {
    datasetExplorer: DatasetExplorer;
};

export const DatasetTimeline = (props: DatasetTimelineProps) => {
    const enableTimeline = useSelector(() => props.datasetExplorer.shouldEnableTimeExplorer);

    if (!enableTimeline) {
        return null;
    }

    return <DatasetDiscoveryTimeline explorerState={props.datasetExplorer} />;
};
