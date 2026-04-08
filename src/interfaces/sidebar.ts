import type { ComponentType } from 'react';

export type NavItem = {
    label: string;
    Icon: ComponentType<{ size?: number; className?: string }>;
    to?: string;
};
export interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    notifications: Array<{
        id: string;
        title: string;
        description: string;
        time: string;
        name: string;
    }>;
}
