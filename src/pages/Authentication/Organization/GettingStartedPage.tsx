import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IconArrowRight,
    IconPhone,
    IconMail,
    IconRocket,
    IconChartLine,
    IconGauge,
} from '@tabler/icons-react';
import BaseButton from '../../../components/Base/BaseButton';
import BaseCheckbox from '../../../components/Base/BaseCheckbox';
import gettingStartedUserImage from '../../../assets/getting_started_user_image.png';
import gettingStartedImage from '../../../assets/getting_started_image.png';

interface Props {
    onPrevious: () => void;
    onLetsStart: () => void;
}

export default function GettingStartedPage({ onPrevious, onLetsStart }: Readonly<Props>) {
    const { t } = useTranslation();
    const [accepted, setAccepted] = useState(false);

    return (
        <div className="w-full min-w-0 max-w-full bg-lightGray px-3 xxs:px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 lg:py-10">
            <div className="flex w-full min-w-0 max-w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                <div className="flex w-full min-w-0 max-w-full flex-1 flex-col gap-4 sm:gap-6 lg:min-w-0">
                    <div>
                        <p className="mb-2 text-textXXS font-bold uppercase tracking-widest text-primary">
                            {t('organizationOnboarding.gettingStarted.successEyebrow')}
                        </p>
                        <h1 className="wrap-break-word mb-3 text-titleXxxl font-premiumBold text-secondary leading-tight sm:text-titleXxxlPlus">
                            {t('organizationOnboarding.gettingStarted.title')}
                        </h1>
                        <p className="max-w-full text-textSm font-light leading-relaxed text-neutral sm:max-w-[420px]">
                            {t('organizationOnboarding.gettingStarted.intro')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 xxs:grid-cols-2 xxs:gap-4">
                        <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4 shadow-sm sm:p-5">
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <IconChartLine
                                    className="h-5 w-5 shrink-0 text-primary"
                                    aria-hidden
                                />
                                <span className="text-right text-textXXS font-bold uppercase tracking-widest text-primary">
                                    {t(
                                        'organizationOnboarding.gettingStarted.stats.efficiencyGain.label'
                                    )}
                                </span>
                            </div>
                            <div className="text-titleXxxl font-premiumBold leading-none text-secondary sm:text-titleXxxlPlus">
                                {t(
                                    'organizationOnboarding.gettingStarted.stats.efficiencyGain.value'
                                )}
                            </div>
                            <div className="mt-1 text-mini text-neutral">
                                {t(
                                    'organizationOnboarding.gettingStarted.stats.efficiencyGain.caption'
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-primary p-4 shadow-sm sm:p-5">
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <IconGauge className="h-5 w-5 shrink-0 text-white/90" aria-hidden />
                                <span className="text-right text-textXXS font-bold uppercase tracking-widest text-white/80">
                                    {t(
                                        'organizationOnboarding.gettingStarted.stats.latencyReduction.label'
                                    )}
                                </span>
                            </div>
                            <div className="text-titleXxxl font-premiumBold leading-none text-white sm:text-titleXxxlPlus">
                                {t(
                                    'organizationOnboarding.gettingStarted.stats.latencyReduction.value'
                                )}
                            </div>
                            <div className="mt-1 text-mini text-white/70">
                                {t(
                                    'organizationOnboarding.gettingStarted.stats.latencyReduction.caption'
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-primary-100 bg-primary-50 p-3 lg:mt-20 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                        <div className="h-16 w-[72px] shrink-0 overflow-hidden rounded-xl">
                            <img
                                src={gettingStartedImage}
                                alt={t('organizationOnboarding.gettingStarted.learnCard.imageAlt')}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 font-bold text-textSm text-secondary">
                                {t('organizationOnboarding.gettingStarted.learnCard.title')}
                            </div>
                            <div className="text-mini font-light leading-snug text-neutral">
                                {t('organizationOnboarding.gettingStarted.learnCard.description')}
                            </div>
                        </div>
                        <BaseButton
                            type="button"
                            className="h-9 w-9 shrink-0 rounded-xl border-none bg-primary p-0 text-white shadow-none transition-colors hover:bg-primary-700 min-w-0 sm:ml-0"
                        >
                            <IconArrowRight className="h-4 w-4" />
                        </BaseButton>
                    </div>
                </div>

                <div className="flex w-full min-w-0 max-w-full shrink-0 flex-col lg:w-[400px]">
                    <div className="flex flex-col gap-4 rounded-2xl border border-softGray/60 bg-white p-4 shadow-sm sm:gap-5 sm:p-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={gettingStartedUserImage}
                                alt={t('organizationOnboarding.gettingStarted.contact.avatarAlt')}
                                className="h-16 w-16 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0">
                                <div className="font-bold text-regular text-secondary">
                                    {t('organizationOnboarding.gettingStarted.contact.name')}
                                </div>
                                <div className="text-small text-neutral">
                                    {t('organizationOnboarding.gettingStarted.contact.role')}
                                </div>
                            </div>
                        </div>

                        <p className="text-small font-medium italic leading-relaxed text-neutral">
                            {t('organizationOnboarding.gettingStarted.contact.quote')}
                        </p>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-small font-medium text-secondary">
                                <IconPhone className="h-4 w-4 shrink-0 text-primary" />
                                {t('organizationOnboarding.gettingStarted.contact.phone')}
                            </div>
                            <div className="flex items-center gap-3 text-small font-medium text-secondary">
                                <IconMail className="h-4 w-4 shrink-0 text-primary" />
                                {t('organizationOnboarding.gettingStarted.contact.email')}
                            </div>
                        </div>

                        <div className="border-t border-softGray/60" />

                        <BaseCheckbox
                            name="gettingStartedAgreement"
                            isSelected={accepted}
                            onChange={setAccepted}
                            className="[&_.group]:items-start"
                            classNames={{
                                base: 'gap-0',
                                label: 'text-mini font-normal leading-snug text-neutral wrap-break-word cursor-pointer pl-0',
                                wrapper:
                                    'mt-0.5 border border-softGray bg-primary-50 rounded group-data-[selected=true]:bg-primary group-data-[selected=true]:border-primary',
                            }}
                            label={
                                <>
                                    <span>
                                        {t(
                                            'organizationOnboarding.gettingStarted.agreement.before'
                                        )}{' '}
                                    </span>
                                    <span className="font-medium text-primary underline decoration-primary underline-offset-2">
                                        {t('organizationOnboarding.gettingStarted.agreement.link')}
                                    </span>
                                    <span>
                                        {' '}
                                        {t('organizationOnboarding.gettingStarted.agreement.after')}
                                    </span>
                                </>
                            }
                        />

                        <div className="flex w-full min-w-0 flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
                            <BaseButton
                                type="button"
                                label={t('organizationOnboarding.gettingStarted.previous')}
                                onClick={onPrevious}
                                className="w-full border border-softGray rounded-[8px] bg-transparent px-4 py-4 font-bold text-textSm text-primary shadow-none sm:w-auto sm:px-6 sm:py-5"
                            />
                            <BaseButton
                                type="button"
                                disabled={!accepted}
                                onClick={onLetsStart}
                                className="w-full gap-2 border border-primary rounded-[8px] bg-primary px-4 py-4 font-bold text-textSm text-white disabled:opacity-50 sm:w-auto sm:px-6 sm:py-5"
                            >
                                <span>{t('organizationOnboarding.gettingStarted.letsStart')}</span>
                                <IconRocket className="h-4 w-4" />
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
