import React from 'react';
import BaseButton from './BaseButton';

export type BaseTabItem<T extends string> = {
    key: T;
    label: React.ReactNode;
};

type BaseTabsTone = 'primary' | 'secondary';

type BaseTabsProps<T extends string> = {
    tabs: Array<BaseTabItem<T>>;
    activeKey: T;
    onChange: (key: T) => void;
    className?: string;
    inline?: boolean;
    tone?: BaseTabsTone;
    tabClassName?: string;
};

const toneTabClasses: Record<BaseTabsTone, { active: string; inactive: string; font: string }> = {
    primary: {
        active: 'border-primary text-primary',
        inactive: 'border-transparent text-slateGray/70 hover:text-slateGray',
        font: 'font-premiumBold',
    },
    secondary: {
        active: 'border-secondary text-secondary',
        inactive: 'border-transparent text-neutral hover:text-secondary',
        font: 'font-bold',
    },
};

export default function BaseTabs<T extends string>({
    tabs,
    activeKey,
    onChange,
    className = '',
    inline = false,
    tone = 'primary',
    tabClassName = '',
}: Readonly<BaseTabsProps<T>>) {
    const { active, inactive, font } = toneTabClasses[tone];

    return (
        <div
            className={['base-tabs', inline ? 'base-tabs--inline' : '', className]
                .filter(Boolean)
                .join(' ')}
        >
            {tabs.map((tab) => (
                <BaseButton
                    key={tab.key}
                    type="button"
                    onClick={() => onChange(tab.key)}
                    className={[
                        'base-tabs__tab',
                        'bg-transparent rounded-none text-textSm border-b-2 transition-all duration-200 ease-out',
                        font,
                        activeKey === tab.key ? active : inactive,
                        tabClassName,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {tab.label}
                </BaseButton>
            ))}
        </div>
    );
}
