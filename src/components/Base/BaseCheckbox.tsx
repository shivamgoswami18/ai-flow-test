import React, { forwardRef } from 'react';
import { Checkbox, Description, FieldError, Label } from '@heroui/react';
import { IconCheck } from '@tabler/icons-react';

export interface CheckboxClassNames {
    base?: string;
    label?: string;
    wrapper?: string;
    icon?: string;
    description?: string;
    errorMessage?: string;
}

export interface BaseCheckboxProps {
    className?: string;
    classNames?: CheckboxClassNames;
    defaultSelected?: boolean;
    disabled?: boolean;
    error?: string;
    label?: React.ReactNode;
    name?: string;
    onChange?: (isSelected: boolean) => void;
    isSelected?: boolean;
    readOnly?: boolean;
    required?: boolean;
    helperText?: string;
    touched?: boolean;
}

const BaseCheckbox = forwardRef<HTMLLabelElement, BaseCheckboxProps>(
    (
        {
            className,
            classNames,
            defaultSelected,
            disabled,
            error,
            isSelected,
            name,
            onChange,
            label,
            readOnly,
            required,
            helperText,
            touched,
        },
        ref
    ) => {
        const isInvalid = !!(error && touched);

        return (
            <div className={`flex flex-col gap-1 ${className || ''} ${classNames?.base || ''}`}>
                <Checkbox
                    ref={ref}
                    id={name}
                    name={name}
                    isDisabled={disabled}
                    isReadOnly={readOnly}
                    isRequired={required}
                    isInvalid={isInvalid}
                    isSelected={isSelected}
                    defaultSelected={defaultSelected}
                    onChange={onChange}
                    className="max-w-full group flex items-start gap-3"
                >
                    <Checkbox.Control
                        className={`w-5 h-5 mt-0.5 flex items-center justify-center border-2 border-slate-300 bg-white rounded transition-all shrink-0 
                            group-data-[selected=true]:bg-royalBlue group-data-[selected=true]:border-royalBlue
                            group-hover:border-royalBlue
                            group-data-[invalid=true]:border-red-500 group-data-[disabled=true]:opacity-50
                            ${classNames?.wrapper || ''}`}
                    >
                        <Checkbox.Indicator
                            className={`text-white w-3 h-3 flex items-center justify-center ${classNames?.icon || ''}`}
                        >
                            <IconCheck size={14} stroke={4} />
                        </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Content>
                        <Label
                            htmlFor={name}
                            className={`text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors cursor-pointer select-none ${classNames?.label || ''}`}
                        >
                            {label}
                        </Label>
                    </Checkbox.Content>
                </Checkbox>
                {helperText && (
                    <Description
                        className={`ml-8 text-[11px] text-slate-400 ${classNames?.description || ''}`}
                    >
                        {helperText}
                    </Description>
                )}
                {isInvalid && error && (
                    <FieldError
                        className={`ml-8 text-red-600 text-[10px] ${classNames?.errorMessage || ''}`}
                    >
                        {error}
                    </FieldError>
                )}
            </div>
        );
    }
);

BaseCheckbox.displayName = 'BaseCheckbox';

export default BaseCheckbox;
