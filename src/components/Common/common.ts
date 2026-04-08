import { StatusCodes } from 'http-status-codes';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import { type BackendResp } from '../../interfaces/BackendResp';
import { jwtDecode } from 'jwt-decode';
import placeholderImage from '../../assets/images/fallBackImage.png';

export interface DecodedToken {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const isAdmin = (token: string): boolean => {
    const decoded = decodeToken(token);
    return decoded?.role === 'admin';
};

export function formatKrone(value: number | string): string {
    return `${value} Kr`;
}

export const truncateWords = (text: string, maxWords = 10) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return `${words.slice(0, maxWords).join(' ')}...`;
};

export const checkStatusCodeSuccess = (data: number) => {
    if (data === StatusCodes.OK || data === StatusCodes.ACCEPTED || data === StatusCodes.CREATED) {
        return true;
    } else {
        return false;
    }
};

export type ToastResp = {
    message?: string;
    messageKey?: string;
};

export const showSuccessToast = (resp: ToastResp, t: TFunction) => {
    if (resp?.messageKey) {
        toast.success(t(`toastMessages.${resp.messageKey}`));
    } else if (resp?.message) {
        toast.success(resp.message);
    }
};

export const getErrorMessage = (
    error: ToastResp | string | undefined | null,
    t: TFunction
): string | undefined => {
    if (typeof error === 'string') {
        return error;
    }
    if (!error) return;

    if (error.messageKey) {
        return t(`toastMessages.${error.messageKey}`);
    } else if (error.message) {
        return error.message;
    }
    return undefined;
};

export const formatDate = (date: string | Date | null | undefined): string => {
    return date ? dayjs(date).format('DD/MM/YYYY') : '';
};
export const formatDateTime = (dateString: string): string => {
    return dayjs(dateString).format('MMM DD, YYYY, hh:mm A');
};

export const formatDateForInput = (date: string | Date | null): string =>
    date ? dayjs(date).format('YYYY-MM-DD') : '';

export const formatMonthDuration = (months: number, t?: TFunction): string => {
    const monthText =
        months === 1
            ? t
                ? t('purchaseConstants.month')
                : 'Month'
            : t
              ? t('purchaseConstants.months')
              : 'Months';
    return `${months} ${monthText}`;
};

export const getDurationOptions = (t: TFunction) => {
    return Array.from({ length: 24 }, (_, i) => {
        const months = i + 1;
        return {
            value: formatMonthDuration(months),
            label: formatMonthDuration(months, t),
        };
    });
};

export const getMonthsFromDurationString = (duration: string | number): number => {
    if (!duration) return 0;
    const str = String(duration);
    const months = str.replace(/\D/g, '');
    return Number(months) || 0;
};

export const setMonthDurationString = (duration: string): string => {
    const months = getMonthsFromDurationString(duration);
    return formatMonthDuration(months);
};

export const showMonthDurationString = (duration: string, t?: TFunction): string => {
    const months = getMonthsFromDurationString(duration);
    return formatMonthDuration(months, t);
};

export const calculateTotalClips = (months: number, monthlyClips: number): number => {
    if (!months || !monthlyClips) return 0;
    return months * monthlyClips;
};

export const calculateExpiryDate = (
    months: number,
    fromDate: string | Date = new Date()
): string => {
    if (!months || months <= 0) return '';
    return dayjs(fromDate).add(months, 'month').format('YYYY-MM-DD');
};

export const isExpiryWithinDaysFromNow = (
    expiryDate: string | Date | null,
    days: number
): boolean => {
    if (!expiryDate || !days) return false;

    const now = new Date();
    const threshold = now.getTime() + days * 24 * 60 * 60 * 1000;

    return new Date(expiryDate).getTime() < threshold;
};

export const finalApiMessage = (res: BackendResp): string => {
    return res?.messageKey ?? res?.message;
};

export const calculatePageSize = (pageSize: number): number => {
    return Math.min(pageSize, 10);
};

export const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    customPlaceholder?: string
) => {
    (e.target as HTMLImageElement).src = customPlaceholder || placeholderImage;
};
