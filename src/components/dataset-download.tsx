import React, { useState } from 'react';
import { Modal, Button, App } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';

import { DatasetDownloadConfig } from '@oidajs/eo-mobx';
import { AdamDatasetDownloadConfig } from '@oidajs/eo-adapters-adam';
import { DatasetDownloadFormSubmitState, DatasetVizDownload, DatasetVizDownloadModalProps } from '@oidajs/eo-mobx-react';
import { useAppStore } from '@oidajs/ui-react-mobx';

import { AppState } from '../store';

export const DatasetDownloadModal = (props: DatasetVizDownloadModalProps) => {
    const appState = useAppStore<AppState>();
    const { message } = App.useApp();

    const downloadConfig: AdamDatasetDownloadConfig | DatasetDownloadConfig | undefined = props.datasetViz.dataset.config.download;

    if (!downloadConfig) {
        return null;
    }

    const formId = 'dataset-viz-download-form';

    const [visible, setVisible] = useState(true);
    const [formState, setFormState] = useState<DatasetDownloadFormSubmitState>(DatasetDownloadFormSubmitState.Ready);

    const [formInstance] = useForm(props.formInstance);

    const onSubmitStateChange = (submitState: DatasetDownloadFormSubmitState) => {
        setFormState(submitState);
        if (submitState === DatasetDownloadFormSubmitState.Success) {
            setVisible(false);
        }
    };

    return (
        <Modal
            title={`${props.datasetViz.dataset.config!.name} download`}
            open={visible}
            afterClose={props.onClose}
            destroyOnClose={true}
            onCancel={() => setVisible(false)}
            footer={
                <React.Fragment>
                    <Button onClick={() => setVisible(false)}>Cancel</Button>
                    {(downloadConfig as AdamDatasetDownloadConfig).downloadUrlProvider && (
                        <Button
                            icon={<CopyOutlined />}
                            onClick={() => {
                                formInstance.validateFields().then(() => {
                                    const values = formInstance.getFieldsValue();

                                    (downloadConfig as AdamDatasetDownloadConfig)
                                        .downloadUrlProvider({
                                            datasetViz: props.datasetViz,
                                            ...values
                                        })
                                        .then((request) => {
                                            let clipboardText = appState.wcsUrlMapper.mapToInternalUrl(request.url);
                                            if (request.postData) {
                                                clipboardText = `POST ${request.url}\n${request.postData}`;
                                            }

                                            navigator.clipboard
                                                .writeText(clipboardText)
                                                .then(() => {
                                                    message.info('Download request copied to clipboard');
                                                })
                                                .catch((error) => {
                                                    message.error(`Unable to copy request to clipboard: ${error}`);
                                                });
                                        });
                                });
                            }}
                            disabled={formState === DatasetDownloadFormSubmitState.Invalid}
                        >
                            Copy download request
                        </Button>
                    )}
                    <Button
                        icon={<DownloadOutlined />}
                        htmlType='submit'
                        type='primary'
                        form={formId}
                        loading={formState === DatasetDownloadFormSubmitState.Pending}
                        disabled={formState === DatasetDownloadFormSubmitState.Invalid}
                    >
                        Download
                    </Button>
                </React.Fragment>
            }
        >
            <DatasetVizDownload formInstance={formInstance} formId={formId} onSubmitStateChange={onSubmitStateChange} {...props} />
        </Modal>
    );
};
