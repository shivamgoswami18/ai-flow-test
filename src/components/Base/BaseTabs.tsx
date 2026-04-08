import React from 'react';
import BaseButton from './BaseButton';

export type BaseTabItem<T extends string> = {
    key: T;
    label: React.ReactNode;
};

type BaseTabsProps<T extends string> = {
    tabs: Array<BaseTabItem<T>>;
    activeKey: T;
    onChange: (key: T) => void;
    className?: string;
};

export default function BaseTabs<T extends string>({
    tabs,
    activeKey,
    onChange,
    className = '',
}: Readonly<BaseTabsProps<T>>) {
    return (
        <div className={['base-tabs', className].join(' ')}>
            {tabs.map((tab) => (
                <BaseButton
                    key={tab.key}
                    type="button"
                    onClick={() => onChange(tab.key)}
                    className={[
                        'base-tabs__tab',
                        'bg-transparent rounded-none text-textSm font-premiumBold transition-colors border-b-2',
                        activeKey === tab.key
                            ? 'border-primary text-primary'
                            : 'border-transparent text-slateGray/70 hover:text-slateGray',
                    ].join(' ')}
                >
                    {tab.label}
                </BaseButton>
            ))}
        </div>
    );
}
