import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import { Button, Tooltip } from 'antd';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';

import { DatasetExplorer } from '@oida/eo-mobx';
import { DatasetExplorerMapViz } from '@oida/eo-mobx-react';
import { useSelector } from '@oida/ui-react-mobx';
import { LayerGroupSolidIcon } from '@oida/ui-react-antd';

import { getAnalyticsTools } from '../store';

export type DatasetLayerPaneProps = {
    explorerState: DatasetExplorer;
    onAddLayerClick: () => void
    title?: string;
};

export const DatasetLayerPane = (props: DatasetLayerPaneProps) => {

    const [paneVisible, setPaneVisible] = useState(true);

    let content: JSX.Element;
    const title = props.title || 'Map datasets';

    const explorerAoi = useSelector(() => props.explorerState.aoi);

    const analyticsTools = useMemo(() => {
        return getAnalyticsTools(props.explorerState);
    }, []);

    if (!paneVisible) {
        content = (
            <Tooltip title={title}>
                <Button
                    size='large'
                    icon={<LayerGroupSolidIcon/>}
                    onClick={() => setPaneVisible(true)}
                />
            </Tooltip>
        );
    } else {
        content = (
            <React.Fragment>
                <div className='dataset-layer-pane-header'>
                    <Tooltip title={'Minimize'}>
                        <Button
                            className='dataset-layer-pane-minimize-btn'
                            icon={<LeftOutlined/>}
                            onClick={() => setPaneVisible(false)}
                        />
                    </Tooltip>
                    <div className='dataset-layer-pane-title'>{title}</div>
                    <Button
                    type='primary'
                        icon={<PlusOutlined/>}
                        onClick={() => props.onAddLayerClick()}
                    >
                        Add datasets
                    </Button>
                </div>
                <DatasetExplorerMapViz
                    explorerState={props.explorerState}
                    analyticsTools={analyticsTools}
                />
            </React.Fragment>
        );
    }

    return (
        <div className={classnames('dataset-layer-pane', {'is-expanded': paneVisible})}>
            {content}
        </div>
    );
};
