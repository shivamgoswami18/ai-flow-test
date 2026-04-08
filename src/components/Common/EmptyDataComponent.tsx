import type { TFunction } from 'i18next';
import type { FilterState } from '../../interfaces/FilterState';

export const EmptyDataComponent = (filters: FilterState, t: TFunction) => {
    return (
        <div className="col-12 text-center py-5">
            <p className="text-muted">
                {filters.search
                    ? t('commonConstants.noDataFound')
                    : t('commonConstants.noDataFound')}
            </p>
        </div>
    );
};
