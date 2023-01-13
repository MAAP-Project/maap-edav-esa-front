import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tooltip, Drawer } from 'antd';
import { SettingFilled, SearchOutlined, InfoCircleFilled } from '@ant-design/icons';

import { AppSettings } from './app-settings';
import logo from '../../assets/logo.png';


export const AppHeader = () => {

    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();

    return (
        <div className='app-top-bar'>
            <div className='app-logo'><img src={logo}></img></div>
            <div className='app-header-tools'>
                <Tooltip title='Data discovery'>
                    <Button icon={<SearchOutlined/>} onClick={() => navigate('/discovery')}/>
                </Tooltip>
                <Button icon={<SettingFilled/>} onClick={() => setShowSettings(true)}/>
            </div>
            <Drawer
                title='Settings'
                placement='right'
                closable={false}
                className='settings-drawer'
                onClose={() => setShowSettings(false)}
                open={showSettings}
                footer={<div className='app-info'><InfoCircleFilled/> Client version: {window['appVersion']}</div>}
            >
                <AppSettings></AppSettings>
            </Drawer>
        </div>
    );
};
