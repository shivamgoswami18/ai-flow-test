import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IconShieldLock,
    IconPencil,
    IconTrash,
    IconChevronDown,
    IconCheck,
    IconPlus,
    IconFileDescription,
    IconMessageCircle,
    IconMessages,
    IconHeadset,
    IconChartLine,
    IconEye,
} from '@tabler/icons-react';
import BaseCheckbox from '../../components/Base/BaseCheckbox';
import BaseButton from '../../components/Base/BaseButton';
import BaseModal from '../../components/Base/BaseModal';
import BaseInput from '../../components/Base/BaseInput';
import BaseMultiSelect from '../../components/Base/BaseMultiSelect';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { User } from '../../interfaces/users';
import { InputPlaceHolder, SpaceRegex } from '../../components/Constants/Validation';

interface Permission {
    id: string;
    labelKey: string;
    checked: boolean;
}

interface PermissionSection {
    id: string;
    labelKey: string;
    descriptionKey: string;
    icon: React.ElementType;
    permissions: Permission[];
}

interface Role {
    id: string;
    name: string;
    descriptionKey: string;
    icon: React.ElementType;
    isSystem?: boolean;
    memberCount?: number;
}

const RolesPage = () => {
    const { t } = useTranslation();
    const [selectedRoleId, setSelectedRoleId] = useState('administrator');
    const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        contract: true,
        conversation: true,
        conversationMsgs: true,
    });

    const [roles, setRoles] = useState<Role[]>([
        {
            id: 'administrator',
            name: 'Administrator',
            descriptionKey: 'rolesAndPermissions.fullSystemAccess',
            icon: IconShieldLock,
            isSystem: true,
        },
        {
            id: 'content_editor',
            name: 'Content Editor',
            descriptionKey: 'rolesAndPermissions.membersAssigned',
            icon: IconPencil,
            memberCount: 4,
        },
        {
            id: 'support',
            name: 'Support Specialist',
            descriptionKey: 'rolesAndPermissions.membersAssigned',
            icon: IconHeadset,
            memberCount: 2,
        },
        {
            id: 'viewer',
            name: 'Viewer Only',
            descriptionKey: 'rolesAndPermissions.membersAssigned',
            icon: IconEye,
            memberCount: 12,
        },
        {
            id: 'analyst',
            name: 'Analyst',
            descriptionKey: 'rolesAndPermissions.membersAssigned',
            icon: IconChartLine,
            memberCount: 5,
        },
    ]);

    React.useEffect(() => {
        const mockUsers: User[] = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                isActive: true,
                lastLogin: '1h ago',
                role: 'ADMINISTRATOR',
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                isActive: true,
                lastLogin: '2h ago',
                role: 'USER',
            },
            {
                id: '3',
                name: 'Mike Johnson',
                email: 'mike@example.com',
                isActive: true,
                lastLogin: '3h ago',
                role: 'MANAGER',
            },
            {
                id: '4',
                name: 'Sarah Wilson',
                email: 'sarah@example.com',
                isActive: true,
                lastLogin: '4h ago',
                role: 'USER',
            },
        ];
        setUsers(mockUsers);
    }, []);

    const userOptions = React.useMemo(
        () => users.map((u) => ({ value: u.id, label: u.name })),
        [users]
    );

    const formik = useFormik({
        initialValues: {
            name: '',
            assignedUsers: [] as string[],
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t('staticValidation.required')),
            assignedUsers: Yup.array().min(1, t('staticValidation.required')),
        }),
        onSubmit: (values) => {
            if (editingRole) {
                setRoles((prev) =>
                    prev.map((r) =>
                        r.id === editingRole.id
                            ? {
                                  ...r,
                                  name: values.name,
                                  memberCount: values.assignedUsers.length,
                              }
                            : r
                    )
                );
            } else {
                const newRoleId = values.name.toLowerCase().replace(SpaceRegex, '_');
                const newRole: Role = {
                    id: newRoleId,
                    name: values.name,
                    descriptionKey: 'rolesAndPermissions.membersAssigned',
                    icon: IconPencil,
                    memberCount: values.assignedUsers.length,
                };
                setRoles((prev) => [...prev, newRole]);

                setRolePermissions((prev) => ({
                    ...prev,
                    [newRoleId]: defaultSections.map((section) => ({
                        ...section,
                        permissions: section.permissions.map((p) => ({ ...p, checked: false })),
                    })),
                }));
            }
            setIsRoleModalVisible(false);
            formik.resetForm();
        },
    });

    const handleAddRole = () => {
        setEditingRole(null);
        formik.resetForm();
        setIsRoleModalVisible(true);
    };

    const handleEditRole = (e: React.MouseEvent, role: Role) => {
        e.stopPropagation();
        setEditingRole(role);
        const assignedUserIds = users
            .filter(
                (u) =>
                    u.role.toLowerCase() === role.id.toLowerCase() ||
                    u.role.toLowerCase() === role.name.toLowerCase()
            )
            .map((u) => u.id);

        formik.setValues({
            name: role.name,
            assignedUsers: assignedUserIds,
        });
        setIsRoleModalVisible(true);
    };

    const handleDeleteClick = (e: React.MouseEvent, role: Role) => {
        e.stopPropagation();
        setRoleToDelete(role);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
            if (selectedRoleId === roleToDelete.id) {
                setSelectedRoleId('administrator');
            }
            setIsDeleteModalVisible(false);
            setRoleToDelete(null);
        }
    };

    const defaultSections: PermissionSection[] = [
        {
            id: 'contract',
            labelKey: 'rolesAndPermissions.sections.contract',
            descriptionKey: 'rolesAndPermissions.sections.contractDesc',
            icon: IconFileDescription,
            permissions: [
                {
                    id: 'view_contracts',
                    labelKey: 'rolesAndPermissions.permissions.viewContracts',
                    checked: true,
                },
                {
                    id: 'create_contracts',
                    labelKey: 'rolesAndPermissions.permissions.createContracts',
                    checked: false,
                },
                {
                    id: 'delete_contracts',
                    labelKey: 'rolesAndPermissions.permissions.deleteContracts',
                    checked: false,
                },
                {
                    id: 'modify_contracts',
                    labelKey: 'rolesAndPermissions.permissions.modifyContractFields',
                    checked: false,
                },
            ],
        },
        {
            id: 'conversation',
            labelKey: 'rolesAndPermissions.sections.conversation',
            descriptionKey: 'rolesAndPermissions.sections.conversationDesc',
            icon: IconMessageCircle,
            permissions: [
                {
                    id: 'init_conv',
                    labelKey: 'rolesAndPermissions.permissions.initiateConversations',
                    checked: true,
                },
                {
                    id: 'archive_conv',
                    labelKey: 'rolesAndPermissions.permissions.archiveThreads',
                    checked: false,
                },
                {
                    id: 'manage_part',
                    labelKey: 'rolesAndPermissions.permissions.manageParticipants',
                    checked: false,
                },
                {
                    id: 'export_logs',
                    labelKey: 'rolesAndPermissions.permissions.exportChatLogs',
                    checked: false,
                },
            ],
        },
        {
            id: 'conversationMsgs',
            labelKey: 'rolesAndPermissions.sections.conversationMsgs',
            descriptionKey: 'rolesAndPermissions.sections.conversationMsgsDesc',
            icon: IconMessages,
            permissions: [
                {
                    id: 'send_msg',
                    labelKey: 'rolesAndPermissions.permissions.sendMessages',
                    checked: true,
                },
                {
                    id: 'edit_own',
                    labelKey: 'rolesAndPermissions.permissions.editOwnMessages',
                    checked: true,
                },
                {
                    id: 'delete_any',
                    labelKey: 'rolesAndPermissions.permissions.deleteAnyMessage',
                    checked: false,
                },
                {
                    id: 'react_msg',
                    labelKey: 'rolesAndPermissions.permissions.reactToMessages',
                    checked: true,
                },
            ],
        },
    ];

    const [rolePermissions, setRolePermissions] = useState<Record<string, PermissionSection[]>>(
        roles.reduce(
            (acc, role) => {
                acc[role.id] = defaultSections?.map((section) => ({
                    ...section,
                    permissions: section.permissions?.map((p) => ({
                        ...p,
                        checked: role.id === 'administrator' ? true : p.checked,
                    })),
                }));
                return acc;
            },
            {} as Record<string, PermissionSection[]>
        )
    );

    const toggleSection = (id: string) => {
        setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePermissionChange = (sectionId: string, permissionId: string, checked: boolean) => {
        setRolePermissions((prev) => {
            const currentSections = prev[selectedRoleId] || [];
            const updatedSections = currentSections.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        permissions: section?.permissions?.map((p) =>
                            p.id === permissionId ? { ...p, checked } : p
                        ),
                    };
                }
                return section;
            });
            return { ...prev, [selectedRoleId]: updatedSections };
        });
    };

    return (
        <div className="flex flex-col h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-32 lg:pb-24">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 pb-6 lg:pb-8 mb-6 lg:mb-8 border-b border-softGray/60">
                <div className="space-y-1.5">
                    <h1 className="font-extraBold text-titleMid sm:text-titleLg lg:text-titleXl leading-tight tracking-[-0.75px] text-slate-900">
                        {t('rolesAndPermissions.title')}
                    </h1>
                    <p className="leading-relaxed font-light text-small sm:text-textSm text-greyFont max-w-xl">
                        {t('rolesAndPermissions.description')}
                    </p>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-start">
                <div className="w-full xl:w-80 shrink-0">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-extraBold text-slate-900 tracking-tight">
                            {t('rolesAndPermissions.roles')}
                        </h3>
                        <BaseButton
                            className="w-10 h-10 min-w-0 p-0 rounded-[8px] bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-none border-none"
                            startIcon={<IconPlus size={20} />}
                            onClick={handleAddRole}
                        />
                    </div>

                    <div className="space-y-3 max-h-none xl:max-h-[calc(100vh-320px)] overflow-y-auto xl:pr-2 custom-scrollbar">
                        {roles?.map((role) => (
                            <div
                                key={role.id}
                                onClick={() => setSelectedRoleId(role.id)}
                                className={`group relative w-full text-left p-3  rounded-2xl cursor-pointer transition-all duration-300 border ${
                                    selectedRoleId === role.id
                                        ? 'bg-white border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/10'
                                        : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-lg'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                            selectedRoleId === role.id
                                                ? 'bg-primary text-white'
                                                : 'bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                        }`}
                                    >
                                        <role.icon />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {role?.name}
                                        </p>
                                        <p className="text-[11px] text-slate-500 font-medium">
                                            {t(role?.descriptionKey, { count: role?.memberCount })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                                        {!role?.isSystem && (
                                            <>
                                                <BaseButton
                                                    onClick={(e) => handleEditRole(e, role)}
                                                    className="p-0 px-2 min-w-0 h-auto bg-transparent border-none shadow-none rounded-xl hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <IconPencil />
                                                </BaseButton>

                                                <BaseButton
                                                    onClick={(e) => handleDeleteClick(e, role)}
                                                    className="p-0 px-2 min-w-0 h-auto bg-transparent border-none shadow-none rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <IconTrash />
                                                </BaseButton>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full bg-white rounded-2xl xl:rounded-[32px] border border-slate-100 p-4 sm:p-6 lg:p-8 shadow-sm">
                    <div className="space-y-4">
                        {(rolePermissions[selectedRoleId] || []).map((section) => (
                            <div
                                key={section.id}
                                className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all hover:shadow-md"
                            >
                                <div
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-slate-50/50 transition-colors gap-3"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shrink-0">
                                            <section.icon
                                                className="w-5 h-5 sm:w-6 sm:h-6"
                                                stroke={1.5}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                                                {t(section.labelKey)}
                                            </h4>
                                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                                                {t(section.descriptionKey)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0">
                                        <span className="inline-flex text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                            {t('rolesAndPermissions.permissionsSelected', {
                                                count: section?.permissions?.filter(
                                                    (p) => p.checked
                                                ).length,
                                            })}
                                        </span>
                                        <IconChevronDown
                                            className={`text-slate-400 transition-transform duration-300 ${
                                                expandedSections[section.id] ? 'rotate-180' : ''
                                            }`}
                                            size={20}
                                        />
                                    </div>
                                </div>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${
                                        expandedSections[section.id]
                                            ? 'max-h-[500px] opacity-100'
                                            : 'max-h-0 opacity-0 overflow-hidden'
                                    }`}
                                >
                                    <div className="px-4 sm:px-12 lg:px-20 pb-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 border-t border-slate-50 pt-6">
                                        {section?.permissions?.map((p) => (
                                            <BaseCheckbox
                                                key={p.id}
                                                label={t(p.labelKey)}
                                                isSelected={p.checked}
                                                onChange={(val) =>
                                                    handlePermissionChange(section.id, p.id, val)
                                                }
                                                classNames={{
                                                    label: 'text-sm font-medium text-slate-600 group-hover:text-slate-900',
                                                    wrapper: 'w-5 h-5 rounded',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 h-20 sm:h-24 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 transition-all duration-300 ease-out lg:left-112 xl:left-112">
                <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-8 flex items-center justify-end">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <BaseButton
                            label={t('rolesAndPermissions.finalizeRoleSettings')}
                            startIcon={<IconCheck size={20} />}
                            className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-10 rounded-xl bg-linear-to-br from-primary to-indigo-600 text-white font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all font-headline text-small sm:text-base"
                            onClick={() => {}}
                        />
                    </div>
                </div>
            </div>
            <BaseModal
                visible={isRoleModalVisible}
                onHide={() => {
                    setIsRoleModalVisible(false);
                    formik.resetForm();
                }}
                header={
                    <div className="flex flex-col gap-1 px-4">
                        <div className="text-titleMd font-bold leading-[30px] tracking-[-0.02em]">
                            {editingRole
                                ? t('rolesAndPermissions.editRole')
                                : t('rolesAndPermissions.createNewRole')}
                        </div>
                    </div>
                }
                footer={
                    <div className="flex justify-end w-full px-4 pt-4 border-t border-slate-50">
                        <div className="flex gap-3">
                            <BaseButton
                                label={t('commonConstants.cancel')}
                                onClick={() => setIsRoleModalVisible(false)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 h-11 rounded-[8px] shadow-none border-none font-bold transition-all"
                            />
                            <BaseButton
                                label={
                                    editingRole
                                        ? t('commonConstants.update')
                                        : t('commonConstants.create')
                                }
                                onClick={() => formik.handleSubmit()}
                                className="bg-primary text-white px-8 h-11 rounded-[8px] shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold transition-all"
                            />
                        </div>
                    </div>
                }
                size="lg"
            >
                <div className="flex flex-col gap-6 py-6 px-4">
                    <BaseInput
                        name="name"
                        label={t('rolesAndPermissions.roleName')}
                        placeholder={InputPlaceHolder(t('rolesAndPermissions.roleName'))}
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
                            input: 'w-full text-gray-900 placeholder:text-gray-400 font-medium text-small outline-none border border-slate-200 shadow-none focus:outline-none h-[43px] rounded-lg',
                            errorMessage: 'text-red-600 text-[10px] mt-1',
                        }}
                    />
                    <BaseMultiSelect
                        name="assignedUsers"
                        label={t('rolesAndPermissions.assignedUsers')}
                        placeholder={InputPlaceHolder(t('rolesAndPermissions.assignedUsers'))}
                        options={userOptions}
                        fullWidth
                        required
                        value={formik.values.assignedUsers}
                        onChange={(val) => {
                            formik.setFieldValue('assignedUsers', val);
                        }}
                        handleBlur={() => formik.setFieldTouched('assignedUsers', true)}
                        error={
                            formik.touched.assignedUsers &&
                            typeof formik.errors.assignedUsers === 'string'
                                ? formik.errors.assignedUsers
                                : undefined
                        }
                        touched={formik.touched.assignedUsers}
                        classNames={{
                            trigger:
                                'bg-white border border-slate-300 rounded-lg py-3 px-4 text-gray-900 font-medium text-small flex items-center justify-between transition-all focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-500 cursor-pointer relative',
                            value: 'text-gray-900 text-small font-medium',
                            indicator:
                                'absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-indigo-500 pointer-events-none',
                            popover: 'mt-1 bg-white border border-slate-200 rounded-lg shadow-lg',
                            listbox: 'py-1',
                            label: 'block text-[10px] font-bold tracking-wider uppercase mb-1',
                            errorMessage: 'text-red-600 text-[10px] mt-1',
                        }}
                    />
                </div>
            </BaseModal>

            <BaseModal
                visible={isDeleteModalVisible}
                onHide={() => {
                    setIsDeleteModalVisible(false);
                    setRoleToDelete(null);
                }}
                header={
                    <div className="flex flex-col gap-1 px-4">
                        <div className="text-titleMd font-bold text-slate-900">
                            {t('rolesAndPermissions.deleteRole')}
                        </div>
                    </div>
                }
                footer={
                    <div className="flex justify-end gap-3 w-full px-4 pt-4 border-t border-slate-50">
                        <BaseButton
                            label={t('commonConstants.cancel')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 h-11 rounded-xl shadow-none border-none font-bold transition-all"
                            onClick={() => setIsDeleteModalVisible(false)}
                        />
                        <BaseButton
                            label={t('commonConstants.delete')}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 h-11 rounded-xl shadow-lg shadow-red-200 font-bold transition-all"
                            onClick={confirmDelete}
                        />
                    </div>
                }
                size="md"
            >
                <div className="py-2 px-4">
                    <div className="text-textSm font-medium text-slate-500 leading-[20px]">
                        {t('rolesAndPermissions.deleteRoleDescription')}
                    </div>
                </div>
            </BaseModal>
        </div>
    );
};

export default RolesPage;
