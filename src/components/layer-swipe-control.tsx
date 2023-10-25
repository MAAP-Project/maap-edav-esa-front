import React from 'react';

import { MapLayerSwipeTool } from '@oidajs/ui-react-antd';
import { useLayerSwipeInteractionFromModule, useSelector } from '@oidajs/ui-react-mobx';
import { DatasetExplorer } from '@oidajs/eo-mobx';

export type LayerSwipeControlProps = {
    datasetExplorer: DatasetExplorer;
};

export const LayerSwipeControl = (props: LayerSwipeControlProps) => {
    const swipeProps = useLayerSwipeInteractionFromModule();
    const targetDatasetName = useSelector(() => {
        const targetDataset = props.datasetExplorer.items.find((item) => item.mapViz?.mapLayer?.id === swipeProps?.targetLayerId);
        return targetDataset?.mapViz?.name;
    }, [swipeProps]);
    if (swipeProps) {
        return <MapLayerSwipeTool targetName={targetDatasetName} sourceName='Other map layers' horizontalMargin={10} {...swipeProps} />;
    } else {
        return null;
    }
};
