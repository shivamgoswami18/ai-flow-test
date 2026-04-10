import React, { useMemo, useState, useRef } from 'react';
import { IconSearch, IconX, IconChevronDown, IconCheck } from '@tabler/icons-react';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/react';
import BaseInput from './BaseInput';
import BaseButton from './BaseButton';
import { useTranslation } from 'react-i18next';

export interface MultiSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface MultiSelectClassNames {
    wrapper?: string;
    label?: string;
    trigger?: string;
    value?: string;
    indicator?: string;
    popover?: string;
    listbox?: string;
    searchWrapper?: string;
    searchInput?: string;
    helperText?: string;
    errorMessage?: string;
}

interface BaseMultiSelectProps {
    className?: string;
    classNames?: MultiSelectClassNames;
    disabled?: boolean;
    error?: string;
    fullWidth?: boolean;
    label?: React.ReactNode;
    name?: string;
    onChange?: (values: string[]) => void;
    placeholder?: string;
    required?: boolean;
    value?: string[];
    handleBlur?: () => void;
    touched?: boolean;
    options: MultiSelectOption[];
    helperText?: React.ReactNode;
}

function joinClasses(...classes: Array<string | undefined | null | false>): string | undefined {
    const result = classes.filter(Boolean).join(' ');
    return result || undefined;
}

const BaseMultiSelect: React.FC<BaseMultiSelectProps> = ({
    className,
    classNames,
    disabled,
    error,
    fullWidth,
    name,
    onChange,
    placeholder = 'Select...',
    label,
    required,
    value = [],
    handleBlur,
    touched,
    options,
    helperText,
}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const triggerRef = useRef<HTMLDivElement>(null);
    const isInvalid = Boolean(error && touched);

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    const triggerLabel = useMemo(() => {
        if (value.length === 0) return null;
        return options
            .filter((o) => value.includes(o.value))
            .map((o) => o.label)
            .join(', ');
    }, [value, options]);

    const toggleOption = (optionValue: string) => {
        const next = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue];
        onChange?.(next);
    };

    const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);

    React.useEffect(() => {
        if (isOpen && triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [isOpen]);

    return (
        <div
            className={joinClasses(
                'flex flex-col gap-1.5',
                fullWidth ? 'w-full' : undefined,
                className,
                classNames?.wrapper
            )}
        >
            {label && (
                <label
                    htmlFor={name}
                    className={joinClasses('text-sm font-medium text-slate-700', classNames?.label)}
                >
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}

            <div className="relative" ref={triggerRef}>
                <Popover
                    isOpen={isOpen}
                    onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) handleBlur?.();
                    }}
                >
                    <PopoverTrigger>
                        <BaseButton
                            disabled={disabled}
                            className={joinClasses(
                                'w-full bg-white border rounded-[8px] h-auto py-3 px-4 text-small font-medium flex items-center justify-between transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer',
                                classNames?.trigger,
                                isOpen ? 'border-primary' : 'border-slate-200 hover:border-primary',
                                isInvalid && 'border-red-500!',
                                disabled && 'opacity-50 cursor-not-allowed'
                            )}
                            endIcon={
                                <IconChevronDown
                                    size={18}
                                    className={joinClasses(
                                        'shrink-0 text-slate-400 transition-transform duration-200',
                                        isOpen && 'rotate-180',
                                        classNames?.indicator
                                    )}
                                />
                            }
                        >
                            <span
                                className={joinClasses(
                                    'overflow-hidden text-ellipsis whitespace-nowrap text-left flex-1',
                                    triggerLabel ? 'text-slate-900' : 'text-slate-400',
                                    classNames?.value
                                )}
                            >
                                {triggerLabel ?? placeholder}
                            </span>
                        </BaseButton>
                    </PopoverTrigger>
                    <PopoverContent
                        className={joinClasses(
                            'p-0 border border-slate-200 rounded-[8px] shadow-xl bg-white overflow-hidden',
                            classNames?.popover
                        )}
                        style={{ width: triggerWidth ? `${triggerWidth}px` : 'auto' }}
                    >
                        <div
                            className={joinClasses(
                                'p-2 sticky top-0 bg-white z-10 border-b border-slate-50',
                                classNames?.searchWrapper
                            )}
                        >
                            <BaseInput
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<IconSearch size={14} className="text-slate-400" />}
                                suffix={
                                    searchQuery ? (
                                        <BaseButton
                                            onClick={() => setSearchQuery('')}
                                            className="p-1 min-w-0 h-auto bg-transparent hover:bg-slate-100 rounded-lg transition-colors border-none shadow-none"
                                            aria-label="Clear search"
                                        >
                                            <IconX className="text-slate-400" />
                                        </BaseButton>
                                    ) : undefined
                                }
                                classNames={{
                                    input: 'text-mini font-medium placeholder:text-slate-400 w-full',
                                }}
                                className={classNames?.searchInput}
                            />
                        </div>

                        <ul
                            role="listbox"
                            aria-multiselectable="true"
                            className={joinClasses(
                                'max-h-64 overflow-y-auto py-1',
                                classNames?.listbox
                            )}
                        >
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => {
                                    const isSelected = value.includes(option.value);
                                    return (
                                        <li
                                            key={option.value}
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() =>
                                                !option.disabled && toggleOption(option.value)
                                            }
                                            className={joinClasses(
                                                'px-4 py-2 cursor-pointer text-sm rounded-lg mx-1 flex items-center justify-between transition-colors',
                                                isSelected
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-slate-700 hover:bg-slate-50',
                                                option.disabled &&
                                                    'opacity-40 cursor-not-allowed pointer-events-none'
                                            )}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && <IconCheck className="shrink-0" />}
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="px-4 py-3 text-sm text-slate-400 text-center italic">
                                    {t('commonConstants.noResultsFound')}
                                </li>
                            )}
                        </ul>
                    </PopoverContent>
                </Popover>
            </div>
            {helperText && !isInvalid && (
                <p
                    className={joinClasses(
                        'text-[11px] text-slate-400 ml-1',
                        classNames?.helperText
                    )}
                >
                    {helperText}
                </p>
            )}

            {isInvalid && error && (
                <p
                    className={joinClasses(
                        'text-[10px] text-red-600 ml-1',
                        classNames?.errorMessage
                    )}
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default BaseMultiSelect;
