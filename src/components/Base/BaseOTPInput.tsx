'use client';

import React, { useRef } from 'react';
import { Input } from '@heroui/react';

interface BaseOTPInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    boxClassName?: string;
    error?: string;
    touched?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

function joinClasses(...classes: Array<string | undefined | null | false>): string {
    return classes.filter(Boolean).join(' ');
}

export default function BaseOTPInput({
    length,
    value,
    onChange,
    className = '',
    boxClassName = '',
    error,
    touched,
    disabled,
    placeholder = '–',
}: Readonly<BaseOTPInputProps>) {
    const digits = Array.from({ length }, (_, index) => value[index] ?? '');
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const focusBox = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const handleChange = (rawValue: string, index: number) => {
        if (disabled) return;

        const digit = rawValue.replace(/[^0-9]/g, '').slice(-1);
        const updated = [...digits];
        updated[index] = digit;
        onChange(updated.join(''));

        if (digit && index < length - 1) {
            focusBox(index + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (disabled) return;

        if (e.key === 'Backspace') {
            e.preventDefault();

            const updated = [...digits];

            if (updated[index]) {
                updated[index] = '';
                onChange(updated.join(''));
            } else if (index > 0) {
                updated[index - 1] = '';
                onChange(updated.join(''));
                focusBox(index - 1);
            }

            return;
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            focusBox(index - 1);
        }

        if (e.key === 'ArrowRight' && index < length - 1) {
            focusBox(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        e.preventDefault();

        const pasted = e.clipboardData
            .getData('text')
            .replace(/[^0-9]/g, '')
            .slice(0, length);

        if (!pasted) return;

        const updated = [...digits];
        pasted.split('').forEach((digit, index) => {
            updated[index] = digit;
        });

        onChange(updated.join(''));
        focusBox(Math.min(pasted.length, length - 1));
    };

    const isInvalid = Boolean(error && touched);

    return (
        <div>
            <div className="w-full overflow-x-auto">
                <div className={joinClasses('flex gap-2', className)}>
                    {digits?.map((digit, index) => (
                        <Input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el as unknown as HTMLInputElement | null;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            disabled={disabled}
                            aria-invalid={isInvalid}
                            placeholder={placeholder}
                            className={joinClasses(
                                'text-center',
                                isInvalid && 'border-danger',
                                boxClassName
                            )}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            aria-label={`OTP digit ${index + 1} of ${length}`}
                        />
                    ))}
                </div>
            </div>

            {isInvalid && error ? (
                <small className="mt-1 block text-xs text-red-500">{error}</small>
            ) : null}
        </div>
    );
}
