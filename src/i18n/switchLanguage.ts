import i18n from './i18n';
import { ROUTE_KEYS, localizedPath, type RouteKey } from './localizedRoutes';
import { createBrowserHistory } from 'history';
import { RouteParamRegex } from '../components/Constants/Validation';

const history = createBrowserHistory();

function findRouteKeyForPath(pathname: string): RouteKey | undefined {
    for (const key of ROUTE_KEYS) {
        const slug = localizedPath(key);
        RouteParamRegex.lastIndex = 0;
        const regexStr = '^' + slug.replace(RouteParamRegex, '[^/]+');
        const rx = new RegExp(regexStr);
        if (rx.test(pathname)) return key;
    }
    return undefined;
}

export async function changeLanguageWithNavigate(newLang: string): Promise<void> {
    const currentPath = window.location.pathname;
    const currentKey = findRouteKeyForPath(currentPath);
    await i18n.changeLanguage(newLang);

    if (currentKey) {
        const newPath = localizedPath(currentKey);
        history.push(newPath);
        window.location.href = newPath;
    } else {
        const home = localizedPath('dashboard');
        window.location.href = home;
    }
}
