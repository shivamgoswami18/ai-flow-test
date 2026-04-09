import { useEffect, useMemo, useRef, useState } from 'react';
import BaseModal from '../../components/Base/BaseModal';
import BaseInput from '../../components/Base/BaseInput';
import BaseButton from '../../components/Base/BaseButton';
import { IconGripVertical, IconPlus, IconX } from '@tabler/icons-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { InputPlaceHolder } from '../../components/Constants/Validation';
import type { Category } from '../../interfaces/category';
import BaseSortableGrid from '../../components/Base/BaseSortableGrid';
import BaseSortableItem from '../../components/Base/BaseSortableItem';

// This below logic is temporary handled from frontend will remove once backend is ready.
const STORAGE_KEY = 'flowlyt.settings.categories.v1';

const uid = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `cat_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

function usePersistedCategories(defaultValue: Category[]) {
    const [categories, setCategories] = useState<Category[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultValue;
            const parsed = JSON.parse(raw) as Category[];
            if (!Array.isArray(parsed)) return defaultValue;
            return parsed.filter(
                (c) => c && typeof c.id === 'string' && typeof c.name === 'string'
            );
        } catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
        } catch {
            // ignore
        }
    }, [categories]);

    return { categories, setCategories };
}

function CategoryCard({
    category,
    active,
}: Readonly<{
    category: Category;
    active?: boolean;
}>) {
    return (
        <BaseSortableItem id={category.id}>
            {({ setNodeRef, style, isDragging, setActivatorNodeRef, attributes, listeners }) => (
                <div
                    ref={setNodeRef}
                    style={style}
                    className={[
                        'group relative rounded-[8px] bg-white border border-softGray/60',
                        'h-[44px] px-3 flex items-center gap-2',
                        'select-none',
                        isDragging ? 'opacity-40' : 'opacity-100',
                        active ? 'shadow-lg ring-1 ring-softGray' : '',
                    ].join(' ')}
                >
                    <BaseButton
                        type="button"
                        ref={setActivatorNodeRef}
                        className={[
                            'inline-flex items-center justify-center rounded-md',
                            'text-slateGray/60 hover:text-slateGray',
                            'w-8 h-8 shrink-0 cursor-grab active:cursor-grabbing',
                            'transition',
                            'min-w-0 h-auto bg-transparent border-none shadow-none p-0',
                        ].join(' ')}
                        {...attributes}
                        {...listeners}
                    >
                        <IconGripVertical className="w-5 h-5" />
                    </BaseButton>

                    <div className="text-slateGray text-textSm font-medium truncate flex-1">
                        {category?.name}
                    </div>

                    <BaseButton
                        type="button"
                        className={[
                            'inline-flex items-center justify-center rounded-md cursor-pointer',
                            'text-slateGray/60 hover:text-slateGray hover:bg-white/60',
                            'w-8 h-8 shrink-0 transition',
                            'min-w-0 h-auto bg-transparent border-none shadow-none p-0 cursor-default',
                        ].join(' ')}
                    >
                        <IconX className="w-5 h-5" />
                    </BaseButton>
                </div>
            )}
        </BaseSortableItem>
    );
}

function AddCategoryCard({ onClick }: Readonly<{ onClick: () => void }>) {
    const { t } = useTranslation();
    return (
        <BaseButton
            type="button"
            onClick={onClick}
            className={[
                'rounded-[8px] h-[44px] px-3 cursor-pointer',
                'border border-dashed border-slateGray/60',
                'bg-transparent text-slateGray',
                'flex items-center justify-center gap-2',
                'hover:bg-white/60 transition',
                'w-full shadow-none',
            ].join(' ')}
        >
            <span className="inline-flex items-center justify-center w-8 h-8">
                <IconPlus className="w-5 h-5" />
            </span>
            <span className="text-textSm font-medium">{t('category.addCategory')}</span>
        </BaseButton>
    );
}

export default function CategoriesPage() {
    const { t } = useTranslation();
    const defaultCategories = useMemo<Category[]>(
        () => [
            { id: uid(), name: 'Leads', description: 'Leads' },
            { id: uid(), name: 'Industri', description: 'Industri' },
            { id: uid(), name: 'Konsulent', description: 'Konsulent' },
        ],
        []
    );

    const { categories, setCategories } = usePersistedCategories(defaultCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const nameInputRef = useRef<HTMLInputElement | null>(null);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('staticValidation.required')),
        description: Yup.string().required(t('staticValidation.required')),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema,
        onSubmit: (values) => {
            const newCat: Category = {
                id: uid(),
                name: values.name.trim(),
                description: values.description.trim(),
            };
            setCategories((prev) => [...prev, newCat]);
            setIsModalOpen(false);
            formik.resetForm();
        },
    });

    const openModal = () => {
        setIsModalOpen(true);
        formik.resetForm();
    };

    const canSave =
        formik.values.name.trim().length > 0 && formik.values.description.trim().length > 0;

    return (
        <div className="w-full">
            <div className="mb-6">
                <div className="text-[28px] leading-[34px] font-premiumBold text-slateGray">
                    {t('category.customerCategories')}
                </div>
                <div className="mt-2 text-textSm text-neutral font-light max-w-[620px]">
                    {t('category.customerCategoryDescription')}
                </div>
            </div>

            <BaseSortableGrid<Category>
                items={categories}
                onItemsChange={setCategories}
                containerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                renderItem={(cat, { activeId }) => (
                    <CategoryCard key={cat.id} category={cat} active={activeId === cat.id} />
                )}
                renderOverlay={(activeCategory) => (
                    <div className="opacity-100">
                        <div className="rounded-[8px] bg-white border border-softGray/60 h-[44px] px-3 flex items-center gap-2 shadow-xl">
                            <span className="inline-flex items-center justify-center w-8 h-8 text-slateGray/60">
                                <IconGripVertical className="w-5 h-5" />
                            </span>
                            <div className="text-slateGray text-textSm font-medium truncate flex-1">
                                {activeCategory?.name}
                            </div>
                            <span className="inline-flex items-center justify-center w-8 h-8 text-slateGray/60">
                                <IconX className="w-5 h-5" />
                            </span>
                        </div>
                    </div>
                )}
            >
                <AddCategoryCard onClick={openModal} />
            </BaseSortableGrid>

            <BaseModal
                visible={isModalOpen}
                onHide={() => {
                    setIsModalOpen(false);
                    formik.resetForm();
                }}
                header={
                    <div className="flex flex-col gap-1 px-4">
                        <div className="text-textLg font-bold leading-[30px] tracking-[-0.02em]">
                            {t('category.addNewCategory')}
                        </div>
                        <div className="text-textSm font-medium text-slateGray leading-[20px]">
                            {t('category.addNewCategoryDescription')}
                        </div>
                    </div>
                }
                footer={
                    <div className="flex justify-end w-full px-4">
                        <BaseButton
                            label={t('commonConstants.save')}
                            className="bg-primary rounded-[8px] font-bold text-textBase px-6"
                            disabled={!canSave}
                            onClick={() => formik.handleSubmit()}
                        />
                    </div>
                }
                size="lg"
            >
                <div className="flex flex-col gap-4 py-4 px-4">
                    <BaseInput
                        ref={nameInputRef}
                        name="name"
                        label={t('category.name')}
                        placeholder={InputPlaceHolder(t('category.name'))}
                        fullWidth
                        required
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        handleBlur={formik.handleBlur}
                        error={formik.errors.name}
                        touched={formik.touched.name}
                        classNames={{
                            base: 'w-full',
                            label: 'block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1',
                            input: 'w-full text-gray-900 placeholder:text-gray-400 font-medium text-[13px] outline-none border border-slate-200 shadow-none focus:outline-none h-[43px] rounded-lg',
                            errorMessage: 'text-red-600 text-[10px] mt-1',
                        }}
                    />
                    <BaseInput
                        type="textarea"
                        name="description"
                        label={t('category.description')}
                        placeholder={InputPlaceHolder(t('category.description'))}
                        fullWidth
                        required
                        rows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        handleBlur={formik.handleBlur}
                        error={formik.errors.description}
                        touched={formik.touched.description}
                        classNames={{
                            base: 'w-full',
                            label: 'block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1',
                            inputWrapper: 'w-full',
                            input: 'w-full text-gray-900 placeholder:text-gray-400 font-medium text-[13px] outline-none border border-slate-200 shadow-none focus:outline-none rounded-lg',
                            errorMessage: 'text-red-600 text-[10px] mt-1',
                        }}
                    />
                </div>
            </BaseModal>
        </div>
    );
}
