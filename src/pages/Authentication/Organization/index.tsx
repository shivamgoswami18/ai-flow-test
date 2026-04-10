import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import BaseTabs from '../../../components/Base/BaseTabs';
import { useTranslation } from '../../../i18n/i18n';
import { localizedPath } from '../../../i18n/localizedRoutes';
import OrganizationPage from './OrganizationPage';
import GettingStartedPage from './GettingStartedPage';

type Tab = 'organization' | 'getting-started';

export default function OrganizationOnboarding() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('organization');
    const navigate = useNavigate();

    const handleLetsStart = () => {
        navigate(localizedPath('dashboard'));
    };

    return (
        <div className="flex min-h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-white">
            <div className="z-10 flex w-full shrink-0 justify-center border-b border-softGray/60 bg-white/70 pb-0 pt-6 backdrop-blur-sm">
                <BaseTabs<Tab>
                    inline
                    tone="secondary"
                    tabClassName="pb-4 -mb-px"
                    className="justify-center gap-10"
                    tabs={[
                        {
                            key: 'organization',
                            label: (
                                <span className="flex items-center gap-2">
                                    <IconCircleCheckFilled className="w-5 h-5 text-successGreen" />
                                    {t('organizationOnboarding.tabs.organization')}
                                </span>
                            ),
                        },
                        {
                            key: 'getting-started',
                            label: t('organizationOnboarding.tabs.gettingStarted'),
                        },
                    ]}
                    activeKey={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            <div className="min-h-0 w-full flex-1 overflow-y-auto hide-scrollbar">
                <div key={activeTab} className="tab-panel-enter w-full">
                    {activeTab === 'organization' ? (
                        <OrganizationPage onNext={() => setActiveTab('getting-started')} />
                    ) : (
                        <GettingStartedPage
                            onPrevious={() => setActiveTab('organization')}
                            onLetsStart={handleLetsStart}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
