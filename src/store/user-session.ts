import { AxiosInstanceWithCancellation, createAxiosInstance } from '@oidajs/core';
import { action, computed, makeObservable, observable } from 'mobx';

export class UserSession {
    @observable.ref protected accessToken_: string | undefined;
    public readonly axiosInstance: AxiosInstanceWithCancellation;

    constructor() {
        this.accessToken_ = sessionStorage.getItem('access_token') || undefined;

        window.addEventListener('storage', (evt) => {
            if (evt.key === 'access_token') {
                this.setAccessToken_(evt.newValue || undefined);
            }
        });

        this.axiosInstance = createAxiosInstance();
        this.axiosInstance.interceptors.request.use((requestConfig) => {
            if (this.accessToken_) {
                requestConfig.headers.Authorization = `Bearer ${this.accessToken_}`;
            }
            return requestConfig;
        });

        makeObservable(this);
    }

    @computed
    get accessToken() {
        return this.accessToken_;
    }

    @action
    protected setAccessToken_(accessToken: string | undefined) {
        this.accessToken_ = accessToken;
    }
}
