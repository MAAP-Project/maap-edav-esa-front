import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { autorun } from 'mobx';
import { Button, Tooltip, Form } from 'antd';
import { LeftOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';

import { AoiAction, AOI_FIELD_ID, getAoiFieldFactory } from '@oida/core';
import { DataFilters } from '@oida/state-mobx';
import { DatasetExplorer } from '@oida/eo-mobx';
import { DatasetExplorerMapViz } from '@oida/eo-mobx-react';
import { useSelector } from '@oida/ui-react-mobx';
import { LayerGroupSolidIcon, AdvancedSearchFilterer } from '@oida/ui-react-antd';

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

    const [datasetFilters] = useState(() => new DataFilters());

    useEffect(() => {
        const filtersUpdaterDisposer = autorun(() => {
            const aoi = props.explorerState.aoi;
            if (aoi) {
                datasetFilters.set('aoi', aoi, AOI_FIELD_ID);
            } else {
                datasetFilters.unset('aoi');
            }
        });

        return filtersUpdaterDisposer;
    }, [datasetFilters]);

    const datasetFiltersValues = useSelector(() => {
        const items = datasetFilters.items;
        const values = new Map();
        items.forEach((item) => {
            values.set(item.key, item.value);
        });
        return values;
    });

    const aoiFieldFactory = getAoiFieldFactory();

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
                <AdvancedSearchFilterer
                    expandButtonTooltip='Datasets subsetting'
                    fields={[aoiFieldFactory({
                        name: 'aoi',
                        supportedActions: [AoiAction.DrawBBox, AoiAction.DrawPolygon, AoiAction.Import],
                        supportedGeometries: [{type: 'BBox'}, {type: 'Polygon'}],
                        title: 'Area of interest'
                    })]}
                    onFieldChange={(name, value) => {
                        if (name === 'aoi') {
                            props.explorerState.setAoi(value);
                        }
                    }}
                    values={datasetFiltersValues}
                    searchIcon={<FilterOutlined/>}
                />
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
