'use client';

import React, { useState, forwardRef } from 'react';
import {
    TextField,
    Label,
    Input,
    TextArea,
    InputGroup,
    Description,
    FieldError,
} from '@heroui/react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { SingleDigitKeyRegex } from '../Constants/Validation';

// KEY SLOTS FOR FIGMA CUSTOMISATION:
//   inputWrapper  → controls border, border-radius, background, height, padding
//   input         → font, text colour, placeholder colour
//   label         → label font, colour, size
//   errorMessage  → error text styling
//   description   → helper text styling

export interface InputClassNames {
    base?: string;
    label?: string;
    mainWrapper?: string;
    inputWrapper?: string;
    innerWrapper?: string;
    input?: string;
    clearButton?: string;
    description?: string;
    errorMessage?: string;
}

export interface TextAreaClassNames {
    base?: string;
    label?: string;
    inputWrapper?: string;
    innerWrapper?: string;
    input?: string;
    description?: string;
    errorMessage?: string;
}

export interface BaseInputProps {
    autoComplete?: string;
    className?: string;
    classNames?: InputClassNames | TextAreaClassNames;
    defaultValue?: string;
    disabled?: boolean;
    error?: string;
    fullWidth?: boolean;
    label?: string;
    name?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    type?: string;
    value?: string;
    handleBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    touched?: boolean;
    maxLength?: number;
    rows?: number;
    helperText?: string;
    icon?: React.ReactNode;
    suffix?: React.ReactNode;
    numbersOnly?: boolean;
    lowercase?: boolean;
}

const PasswordEyeIcon = ({
    showPassword,
    setShowPassword,
}: {
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
    <button
        type="button"
        tabIndex={-1}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        onClick={() => setShowPassword((v) => !v)}
        className="flex items-center focus:outline-none text-gray-400 hover:text-gray-600"
    >
        {showPassword ? <IconEye /> : <IconEyeOff />}
    </button>
);

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
    (
        {
            autoComplete,
            className,
            classNames,
            defaultValue,
            disabled,
            error,
            fullWidth,
            name,
            onChange,
            placeholder,
            label,
            readOnly,
            required,
            type = 'text',
            value,
            handleBlur,
            touched,
            maxLength,
            rows = 4,
            helperText,
            onKeyDown,
            icon,
            suffix,
            numbersOnly = false,
            lowercase = false,
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);

        const handleChangeInternal = (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            if (numbersOnly) e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (lowercase) e.target.value = e.target.value.toLowerCase();
            onChange?.(e);
        };

        const handleKeyDownInternal = (
            e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            if (numbersOnly) {
                const allowed = [
                    'Backspace',
                    'Delete',
                    'Tab',
                    'Escape',
                    'Enter',
                    'ArrowLeft',
                    'ArrowRight',
                    'ArrowUp',
                    'ArrowDown',
                    'Home',
                    'End',
                    'AllowMultiple',
                ];
                const isDigit = SingleDigitKeyRegex.test(e.key);
                const isAllowed = allowed.includes(e.key);
                const isCtrl = (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key);
                if (!isDigit && !isAllowed && !isCtrl) e.preventDefault();
            }
            onKeyDown?.(e);
        };

        const isInvalid = !!(error && touched);

        if (type === 'textarea') {
            return (
                <TextField
                    id={name}
                    name={name}
                    isDisabled={disabled}
                    isReadOnly={readOnly}
                    isRequired={required}
                    isInvalid={isInvalid}
                    autoComplete={autoComplete}
                    fullWidth={fullWidth}
                    className={`${className || ''} ${(classNames as TextAreaClassNames)?.base || ''}`}
                >
                    {label && (
                        <Label className={(classNames as TextAreaClassNames)?.label}>{label}</Label>
                    )}
                    <InputGroup
                        fullWidth={fullWidth}
                        className={(classNames as TextAreaClassNames)?.inputWrapper}
                    >
                        {icon && <InputGroup.Prefix>{icon}</InputGroup.Prefix>}
                        <TextArea
                            fullWidth={fullWidth}
                            placeholder={placeholder}
                            value={value}
                            defaultValue={defaultValue}
                            rows={rows}
                            maxLength={maxLength}
                            className={(classNames as TextAreaClassNames)?.input}
                            onBlur={handleBlur as React.FocusEventHandler<HTMLTextAreaElement>}
                            onKeyDown={
                                numbersOnly
                                    ? (handleKeyDownInternal as React.KeyboardEventHandler<HTMLTextAreaElement>)
                                    : (onKeyDown as React.KeyboardEventHandler<HTMLTextAreaElement>)
                            }
                            onChange={
                                numbersOnly || lowercase
                                    ? (handleChangeInternal as React.ChangeEventHandler<HTMLTextAreaElement>)
                                    : (onChange as React.ChangeEventHandler<HTMLTextAreaElement>)
                            }
                        />
                        {suffix && <InputGroup.Suffix>{suffix}</InputGroup.Suffix>}
                    </InputGroup>
                    {helperText && (
                        <Description className={(classNames as TextAreaClassNames)?.description}>
                            {helperText}
                        </Description>
                    )}
                    {isInvalid && error && (
                        <FieldError className={(classNames as TextAreaClassNames)?.errorMessage}>
                            {error}
                        </FieldError>
                    )}
                </TextField>
            );
        }

        const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

        return (
            <TextField
                id={name}
                name={name}
                isDisabled={disabled}
                isReadOnly={readOnly}
                isRequired={required}
                isInvalid={isInvalid}
                autoComplete={autoComplete}
                fullWidth={fullWidth}
                className={`${className || ''} ${(classNames as InputClassNames)?.base || ''}`}
            >
                {label && <Label className={(classNames as InputClassNames)?.label}>{label}</Label>}
                <InputGroup
                    fullWidth={fullWidth}
                    className={(classNames as InputClassNames)?.inputWrapper}
                >
                    {icon && <InputGroup.Prefix>{icon}</InputGroup.Prefix>}
                    <Input
                        ref={ref}
                        fullWidth={fullWidth}
                        type={inputType}
                        placeholder={placeholder}
                        value={value}
                        defaultValue={defaultValue}
                        className={(classNames as InputClassNames)?.input}
                        maxLength={maxLength}
                        onBlur={handleBlur as React.FocusEventHandler<HTMLInputElement>}
                        onKeyDown={
                            numbersOnly
                                ? (handleKeyDownInternal as React.KeyboardEventHandler<HTMLInputElement>)
                                : (onKeyDown as React.KeyboardEventHandler<HTMLInputElement>)
                        }
                        onChange={
                            numbersOnly || lowercase
                                ? (handleChangeInternal as React.ChangeEventHandler<HTMLInputElement>)
                                : (onChange as React.ChangeEventHandler<HTMLInputElement>)
                        }
                    />
                    {(type === 'password' || suffix) && (
                        <InputGroup.Suffix>
                            {type === 'password' ? (
                                <PasswordEyeIcon
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                />
                            ) : (
                                suffix
                            )}
                        </InputGroup.Suffix>
                    )}
                </InputGroup>
                {helperText && (
                    <Description className={(classNames as InputClassNames)?.description}>
                        {helperText}
                    </Description>
                )}
                {isInvalid && error && (
                    <FieldError className={(classNames as InputClassNames)?.errorMessage}>
                        {error}
                    </FieldError>
                )}
            </TextField>
        );
    }
);

BaseInput.displayName = 'BaseInput';
export default BaseInput;
