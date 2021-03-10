import React, { useState } from 'react';
import classnames from 'classnames';

import { Button, Tooltip } from 'antd';
import { MenuUnfoldOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';

import { DatasetExplorer, DATASET_AOI_FILTER_KEY } from '@oida/eo-mobx';
import { DatasetExplorerMapViz } from '@oida/eo-mobx-react';
import { useFormData } from '@oida/ui-react-mobx';
import { AoiAction, getAoiFieldFactory } from '@oida/core';
import { AdvancedSearchFilterer } from '@oida/ui-react-antd';

export type DatasetLayerPaneProps = {
    explorerState: DatasetExplorer;
    onAddLayerClick: () => void
    title?: string;
};

export const DatasetLayerPane = (props: DatasetLayerPaneProps) => {

    const [paneVisible, setPaneVisible] = useState(true);

    let content: JSX.Element;
    const title = props.title || 'Map datasets';

    const aoiFieldFactory = getAoiFieldFactory();

    const aoiFilterConfig = aoiFieldFactory({
        name: DATASET_AOI_FILTER_KEY,
        supportedActions: [AoiAction.DrawBBox, AoiAction.DrawPolygon, AoiAction.Import],
        supportedGeometries: [{type: 'BBox'}, {type: 'Polygon'}],
        title: 'Area of interest'
    });

    const commonFilters = useFormData({
        fieldValues: props.explorerState.commonFilters,
        fields: [aoiFilterConfig]
    });

    if (!paneVisible) {
        content = (
            <Tooltip title={title}>
                <Button
                    icon={<MenuUnfoldOutlined/>}
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
                {commonFilters &&
                    <AdvancedSearchFilterer
                        expandButtonTooltip='Datasets subsetting'
                        {...commonFilters}
                    />
                }
                <DatasetExplorerMapViz
                    explorerState={props.explorerState}
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
