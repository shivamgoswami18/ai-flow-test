import i18n from './i18n';

export const ROUTE_KEYS = [
    'SignIn',
    'SignUp',
    'ForgotPassword',
    'dashboard',
    'settings',
    'settingsUsers',
    'settingsCategories',
] as const;

export type RouteKey = (typeof ROUTE_KEYS)[number];

export function localizedPath(key: RouteKey) {
    const path = i18n.t(`routes.${key}`);
    return typeof path === 'string' ? path : String(path);
}

export function fillParams(slug: string, params?: Record<string, string | number>) {
    if (!params) return slug;
    let out = slug;
    Object.entries(params).forEach(([k, v]) => {
        out = out.replace(new RegExp(`:${k}\\b`, 'g'), encodeURIComponent(String(v)));
    });
    return out;
}
