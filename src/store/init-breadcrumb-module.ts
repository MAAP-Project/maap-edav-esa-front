import { BreadcrumbModule } from '@oida/ui-react-mobx';

export const initBreadcrumbModule = () => {

    const breadcrumbModule = new BreadcrumbModule({
        config: {
            pageTitle: 'MAAP'
        }
    });

    return breadcrumbModule;
};
