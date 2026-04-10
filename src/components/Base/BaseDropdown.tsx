import React from 'react';
import { Label, ListBox, Select, type Key } from '@heroui/react';

export interface SelectClassNames {
    wrapper?: string;
    label?: string;
    select?: string;
    trigger?: string;
    value?: string;
    indicator?: string;
    popover?: string;
    listbox?: string;
    helperText?: string;
    errorMessage?: string;
}

export interface DropdownOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface BaseDropdownProps {
    className?: string;
    classNames?: SelectClassNames;
    disabled?: boolean;
    error?: string;
    fullWidth?: boolean;
    label?: React.ReactNode;
    name?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    value?: string;
    handleBlur?: React.FocusEventHandler<Element>;
    touched?: boolean;
    options: DropdownOption[];
    icon?: React.ReactNode;
    endIcon?: React.ReactNode;
    helperText?: React.ReactNode;
}

function joinClasses(...classes: Array<string | undefined | null | false>): string | undefined {
    const result = classes.filter(Boolean).join(' ');
    return result || undefined;
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
    className,
    classNames,
    disabled,
    error,
    fullWidth,
    name,
    onChange,
    placeholder,
    label,
    required,
    value,
    handleBlur,
    touched,
    options,
    icon,
    endIcon,
    helperText,
}) => {
    const isInvalid = Boolean(error && touched);

    const disabledKeys = React.useMemo<Iterable<Key>>(
        () => options.filter((option) => option.disabled)?.map((option) => option.value),
        [options]
    );

    const handleSelectionChange = (next: Key | Key[] | null) => {
        if (next == null) return;

        if (Array.isArray(next)) {
            const first = next[0];
            if (first != null) onChange?.(String(first));
            return;
        }

        onChange?.(String(next));
    };

    return (
        <div
            className={joinClasses('flex w-full flex-col gap-1.5', className, classNames?.wrapper)}
        >
            <Select
                id={name}
                name={name}
                className={classNames?.select}
                isDisabled={disabled}
                isRequired={required}
                isInvalid={isInvalid}
                fullWidth={fullWidth}
                selectedKey={value ?? null}
                onSelectionChange={handleSelectionChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabledKeys={disabledKeys}
                aria-label={typeof label === 'string' ? label : (name ?? 'dropdown')}
            >
                {label ? <Label className={classNames?.label}>{label}</Label> : null}

                <Select.Trigger className={classNames?.trigger}>
                    {icon ? <span className="shrink-0">{icon}</span> : null}

                    <Select.Value className={classNames?.value} />

                    {endIcon ? (
                        <Select.Indicator className={classNames?.indicator}>
                            {endIcon}
                        </Select.Indicator>
                    ) : (
                        <Select.Indicator className={classNames?.indicator} />
                    )}
                </Select.Trigger>

                <Select.Popover className={classNames?.popover}>
                    <ListBox className={classNames?.listbox}>
                        {options?.map((option) => (
                            <ListBox.Item
                                key={option.value}
                                id={option.value}
                                textValue={option.label}
                            >
                                {option.label}
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>

            {helperText && !isInvalid ? (
                <p className={joinClasses('text-sm text-neutral-500', classNames?.helperText)}>
                    {helperText}
                </p>
            ) : null}

            {isInvalid ? (
                <p className={joinClasses('text-sm text-red-600', classNames?.errorMessage)}>
                    {error}
                </p>
            ) : null}
        </div>
    );
};

export default BaseDropdown;
