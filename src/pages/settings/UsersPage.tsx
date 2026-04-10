import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    EmailRegex,
    InputPlaceHolder,
    PhoneRegex,
    SelectPlaceHolder,
} from '../../components/Constants/Validation';
import BaseButton from '../../components/Base/BaseButton';
import BaseModal from '../../components/Base/BaseModal';
import BaseInput from '../../components/Base/BaseInput';
import BaseDropdown from '../../components/Base/BaseDropdown';
import type { User } from '../../interfaces/users';

const UsersPage = () => {
    const { t } = useTranslation();
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const roles = [
        { label: t('userManagement.roles.admin'), value: 'ADMINISTRATOR' },
        { label: t('userManagement.roles.user'), value: 'USER' },
        { label: t('userManagement.roles.manager'), value: 'MANAGER' },
    ];

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('staticValidation.required')),
        email: Yup.string()
            .required(t('staticValidation.required'))
            .matches(EmailRegex, t('staticValidation.format')),
        phone: Yup.string()
            .required(t('staticValidation.required'))
            .matches(PhoneRegex, t('staticValidation.format')),
        role: Yup.string().required(`${t('staticValidation.required')}`),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            role: '',
        },
        validationSchema,
        onSubmit: (values) => {
            if (selectedUser) {
                setUsers((prev) =>
                    prev?.map((u) => (u.id === selectedUser.id ? { ...u, ...values } : u))
                );
            } else {
                const newUser: User = {
                    id: Math.random().toString(36).slice(2, 9),
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    role: values.role,
                    lastLogin: 'Just now',
                    isActive: true,
                };
                setUsers((prev) => [...prev, newUser]);
            }
            setIsInviteModalVisible(false);
            formik.resetForm();
        },
    });

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const mockUsers: User[] = [
                    {
                        id: '1',
                        name: 'Migo',
                        email: 'tayow89781@cosdas.com',
                        lastLogin: '2 hours ago',
                        isActive: true,
                        role: 'ADMINISTRATOR',
                        phone: '94080500',
                    },
                ];
                setUsers(mockUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleInviteOpen = () => {
        setSelectedUser(null);
        formik.resetForm();
        setIsInviteModalVisible(true);
    };

    const handleEditOpen = (user: User) => {
        setSelectedUser(user);
        formik.setValues({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
        });
        setIsInviteModalVisible(true);
    };

    const handleDeleteOpen = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
            setIsDeleteModalVisible(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto pb-10">
            <div className="flex flex-col lg:flex-row justify-between pb-6 border-b border-slate-100 gap-6 lg:items-center">
                <div className="space-y-1.5">
                    <h1 className="font-extraBold text-titleXl leading-tight tracking-[-0.75px] text-slate-900">
                        {t('userManagement.title')}
                    </h1>
                    <p className="leading-relaxed font-light text-textSm text-greyFont max-w-xl">
                        {t('userManagement.description')}
                    </p>
                </div>
                <div className="shrink-0">
                    <BaseButton
                        label={t('userManagement.inviteNewUser')}
                        startIcon={<IconPlus size={20} />}
                        className="w-full sm:w-auto bg-linear-to-br from-primary to-indigo-600 rounded-[8px] font-bold text-textBase px-8 h-12 shadow-lg shadow-indigo-100 transition-all hover:shadow-indigo-200 active:scale-[0.98]"
                        onClick={handleInviteOpen}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
                {isLoading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {users?.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white p-5 rounded-2xl border border-slate-200/60 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 flex flex-col xl:flex-row gap-6 items-start xl:items-center relative group w-full"
                            >
                                <div className="flex items-center gap-5 w-full xl:w-2/5 min-w-0">
                                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shadow-sm border border-primary/5">
                                        <span className="font-headline font-extraBold">
                                            {user?.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <h3 className="font-headline font-bold text-lg text-slate-900 leading-tight mb-0.5 truncate">
                                            {user?.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm truncate font-medium">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center justify-between w-full gap-6">
                                    .{' '}
                                    <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-4 md:gap-1.5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                                {t('userManagement.lastLogin')}
                                            </span>
                                            <span className="text-xs text-slate-600 font-semibold">
                                                {user?.lastLogin}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex-1 md:flex-initial">
                                        <div className="flex flex-col items-start md:items-end gap-1.5">
                                            {user?.isActive && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 text-[10px] font-bold text-emerald-600 bg-emerald-50/50">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                                                    {t('userManagement.activeUser')}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                                {user?.role}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 pl-6 border-l border-slate-100">
                                            <BaseButton
                                                className="text-slate-400 hover:text-primary p-2.5 rounded-[8px] hover:bg-primary/5 cursor-pointer min-w-0 h-auto bg-transparent border-none shadow-none transition-colors"
                                                onClick={() => handleEditOpen(user)}
                                            >
                                                <IconPencil />
                                            </BaseButton>
                                            <BaseButton
                                                className="text-slate-400 hover:text-red-500 p-2.5 rounded-[8px] hover:bg-red-50 cursor-pointer min-w-0 h-auto bg-transparent border-none shadow-none transition-colors"
                                                onClick={() => handleDeleteOpen(user)}
                                            >
                                                <IconTrash />
                                            </BaseButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <BaseModal
                visible={isInviteModalVisible}
                onHide={() => {
                    setIsInviteModalVisible(false);
                    formik.resetForm();
                }}
                header={
                    <div className="flex flex-col gap-1 px-4">
                        <div className="text-titleMd font-bold leading-[30px] tracking-[-0.02em]">
                            {selectedUser
                                ? t('userManagement.editUser')
                                : t('userManagement.inviteNewUser')}
                        </div>
                        <div className="text-textSm font-medium text-greyFont leading-[20px]">
                            {selectedUser
                                ? t('userManagement.editUserDescription')
                                : t('userManagement.inviteUserDescription')}
                        </div>
                    </div>
                }
                footer={
                    <div className="flex justify-end w-full px-4">
                        <BaseButton
                            label={
                                selectedUser
                                    ? t('commonConstants.update')
                                    : t('commonConstants.invite')
                            }
                            className="bg-primary rounded-[8px] font-bold text-textBase px-6"
                            onClick={() => formik.handleSubmit()}
                        />
                    </div>
                }
                size="lg"
            >
                <div className="flex flex-col gap-4 py-4 px-4">
                    <BaseInput
                        name="name"
                        label={t('userManagement.fullName')}
                        placeholder={InputPlaceHolder(t('userManagement.fullName'))}
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
                    <BaseInput
                        name="email"
                        label={t('userManagement.emailAddress')}
                        placeholder={InputPlaceHolder(t('userManagement.emailAddress'))}
                        fullWidth
                        required
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        handleBlur={formik.handleBlur}
                        error={formik.errors.email}
                        touched={formik.touched.email}
                        classNames={{
                            base: 'w-full',
                            label: 'block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1',
                            input: 'w-full text-gray-900 placeholder:text-gray-400 font-medium text-small outline-none border border-slate-200 shadow-none focus:outline-none h-[43px] rounded-lg',
                            errorMessage: 'text-red-600 text-[10px] mt-1',
                        }}
                    />
                    <BaseInput
                        name="phone"
                        label={t('userManagement.phoneNumber')}
                        placeholder={InputPlaceHolder(t('userManagement.phoneNumber'))}
                        fullWidth
                        required
                        numbersOnly
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        handleBlur={formik.handleBlur}
                        error={formik.errors.phone}
                        touched={formik.touched.phone}
                        classNames={{
                            base: 'w-full',
                            label: 'block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1',
                            input: 'w-full text-gray-900 placeholder:text-gray-400 font-medium text-small outline-none border border-slate-200 shadow-none focus:outline-none h-[43px] rounded-lg',
                            errorMessage: 'text-red-600 text-[10px] mt-1',
                        }}
                    />
                    <BaseDropdown
                        name="role"
                        label={t('userManagement.role')}
                        placeholder={SelectPlaceHolder(t('userManagement.role'))}
                        options={roles}
                        fullWidth
                        required
                        value={formik.values.role}
                        onChange={(val) => formik.setFieldValue('role', val)}
                        handleBlur={formik.handleBlur}
                        error={formik.errors.role}
                        touched={formik.touched.role}
                        classNames={{
                            trigger:
                                'w-full bg-white border border-slate-300 rounded-lg py-3 px-4 text-gray-900 font-medium text-small flex items-center justify-between transition-all focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-500 cursor-pointer relative',
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
                    setUserToDelete(null);
                }}
                header={
                    <div className="flex flex-col gap-1 px-4">
                        <div className="text-titleMd font-bold leading-[30px] tracking-[-0.02em] text-slate-900">
                            {t('userManagement.deleteUser')}
                        </div>
                    </div>
                }
                footer={
                    <div className="flex justify-end gap-3 w-full px-4">
                        <BaseButton
                            label={t('commonConstants.cancel')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[8px] font-bold text-textBase px-6"
                            onClick={() => setIsDeleteModalVisible(false)}
                        />
                        <BaseButton
                            label={t('commonConstants.delete')}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-[8px] font-bold text-textBase px-6"
                            onClick={handleDeleteConfirm}
                        />
                    </div>
                }
                size="md"
            >
                <div className="py-2 px-4">
                    <div className="text-textSm font-medium text-slate-500 leading-[20px]">
                        {t('userManagement.deleteDescription')}
                    </div>
                </div>
            </BaseModal>
        </div>
    );
};

export default UsersPage;
