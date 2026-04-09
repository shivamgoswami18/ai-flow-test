import { useEffect, useMemo, useState } from 'react';
import BaseInput from '../../components/Base/BaseInput';
import BaseButton from '../../components/Base/BaseButton';
import { IconCheck, IconGripVertical, IconPencil, IconTrash } from '@tabler/icons-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { InputPlaceHolder } from '../../components/Constants/Validation';
import type { Status, StatusCardProps, InlineFormProps } from '../../interfaces/status';
import BaseSortableGrid from '../../components/Base/BaseSortableGrid';
import BaseSortableItem from '../../components/Base/BaseSortableItem';
import BaseModal from '../../components/Base/BaseModal';
import ColorPicker from '../../components/Common/Setting/Status/ColorPicker';

// This below logic is temporary handled from frontend will remove once backend is ready.
const STORAGE_KEY = 'flowlyt.settings.statuses.v1';

const uid = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `st_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

function usePersistedStatuses(defaultValue: Status[]) {
    const [statuses, setStatuses] = useState<Status[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultValue;
            const parsed = JSON.parse(raw) as Status[];
            if (!Array.isArray(parsed)) return defaultValue;
            return parsed.filter(
                (s) =>
                    s &&
                    typeof s.id === 'string' &&
                    typeof s.name === 'string' &&
                    typeof s.color === 'string'
            );
        } catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
        } catch {
            // ignore
        }
    }, [statuses]);

    return { statuses, setStatuses };
}

function InlineStatusForm({ initialValues, onSave, onCancel }: Readonly<InlineFormProps>) {
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('staticValidation.required')),
        description: Yup.string().optional(),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            onSave({
                name: values.name.trim(),
                description: values.description.trim(),
                color: values.color,
            });
        },
    });

    return (
        <div className="rounded-[8px] bg-white border border-softGray/60 px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-1 min-w-0">
                    <BaseInput
                        name="name"
                        label={t('status.name')}
                        placeholder={InputPlaceHolder(t('status.name'))}
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
                </div>

                <div className="flex-1 min-w-0">
                    <BaseInput
                        name="description"
                        label={t('status.description')}
                        placeholder={InputPlaceHolder(t('status.description'))}
                        fullWidth
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        handleBlur={formik.handleBlur}
                        error={formik.errors.description}
                        touched={formik.touched.description}
                        classNames={{
                            base: 'w-full',
                            label: 'block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1',
                            input: 'w-full text-gray-900 placeholder:text-gray-400 font-medium text-[13px] outline-none border border-slate-200 shadow-none focus:outline-none h-[43px] rounded-lg',
                            errorMessage: 'text-red-600 text-[10px] mt-1',
                        }}
                    />
                </div>

                <div className="shrink-0">
                    <div className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">
                        {t('status.color')}
                    </div>
                    <ColorPicker
                        value={formik.values.color}
                        onChange={(c) => formik.setFieldValue('color', c)}
                    />
                </div>

                <div className="flex items-end gap-2 shrink-0 pb-0.5 self-end sm:self-auto sm:mt-[22px]">
                    <BaseButton
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center justify-center px-4 py-5 bg-softGray rounded-[8px] text-slateGray hover:text-red-500 transition shadow-none p-0 min-w-0"
                    >
                        <IconTrash className="w-4 h-4" />
                    </BaseButton>
                    <BaseButton
                        type="button"
                        onClick={() => formik.handleSubmit()}
                        className="inline-flex items-center justify-center px-4 py-5 bg-softGray rounded-[8px] text-slateGray hover:text-successGreen transition shadow-none p-0 min-w-0"
                    >
                        <IconCheck className="w-4 h-4" />
                    </BaseButton>
                </div>
            </div>
        </div>
    );
}

function StatusCard({
    status,
    active,
    onEdit,
    onDelete,
    editingId,
    onSaveEdit,
    onCancelEdit,
}: Readonly<StatusCardProps>) {
    const isEditing = editingId === status.id;

    return (
        <BaseSortableItem id={status.id}>
            {({ setNodeRef, style, isDragging, setActivatorNodeRef, attributes, listeners }) => (
                <div
                    ref={setNodeRef}
                    style={style}
                    className={[
                        isDragging ? 'opacity-40' : 'opacity-100',
                        active ? 'shadow-lg ring-1 ring-softGray' : '',
                    ].join(' ')}
                >
                    {isEditing ? (
                        <InlineStatusForm
                            initialValues={{
                                name: status.name,
                                description: status.description,
                                color: status.color,
                            }}
                            onSave={(vals) => onSaveEdit(status.id, vals)}
                            onCancel={onCancelEdit}
                        />
                    ) : (
                        <div className="group rounded-[8px] bg-white border border-softGray/60 h-[52px] px-3 flex items-center gap-3 select-none">
                            <BaseButton
                                type="button"
                                ref={setActivatorNodeRef}
                                className="inline-flex items-center justify-center w-8 h-8 shrink-0 cursor-grab active:cursor-grabbing text-slateGray/40 hover:text-slateGray transition min-w-0 bg-transparent border-none shadow-none p-0"
                                {...attributes}
                                {...listeners}
                            >
                                <IconGripVertical className="w-4 h-4" />
                            </BaseButton>

                            <span
                                className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                                style={{ backgroundColor: status.color }}
                            />

                            <div className="text-slateGray text-textSm font-medium truncate flex-1">
                                {status.name}
                            </div>

                            <BaseButton
                                type="button"
                                onClick={() => onEdit(status.id)}
                                className="inline-flex items-center justify-center w-8 h-8 shrink-0 text-slateGray/40 hover:text-slateGray transition min-w-0 bg-transparent border-none shadow-none p-0 cursor-pointer"
                            >
                                <IconPencil className="w-4 h-4" />
                            </BaseButton>

                            <BaseButton
                                type="button"
                                onClick={() => onDelete(status.id)}
                                className="inline-flex items-center justify-center w-8 h-8 shrink-0 text-slateGray/40 hover:text-red-500 transition min-w-0 bg-transparent border-none shadow-none p-0 cursor-pointer"
                            >
                                <IconTrash className="w-4 h-4" />
                            </BaseButton>
                        </div>
                    )}
                </div>
            )}
        </BaseSortableItem>
    );
}

export default function StatusesPage() {
    const { t } = useTranslation();

    const defaultStatuses = useMemo<Status[]>(
        () => [
            { id: uid(), name: 'Prospekt', description: 'Prospekt customer', color: '#ec4899' },
            { id: uid(), name: 'Potensiell', description: 'Potential customer', color: '#eab308' },
            {
                id: uid(),
                name: 'Interessert',
                description: 'Interested customer',
                color: '#3b82f6',
            },
            {
                id: uid(),
                name: 'I dialog / Forhandling',
                description: 'In dialog or negotiation',
                color: '#6366f1',
            },
        ],
        []
    );

    const { statuses, setStatuses } = usePersistedStatuses(defaultStatuses);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const handleEdit = (id: string) => {
        setShowAddForm(false);
        setEditingId(id);
    };

    const handleSaveEdit = (
        id: string,
        values: { name: string; description: string; color: string }
    ) => {
        setStatuses((prev) => prev.map((s) => (s.id === id ? { ...s, ...values } : s)));
        setEditingId(null);
    };

    const handleCancelEdit = () => setEditingId(null);

    const handleAddNew = (values: { name: string; description: string; color: string }) => {
        const newStatus: Status = { id: uid(), ...values };
        setStatuses((prev) => [...prev, newStatus]);
        setShowAddForm(false);
    };

    const handleCancelAdd = () => setShowAddForm(false);

    const handleDelete = (id: string) => {
        setStatuses((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
        if (editingId === id) {
            setEditingId(null);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <div className="text-[28px] leading-[34px] font-premiumBold text-slateGray">
                    {t('status.customerStatuses')}
                </div>
                <div className="mt-2 text-textSm text-neutral font-light max-w-[560px]">
                    {t('status.customerStatusDescription')}
                </div>
            </div>

            <BaseSortableGrid<Status>
                items={statuses}
                onItemsChange={setStatuses}
                containerClassName="flex flex-col gap-2"
                renderItem={(status, { activeId }) => (
                    <StatusCard
                        key={status.id}
                        status={status}
                        active={activeId === status.id}
                        onEdit={handleEdit}
                        onDelete={(id) => setDeleteConfirmId(id)}
                        editingId={editingId}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                    />
                )}
                renderOverlay={(activeStatus) => (
                    <div className="rounded-[8px] bg-white border border-softGray/60 h-[52px] px-3 flex items-center gap-3 shadow-xl">
                        <span className="inline-flex items-center justify-center w-8 h-8 text-slateGray/40">
                            <IconGripVertical className="w-4 h-4" />
                        </span>
                        <span
                            className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                            style={{ backgroundColor: activeStatus.color }}
                        />
                        <div className="text-slateGray text-textSm font-medium truncate flex-1">
                            {activeStatus.name}
                        </div>
                    </div>
                )}
            />

            {showAddForm && (
                <div className="mt-2">
                    <InlineStatusForm
                        initialValues={{
                            name: '',
                            description: '',
                            color: '#ef4444',
                        }}
                        onSave={handleAddNew}
                        onCancel={handleCancelAdd}
                    />
                </div>
            )}

            {!showAddForm && (
                <div className="mt-4 flex justify-center">
                    <BaseButton
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setShowAddForm(true);
                        }}
                        className="bg-primary text-white rounded-[8px] px-5 h-[40px] text-textSm font-bold cursor-pointer shadow-none"
                        label={t('status.addNewStatus')}
                    />
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={deleteConfirmId !== null}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={() => {
                    if (deleteConfirmId) {
                        handleDelete(deleteConfirmId);
                    }
                }}
            />
        </div>
    );
}

type DeleteConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

function DeleteConfirmationModal(props: Readonly<DeleteConfirmationModalProps>) {
    const { t } = useTranslation();
    const { isOpen, onClose, onConfirm } = props;

    return (
        <BaseModal
            visible={isOpen}
            onHide={onClose}
            header={
                <div className="flex flex-col gap-1 px-4">
                    <div className="text-textLg font-bold leading-[30px] tracking-[-0.02em]">
                        {t('status.deleteStatus')}
                    </div>
                    <div className="text-textSm font-medium text-slateGray leading-[20px]">
                        {t('status.deleteConfirmMessage')}
                    </div>
                </div>
            }
            footer={
                <div className="flex justify-end w-full px-4 gap-3">
                    <BaseButton
                        type="button"
                        onClick={onClose}
                        className="rounded-[8px] font-bold text-textBase px-6 bg-white border border-slate-200 text-slateGray shadow-none"
                        label={t('commonConstants.cancel')}
                    />
                    <BaseButton
                        type="button"
                        onClick={onConfirm}
                        className="rounded-[8px] font-bold text-textBase px-6 bg-red-500 text-white shadow-none"
                        label={t('commonConstants.delete')}
                    />
                </div>
            }
            size="lg"
        >
            <div className="flex flex-col gap-4 py-4 px-4" />
        </BaseModal>
    );
}
