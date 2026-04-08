import { NavLink, useLocation } from 'react-router-dom';
import { localizedPath } from '../../i18n/localizedRoutes';
import { useTranslation } from 'react-i18next';
import type { NavItem } from '../../interfaces/sidebar';
import { useMemo, useState } from 'react';
import {
    IconBell,
    IconBuildingStore,
    IconDotsVertical,
    IconLayoutDashboard,
    IconLayoutSidebarLeftCollapse,
    IconSettings,
    IconUsers,
} from '@tabler/icons-react';
import BaseButton from '../Base/BaseButton';
import NotificationPanel from './NotificationPanel';

const navItems: NavItem[] = [
    { label: 'Dashboard', Icon: IconLayoutDashboard, to: localizedPath('dashboard') },
    { label: 'Customers', Icon: IconUsers },
    { label: 'Sale', Icon: IconBuildingStore },
    { label: 'Settings', Icon: IconSettings, to: localizedPath('settings') },
    { label: 'Notifications', Icon: IconBell },
];

const settingsSubNav = [
    { label: 'Users', to: localizedPath('settingsUsers') },
    { label: 'Categories', to: localizedPath('settingsCategories') },
] as const;

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    onExpand?: () => void;
};

export default function Sidebar({
    isOpen = false,
    onClose,
    isCollapsed = false,
    onToggleCollapse,
    onExpand,
}: Readonly<SidebarProps>) {
    const { t } = useTranslation();
    const location = useLocation();
    const [notificationsOpenAtPath, setNotificationsOpenAtPath] = useState<string | null>(null);
    const notificationsOpen = notificationsOpenAtPath === location.pathname;
    const settingsBase = localizedPath('settings');
    const isSettingsActive =
        location.pathname === settingsBase || location.pathname.startsWith(`${settingsBase}/`);

    const notifications = useMemo(
        () => [
            {
                id: 'n1',
                name: 'KOH AS',
                title: 'New booking confirmed',
                description: 'Your customer booked a service for tomorrow at 10:00 AM.',
                time: '2m',
            },
            {
                id: 'n2',
                name: 'Migo',
                title: 'Payment received',
                description: 'Invoice #2043 was paid successfully.',
                time: '18m',
            },
            {
                id: 'n3',
                name: 'Support',
                title: 'New message',
                description: '“Can you reschedule my appointment to Friday?”',
                time: '1h',
            },
            {
                id: 'n4',
                name: 'System',
                title: 'Weekly summary ready',
                description: 'Your weekly performance summary is now available.',
                time: '1d',
            },
        ],
        []
    );

    const closeNotifications = () => setNotificationsOpenAtPath(null);
    const openNotifications = () => {
        setNotificationsOpenAtPath(location.pathname);
        onClose?.();
    };

    return (
        <>
            <button
                type="button"
                onClick={onClose}
                className={[
                    'fixed inset-0 z-30 bg-black/30 md:hidden',
                    isOpen ? 'block' : 'hidden',
                ].join(' ')}
            />

            <button
                type="button"
                onClick={closeNotifications}
                className={[
                    'fixed inset-0 z-30 bg-black/30 transition-opacity duration-300',
                    notificationsOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none',
                ].join(' ')}
            />

            <aside
                className={[
                    isCollapsed ? 'md:w-20' : 'md:w-56',
                    'w-56 border-r border-softGray/60 bg-white flex flex-col shrink-0 fixed h-full z-40',
                    'min-h-0',
                    'transition-transform md:transition-[width] duration-300 ease-out',
                    'md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                <div className="border-b border-softGray/60 p-[12px]">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={onExpand}
                            className={[
                                'flex items-center cursor-pointer bg-transparent p-0',
                                isCollapsed ? 'w-full justify-center' : '',
                            ].join(' ')}
                        >
                            <div className="bg-primary rounded-[8px] flex items-center justify-center py-[6px] px-[14px] text-white font-premiumBold text-textLg xl:leading-[28px] xl:tracking-[0px]">
                                F
                            </div>
                            <div
                                className={[
                                    'text-left transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap',
                                    isCollapsed ? 'opacity-0 ml-0 hidden' : 'opacity-100 ml-3',
                                ].join(' ')}
                            >
                                <h1 className="text-textSm uppercase font-premiumBold text-primary xl:leading-[17px] xl:tracking-[0px]">
                                    JEM AS
                                </h1>
                                <p className="text-textXXS uppercase text-neutral font-light xl:leading-[15px] xl:tracking-[1px]">
                                    Migo
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            className={[
                                'hidden bg-none md:inline-flex items-center justify-center text-slateGray shrink-0 transition-all duration-300 cursor-pointer',
                                isCollapsed
                                    ? 'opacity-0 scale-0 pointer-events-none w-0'
                                    : 'opacity-100 scale-100',
                            ].join(' ')}
                        >
                            <IconLayoutSidebarLeftCollapse className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden hide-scrollbar">
                    <div className="px-3 space-y-1">
                        {navItems.map((item) => {
                            const base = [
                                'flex items-center text-slateGray bg-transparent hover:bg-softGray transition-all duration-300 ease-in-out rounded-[8px] text-textSm font-medium cursor-pointer xl:leading-[20px] xl:tracking-[0px]',
                                isCollapsed
                                    ? 'w-10 h-10 justify-center px-0 gap-0 mx-auto'
                                    : 'px-4 py-2 gap-3',
                            ].join(' ');
                            const Icon = item.Icon;

                            if (item.to) {
                                return (
                                    <div key={item.label} className="relative group">
                                        <NavLink
                                            to={item.to}
                                            className={({ isActive }) =>
                                                isActive ||
                                                (item.label === 'Settings' && isSettingsActive)
                                                    ? [
                                                          'flex items-center bg-primary text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-300',
                                                          isCollapsed
                                                              ? 'w-10 h-10 justify-center px-0 gap-0 mx-auto'
                                                              : 'px-4 py-2 gap-3',
                                                      ].join(' ')
                                                    : base
                                            }
                                            end={item.label !== 'Settings'}
                                            onClick={() => {
                                                closeNotifications();
                                                onClose?.();
                                            }}
                                        >
                                            <Icon className="shrink-0 w-5 h-5" />
                                            <span
                                                className={[
                                                    'transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap',
                                                    isCollapsed
                                                        ? 'max-w-0 opacity-0'
                                                        : 'max-w-[150px] opacity-100',
                                                ].join(' ')}
                                            >
                                                {item.label}
                                            </span>
                                        </NavLink>

                                        {/* Mobile nested settings sub-nav (inside drawer) */}
                                        {item.label === 'Settings' && isSettingsActive && (
                                            <div
                                                className={[
                                                    'md:hidden mt-2 ml-2 pl-3 border-l border-softGray/60 space-y-1',
                                                    isCollapsed ? 'hidden' : '',
                                                ].join(' ')}
                                            >
                                                <div className="mb-2">
                                                    <div className="text-textSm uppercase font-premiumBold text-slateGray xl:leading-[17px] xl:tracking-[0px]">
                                                        User Management
                                                    </div>
                                                    <div className="text-textXXS text-neutral font-light xl:leading-[15px] xl:tracking-[0px]">
                                                        Sub-navigation
                                                    </div>
                                                </div>

                                                {settingsSubNav.map((sub) => (
                                                    <NavLink
                                                        key={sub.to}
                                                        to={sub.to}
                                                        className={({ isActive }) =>
                                                            isActive
                                                                ? 'flex items-center bg-primary text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 px-4 py-2 gap-3'
                                                                : 'flex items-center text-slateGray bg-transparent hover:bg-softGray transition-all duration-300 ease-in-out rounded-[8px] text-textSm font-medium cursor-pointer xl:leading-[20px] xl:tracking-[0px] px-4 py-2.5 gap-3'
                                                        }
                                                        onClick={onClose}
                                                    >
                                                        <span className="truncate">
                                                            {sub.label}
                                                        </span>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}

                                        {isCollapsed && (
                                            <div className="hidden md:block pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity z-100">
                                                <div className="bg-slateGray text-white text-xs font-medium px-2 py-1 rounded shadow whitespace-nowrap">
                                                    {item.label}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <div key={item.label} className="relative group">
                                    <button
                                        type="button"
                                        className={[
                                            base,
                                            isCollapsed ? '' : 'w-full text-left',
                                        ].join(' ')}
                                        onClick={() => {
                                            if (item.label === 'Notifications') {
                                                if (notificationsOpen) closeNotifications();
                                                else openNotifications();
                                                return;
                                            }
                                            closeNotifications();
                                        }}
                                    >
                                        <Icon className="shrink-0 w-5 h-5" />
                                        <span
                                            className={[
                                                'transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap',
                                                isCollapsed
                                                    ? 'max-w-0 opacity-0'
                                                    : 'max-w-[150px] opacity-100',
                                            ].join(' ')}
                                        >
                                            {item.label}
                                        </span>
                                        {item.label === 'Notifications' && !isCollapsed && (
                                            <span className="ml-auto inline-flex items-center">
                                                <span className="min-w-6 h-6 px-2 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                                                    4
                                                </span>
                                            </span>
                                        )}
                                    </button>

                                    {isCollapsed && (
                                        <div className="hidden md:block pointer-events-none absolute left-full top-1/2 -translate-y-1/2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity z-100">
                                            <div className="bg-slateGray text-white text-xs font-medium px-2 py-1 rounded shadow whitespace-nowrap">
                                                {item.label}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </nav>

                <div className="p-3 mt-auto">
                    <div
                        className={[
                            'transition-all duration-300 ease-in-out overflow-hidden',
                            isCollapsed
                                ? 'max-h-0 opacity-0 mb-0'
                                : 'max-h-[160px] opacity-100 mb-4',
                        ].join(' ')}
                    >
                        <div className="bg-lightGray rounded-[8px] p-3 text-center border border-softGray/60">
                            <p className="text-textXXS text-neutral font-light mb-2 xl:leading-[15px] xl:tracking-[1px]">
                                {t('sidebar.questionsVisitOur')}{' '}
                                <span className="underline cursor-pointer">
                                    {t('sidebar.helpCenter')}
                                </span>
                            </p>
                            <BaseButton className="bg-primary text-white text-textXXS font-extraBold px-4 py-2 rounded-[8px] w-full transition-colors cursor-pointer">
                                {t('sidebar.chatWithSupport')}
                            </BaseButton>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center border border-softGray/60 justify-center text-black font-medium text-textSm overflow-hidden shrink-0 xl:leading-[20px] xl:tracking-[0px]">
                                <div className="w-full h-full flex items-center justify-center">
                                    M
                                </div>
                            </div>
                            <span
                                className={[
                                    'text-sm font-medium text-slateGray transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap',
                                    isCollapsed
                                        ? 'max-w-0 opacity-0 ml-0'
                                        : 'max-w-[120px] opacity-100 ml-0',
                                ].join(' ')}
                            >
                                Migo
                            </span>
                        </div>
                        <div
                            className={[
                                'transition-all duration-300 ease-in-out overflow-hidden',
                                isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[40px] opacity-100',
                            ].join(' ')}
                        >
                            <BaseButton className="bg-transparent cursor-pointer" type="button">
                                <IconDotsVertical className="w-5 h-5 text-slateGray" />
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Desktop nested settings panel (right side) */}
            <aside
                className={[
                    'hidden md:flex flex-col fixed top-0 h-full bg-white border-r border-softGray/60 z-20 w-56 overflow-x-hidden',
                    'min-h-0',
                    'transition-all duration-300 ease-out',
                    isCollapsed ? 'left-20' : 'left-56',
                    isSettingsActive
                        ? 'opacity-100 pointer-events-auto translate-x-0'
                        : 'opacity-0 pointer-events-none -translate-x-full',
                ].join(' ')}
                aria-hidden={!isSettingsActive}
            >
                <div className="p-[12px]">
                    <div className="text-textSm uppercase font-premiumBold text-slateGray xl:leading-[17px] xl:tracking-[0px]">
                        User Management
                    </div>
                    <div className="text-textXXS text-neutral font-light xl:leading-[15px] xl:tracking-[0px]">
                        {t('sidebar.subNavigation')}
                    </div>
                </div>

                <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden hide-scrollbar">
                    <div className="px-3 space-y-1">
                        {settingsSubNav.map((sub) => (
                            <NavLink
                                key={sub.to}
                                to={sub.to}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'flex items-center bg-primary text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 px-4 py-2 gap-3'
                                        : 'flex items-center text-slateGray bg-transparent hover:bg-softGray transition-all duration-300 ease-in-out rounded-[8px] text-textSm font-medium cursor-pointer xl:leading-[20px] xl:tracking-[0px] px-4 py-2.5 gap-3'
                                }
                            >
                                <span className="truncate">{sub.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </aside>

            <NotificationPanel
                isOpen={notificationsOpen}
                onClose={closeNotifications}
                isCollapsed={isCollapsed}
                notifications={notifications}
            />
        </>
    );
}
