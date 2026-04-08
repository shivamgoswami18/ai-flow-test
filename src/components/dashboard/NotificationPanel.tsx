import React, { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import BaseButton from '../Base/BaseButton';
import BaseTabs from '../Base/BaseTabs';
import { useTranslation } from '../../i18n/i18n';
import type { NotificationPanelProps } from '../../interfaces/sidebar';

const NotificationPanel: React.FC<NotificationPanelProps> = ({
    isOpen,
    onClose,
    isCollapsed,
    notifications,
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'unread' | 'history'>('unread');

    return (
        <aside
            className={[
                'fixed top-0 bottom-0 z-50 bg-white border-l border-softGray/60 shadow-xl',
                'w-full max-w-[420px] md:max-w-[380px]',
                'transition-[transform,opacity] duration-300 ease-out',
                'left-0',
                isCollapsed ? 'md:left-20' : 'md:left-56',
                isOpen
                    ? 'translate-x-0 opacity-100 pointer-events-auto'
                    : '-translate-x-6 opacity-0 pointer-events-none',
                'flex flex-col',
            ].join(' ')}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isOpen}
        >
            <div className="border-b border-softGray/60 flex flex-col gap-2">
                <div className="flex items-center justify-between px-4 py-3 bg-lightGray">
                    <div className="text-textSm uppercase font-premiumBold text-slateGray xl:leading-[17px] xl:tracking-[0px]">
                        {t('sidebar.notifications')}
                    </div>
                    <BaseButton
                        type="button"
                        onClick={onClose}
                        className="bg-transparent w-10 h-10 inline-flex items-center justify-center rounded-lg transition-colors"
                    >
                        <IconX className="w-5 h-5 text-slateGray" />
                    </BaseButton>
                </div>

                <BaseTabs
                    tabs={[
                        { key: 'unread', label: t('sidebar.unread') },
                        {
                            key: 'history',
                            label: t('sidebar.history'),
                        },
                    ]}
                    activeKey={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            <div className="p-3 overflow-y-auto flex-1 hide-scrollbar">
                <div className="space-y-2">
                    {notifications?.map((n) => {
                        const initial = (n?.name?.trim()?.[0] ?? 'N').toUpperCase();
                        return (
                            <div
                                key={n?.id}
                                className={[
                                    'w-full text-left bg-white border border-softGray/60 rounded-[8px] p-3',
                                    'hover:shadow-sm transition-all',
                                    'flex items-start gap-3',
                                ].join(' ')}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-softGray/60 flex items-center justify-center text-primary font-premiumBold">
                                        {initial}
                                    </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-textSm font-premiumBold text-slateGray truncate">
                                                {n?.title}
                                            </div>
                                            <div className="text-textXXS text-neutral font-light line-clamp-2">
                                                {n?.description}
                                            </div>
                                        </div>
                                        <div className="text-textXXS text-neutral font-medium whitespace-nowrap">
                                            {n?.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default NotificationPanel;
