export type WcsUrlMapperConfig = {
    discoveryProviders: Array<{
        wcsUrl: string;
        internalWcsUrl?: string;
    }>;
};

export class WcsUrlMapper {
    protected wcsUrlMap_: Record<string, string>;
    constructor(config: WcsUrlMapperConfig) {
        this.wcsUrlMap_ = config.discoveryProviders.reduce((urlMap, item) => {
            if (item.internalWcsUrl) {
                return {
                    [item.wcsUrl]: item.internalWcsUrl,
                    ...urlMap
                };
            } else {
                return urlMap;
            }
        }, {});
    }

    mapToInternalUrl(url: string) {
        const wcsUrl = url.split('?')[0];
        const internalWcsUrl = this.wcsUrlMap_[wcsUrl];
        if (internalWcsUrl) {
            return url.replace(wcsUrl, internalWcsUrl);
        } else {
            return url;
        }
    }
}
