import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import BaseInput from '../../../components/Base/BaseInput';
import BaseButton from '../../../components/Base/BaseButton';
import { InputPlaceHolder } from '../../../components/Constants/Validation';
import organizationImage from '../../../assets/organization_image.png';
import { IconMessage } from '@tabler/icons-react';

interface Props {
    onNext: () => void;
}

const inputClassNames = {
    base: 'w-full',
    label: 'block text-textXXS font-bold text-gray-500 tracking-wider uppercase mb-1',
    input: 'w-full text-gray-900 placeholder:text-gray-400 font-medium text-small outline-none border border-slate-200 bg-[#DBEAFE]/60 shadow-none focus:outline-none h-[43px] rounded-[8px] px-3',
    errorMessage: 'text-red-600 text-textXXS mt-1',
};

export default function OrganizationPage({ onNext }: Readonly<Props>) {
    const { t } = useTranslation();
    const [saved, setSaved] = useState(false);

    const validationSchema = Yup.object().shape({
        companyName: Yup.string().required(t('staticValidation.required')),
        organizationNumber: Yup.string().required(t('staticValidation.required')),
        streetAddress: Yup.string().required(t('staticValidation.required')),
        zipCode: Yup.string().required(t('staticValidation.required')),
        city: Yup.string().required(t('staticValidation.required')),
        county: Yup.string().required(t('staticValidation.required')),
        municipality: Yup.string().required(t('staticValidation.required')),
        country: Yup.string().required(t('staticValidation.required')),
    });

    const formik = useFormik({
        initialValues: {
            companyName: 'Acme Corp',
            organizationNumber: '556677-8899',
            streetAddress: 'Innovation Drive 42',
            zipCode: '114 56',
            city: 'Stockholm',
            county: 'Stockholm County',
            municipality: 'Solna',
            country: 'Sweden',
        },
        validationSchema,
        onSubmit: () => {
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onNext();
            }, 800);
        },
    });

    return (
        <div className="w-full min-w-0 max-w-full bg-lightGray px-3 xxs:px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 lg:py-10">
            <div className="flex w-full min-w-0 max-w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                <div className="flex w-full min-w-0 max-w-full flex-1 flex-col lg:min-w-0">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="wrap-break-word text-titleSemiMdPlus xxs:text-titleMd sm:text-titleLg lg:text-titleXxlPlusPlus font-premiumBold text-secondary leading-tight">
                            {t('organizationOnboarding.welcomeTitle')}{' '}
                            <span className="text-primary">{formik.values.companyName}</span>
                        </h1>
                        <p className="mt-2 max-w-full text-textSm text-neutral font-light sm:max-w-[460px]">
                            {t('organizationOnboarding.introDescription')}
                        </p>
                    </div>

                    <div className="w-full min-w-0 max-w-full bg-white rounded-[8px] shadow-sm border border-softGray/40 p-4 sm:p-6 lg:p-8">
                        <form onSubmit={formik.handleSubmit} noValidate>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                <BaseInput
                                    name="companyName"
                                    label={t('organizationOnboarding.fields.companyName')}
                                    placeholder={InputPlaceHolder(
                                        t('organizationOnboarding.fields.companyName')
                                    )}
                                    fullWidth
                                    required
                                    value={formik.values.companyName}
                                    onChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    error={formik.errors.companyName}
                                    touched={formik.touched.companyName}
                                    classNames={inputClassNames}
                                />
                                <BaseInput
                                    name="organizationNumber"
                                    label={t('organizationOnboarding.fields.organizationNumber')}
                                    placeholder={InputPlaceHolder(
                                        t('organizationOnboarding.fields.organizationNumber')
                                    )}
                                    fullWidth
                                    required
                                    value={formik.values.organizationNumber}
                                    onChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    error={formik.errors.organizationNumber}
                                    touched={formik.touched.organizationNumber}
                                    classNames={inputClassNames}
                                />
                            </div>

                            <div className="mb-5">
                                <BaseInput
                                    name="streetAddress"
                                    label={t('organizationOnboarding.fields.streetAddress')}
                                    placeholder={InputPlaceHolder(
                                        t('organizationOnboarding.fields.streetAddress')
                                    )}
                                    fullWidth
                                    required
                                    value={formik.values.streetAddress}
                                    onChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    error={formik.errors.streetAddress}
                                    touched={formik.touched.streetAddress}
                                    classNames={inputClassNames}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                <BaseInput
                                    name="zipCode"
                                    label={t('organizationOnboarding.fields.zipCode')}
                                    placeholder={InputPlaceHolder(
                                        t('organizationOnboarding.fields.zipCode')
                                    )}
                                    fullWidth
                                    required
                                    value={formik.values.zipCode}
                                    onChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    error={formik.errors.zipCode}
                                    touched={formik.touched.zipCode}
                                    classNames={inputClassNames}
                                />
                                <BaseInput
                                    name="city"
                                    label={t('organizationOnboarding.fields.city')}
                                    placeholder={InputPlaceHolder(
                                        t('organizationOnboarding.fields.city')
                                    )}
                                    fullWidth
                                    required
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    error={formik.errors.city}
                                    touched={formik.touched.city}
                                    classNames={inputClassNames}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                <BaseInput
                                    name="county"
                                    label={t('organizationOnboarding.fields.county')}
                                    placeholder={InputPlaceHolder(
                                        t('organizationOnboarding.fields.county')
                                    )}
                                    fullWidth
                                    required
                                    value={formik.values.county}
                                    onChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    error={formik.errors.county}
                                    touched={formik.touched.county}
                                    classNames={inputClassNames}
                                />
                                <BaseInput
                                    name="municipality"
                                    label={t('organizationOnboarding.fields.municipality')}
                                    placeholder={InputPlaceHolder(
                                        t('organizationOnboarding.fields.municipality')
                                    )}
                                    fullWidth
                                    required
                                    value={formik.values.municipality}
                                    onChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    error={formik.errors.municipality}
                                    touched={formik.touched.municipality}
                                    classNames={inputClassNames}
                                />
                            </div>

                            <div className="mb-8">
                                <BaseInput
                                    name="country"
                                    label={t('organizationOnboarding.fields.country')}
                                    placeholder={InputPlaceHolder(
                                        t('organizationOnboarding.fields.country')
                                    )}
                                    fullWidth
                                    required
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    error={formik.errors.country}
                                    touched={formik.touched.country}
                                    classNames={inputClassNames}
                                />
                            </div>

                            <div className="flex w-full min-w-0 flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
                                <BaseButton
                                    type="button"
                                    label={t('organizationOnboarding.discard')}
                                    onClick={() => formik.resetForm()}
                                    className="w-full bg-transparent border border-softGray rounded-[8px] shadow-none text-primary font-bold text-textSm px-4 py-4 sm:w-auto sm:px-6 sm:py-5"
                                />
                                <BaseButton
                                    type="submit"
                                    label={
                                        saved
                                            ? t('organizationOnboarding.saved')
                                            : t('organizationOnboarding.saveChanges')
                                    }
                                    className="w-full bg-primary text-white border border-primary rounded-[8px] font-bold text-textSm px-4 py-4 sm:w-auto sm:px-6 sm:py-5"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <div className="w-full min-w-0 max-w-full shrink-0 lg:w-[400px]">
                    <div className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src={organizationImage}
                            alt={t('organizationOnboarding.imageAlt')}
                            className="absolute inset-0 h-full min-h-[280px] w-full object-cover sm:min-h-[380px] lg:min-h-[520px]"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-4 ring-black/30 sm:rounded-3xl sm:ring-[6px]" />

                        <div className="absolute bottom-3 left-3 right-3 bg-white/85 backdrop-blur-md rounded-xl p-3 shadow-lg sm:bottom-5 sm:left-4 sm:right-4 sm:rounded-2xl sm:p-5">
                            <div className="flex items-start">
                                <p className="text-secondary text-regular font-medium leading-relaxed">
                                    {t('organizationOnboarding.testimonial.quote')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                    <IconMessage className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-secondary text-small font-extraBold">
                                        {t('organizationOnboarding.testimonial.authorName')}
                                    </div>
                                    <div className="text-neutral text-mini">
                                        {t('organizationOnboarding.testimonial.authorRole')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
