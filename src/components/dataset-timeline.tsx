import React from 'react';

import { useSelector } from '@oida/ui-react-mobx';
import { DatasetExplorer } from '@oida/eo-mobx';
import { DatasetDiscoveryTimeline } from '@oida/eo-mobx-react';


export type DatasetTimelineProps = {
    datasetExplorer: DatasetExplorer;
};

export const DatasetTimeline = (props: DatasetTimelineProps) => {
    const enableTimeline = useSelector(() => props.datasetExplorer.shouldEnableTimeExplorer);

    if (!enableTimeline) {
        return null;
    }

    return <DatasetDiscoveryTimeline
        explorerState={props.datasetExplorer}
    />;
};
