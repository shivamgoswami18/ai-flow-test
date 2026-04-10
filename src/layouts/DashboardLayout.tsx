import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { IconMenu2, IconX } from '@tabler/icons-react';
import BaseButton from '../components/Base/BaseButton';
import { localizedPath } from '../i18n/localizedRoutes';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    const settingsBase = localizedPath('settings');
    const isSettingsActive =
        location.pathname === settingsBase || location.pathname.startsWith(`${settingsBase}/`);

    return (
        <div className="bg-lightGray flex min-h-screen overflow-x-hidden">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
                onExpand={() => setSidebarCollapsed(false)}
            />
            <main
                className={[
                    'flex-1 min-h-screen flex flex-col transition-[margin-left] duration-300 ease-out',
                    !isSettingsActive && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-56'),
                    isSettingsActive && (sidebarCollapsed ? 'lg:ml-76' : 'lg:ml-112'),
                ].join(' ')}
            >
                <div className="lg:hidden sticky top-0 z-20 px-4 pt-4 bg-lightGray">
                    <BaseButton
                        type="button"
                        onClick={() => setSidebarOpen((v) => !v)}
                        className="inline-flex items-center justify-center w-10 h-10 bg-transparent"
                    >
                        {sidebarOpen ? (
                            <IconX className="w-5 h-5 text-slateGray" />
                        ) : (
                            <IconMenu2 className="w-5 h-5 text-slateGray" />
                        )}
                    </BaseButton>
                </div>

                <div className="flex-1 px-4 lg:px-8 py-8 lg:py-10 bg-lightGray">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
