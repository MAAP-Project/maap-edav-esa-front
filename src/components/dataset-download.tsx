import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';

import { DatasetDownloadConfig } from '@oidajs/eo-mobx';
import { AdamDatasetDownloadConfig } from '@oidajs/eo-adapters-adam';
import { DatasetDownloadFormSubmitState, DatasetVizDownload, DatasetVizDownloadModalProps } from '@oidajs/eo-mobx-react';
import { useAppStore } from '@oidajs/ui-react-mobx';

import { AppState } from '../store';


export const DatasetDownloadModal = (props: DatasetVizDownloadModalProps) => {

    const appState = useAppStore<AppState>();

    const downloadConfig: AdamDatasetDownloadConfig | DatasetDownloadConfig | undefined = props.datasetViz.dataset.config.download;

    if (!downloadConfig) {
        return null;
    }

    let formId = 'dataset-viz-download-form';

    let [visible, setVisible] = useState(true);
    let [formState, setFormState] = useState<DatasetDownloadFormSubmitState>(DatasetDownloadFormSubmitState.Ready);

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
            visible={visible}
            afterClose={props.onClose}
            destroyOnClose={true}
            onCancel={() => setVisible(false)}
            footer={
                <React.Fragment>
                    <Button
                        onClick={() => setVisible(false)}
                    >
                        Cancel
                    </Button>
                    {(downloadConfig as AdamDatasetDownloadConfig).downloadUrlProvider &&
                        <Button
                            icon={<CopyOutlined/>}
                            onClick={() => {
                                formInstance.validateFields().then(() => {
                                    const values = formInstance.getFieldsValue();

                                    (downloadConfig as AdamDatasetDownloadConfig).downloadUrlProvider({
                                        datasetViz: props.datasetViz,
                                        ...values
                                    }).then((request) => {
                                        let requestUrl = appState.wcsUrlMapper.mapToInternalUrl(request.url);
                                        if (request.postData) {
                                            navigator.clipboard.writeText(`POST ${requestUrl}\n${request.postData}`);
                                        } else {
                                            navigator.clipboard.writeText(requestUrl);
                                        }
                                        message.info('Download request copied to clipboard');
                                    });
                                });
                            }}
                            disabled={formState === DatasetDownloadFormSubmitState.Invalid}
                        >
                            Copy download request
                        </Button>
                    }
                    <Button
                        icon={<DownloadOutlined/>}
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
            <DatasetVizDownload
                formInstance={formInstance}
                formId={formId}
                onSubmitStateChange={onSubmitStateChange}
                {...props}
            />
        </Modal>
    );
};
