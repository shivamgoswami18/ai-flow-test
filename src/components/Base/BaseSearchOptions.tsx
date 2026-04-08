'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FieldError, Input, InputGroup, Label, TextField } from '@heroui/react';
import { IconArrowRight, IconLoader2, IconSearch, IconX } from '@tabler/icons-react';
import BaseButton from './BaseButton';

export interface SuggestionItem {
    value: string;
    label: string;
    [key: string]: string | number | boolean | undefined;
}

export interface SearchClassNames {
    base?: string;
    label?: string;
    inputWrapper?: string;
    input?: string;
    dropdown?: string;
    dropdownItem?: string;
    emptyMessage?: string;
    errorMessage?: string;
}

interface BaseSearchOptionsProps {
    className?: string;
    classNames?: SearchClassNames;
    disabled?: boolean;
    error?: string;
    fullWidth?: boolean;
    label?: string;
    name?: string;
    onChange?: (value: string) => void;
    onSelect?: (item: SuggestionItem) => void;
    placeholder?: string;
    required?: boolean;
    value?: string;
    handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    touched?: boolean;
    labelClassName?: string;
    icon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onSearch?: (query: string) => Promise<void> | void;
    suggestions?: SuggestionItem[];
    loading?: boolean;
    debounceDelay?: number;
    itemTemplate?: (item: SuggestionItem) => React.ReactNode;
    minSearchLength?: number;
    showClearButton?: boolean;
    onClear?: () => void;
    onButtonClick?: () => void;
    showSearchButton?: boolean;
    searchButtonLabel?: string;
}

function joinClasses(...classes: Array<string | undefined | null | false>): string | undefined {
    const result = classes.filter(Boolean).join(' ');
    return result || undefined;
}

const BaseSearchOptions: React.FC<BaseSearchOptionsProps> = ({
    className,
    classNames,
    disabled,
    error,
    fullWidth,
    name,
    onChange,
    onSelect,
    placeholder = 'Search...',
    label,
    required,
    value = '',
    handleBlur,
    touched,
    labelClassName,
    icon,
    endIcon,
    onSearch,
    suggestions = [],
    loading = false,
    debounceDelay = 500,
    itemTemplate,
    minSearchLength = 1,
    showClearButton = true,
    onClear,
    onButtonClick,
    showSearchButton = false,
    searchButtonLabel,
}) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    // Tracks whether current value satisfies minSearchLength
    const [hasActiveQuery, setHasActiveQuery] = useState(false);

    const isInvalid = !!(error && touched);

    // ── Outside click ──────────────────────────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ── Scroll keyboard-active item into view (DOM mutation — no setState) ─
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);

    // ── Debounce cleanup ───────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    // ── Core search scheduler ──────────────────────────────────────────────
    const scheduleSearch = useCallback(
        (query: string) => {
            if (debounceRef.current) clearTimeout(debounceRef.current);

            if (!query || query.trim().length < minSearchLength) {
                setHasActiveQuery(false);
                setOpen(false);
                setActiveIndex(-1);
                return;
            }

            setHasActiveQuery(true);
            setOpen(true); // show spinner immediately while debounce is pending
            setActiveIndex(-1);

            debounceRef.current = setTimeout(() => {
                onSearch?.(query);
            }, debounceDelay);
        },
        [debounceDelay, minSearchLength, onSearch]
    );

    // ── Event handlers ─────────────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
        scheduleSearch(e.target.value);
    };

    const handleSelect = (item: SuggestionItem) => {
        onChange?.(item.label);
        onSelect?.(item);
        setOpen(false);
        setActiveIndex(-1);
        setHasActiveQuery(false);
        inputRef.current?.focus();
    };

    const handleClear = () => {
        onChange?.('');
        setOpen(false);
        setActiveIndex(-1);
        setHasActiveQuery(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onClear?.();
        inputRef.current?.focus();
    };

    const handleFocus = () => {
        if (hasActiveQuery) setOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) return;
        const itemCount = suggestions.length;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && suggestions[activeIndex]) {
                    handleSelect(suggestions[activeIndex]);
                } else {
                    onButtonClick?.();
                }
                break;
            case 'Escape':
                setOpen(false);
                setActiveIndex(-1);
                break;
        }
    };

    const showDropdown = open && hasActiveQuery;

    // Suffix: loader → clear → endIcon → searchButton
    const suffixNode = (
        <div className="flex items-center gap-1">
            {loading && <IconLoader2 size={16} className="animate-spin text-neutral-400" />}

            {!loading && showClearButton && value && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    onMouseDown={(e) => e.preventDefault()}
                    className="inline-flex h-5 w-5 items-center justify-center rounded text-neutral-400 transition hover:text-neutral-600"
                >
                    <IconX size={14} />
                </button>
            )}

            {!loading && endIcon && !showSearchButton && (
                <span className="pointer-events-none flex items-center text-neutral-400">
                    {endIcon}
                </span>
            )}

            {showSearchButton && (
                <BaseButton
                    type="button"
                    disabled={disabled || loading}
                    onClick={onButtonClick}
                    label={searchButtonLabel}
                    endIcon={!searchButtonLabel ? <IconArrowRight size={15} /> : undefined}
                    className={joinClasses(
                        'rounded-lg bg-neutral-900 text-white hover:bg-neutral-700',
                        searchButtonLabel ? 'h-7 px-3 text-xs font-medium' : 'h-7 w-7 p-0'
                    )}
                />
            )}
        </div>
    );

    return (
        <div
            ref={wrapperRef}
            className={joinClasses(
                'relative flex flex-col gap-1.5',
                fullWidth ? 'w-full' : '',
                className,
                classNames?.base
            )}
        >
            {/* ── HeroUI TextField — same pattern as BaseInput ── */}
            <TextField
                id={name}
                name={name}
                isDisabled={disabled || loading}
                isRequired={required}
                isInvalid={isInvalid}
                fullWidth={fullWidth}
                className={classNames?.base}
            >
                {label && (
                    <Label
                        className={joinClasses(
                            'text-sm font-medium text-neutral-700',
                            labelClassName,
                            classNames?.label
                        )}
                    >
                        {label}
                    </Label>
                )}

                <InputGroup fullWidth={fullWidth} className={classNames?.inputWrapper}>
                    <InputGroup.Prefix>
                        {icon ?? <IconSearch size={18} className="text-neutral-400" />}
                    </InputGroup.Prefix>

                    <Input
                        ref={inputRef}
                        fullWidth={fullWidth}
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        autoComplete="off"
                        aria-autocomplete="list"
                        aria-expanded={showDropdown}
                        aria-activedescendant={
                            activeIndex >= 0 ? `${name}-suggestion-${activeIndex}` : undefined
                        }
                        className={classNames?.input}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />

                    <InputGroup.Suffix>{suffixNode}</InputGroup.Suffix>
                </InputGroup>

                {isInvalid && error && (
                    <FieldError className={joinClasses('text-xs', classNames?.errorMessage)}>
                        {error}
                    </FieldError>
                )}
            </TextField>

            {/* ── Suggestions dropdown ─────────────────────────────────── */}
            {showDropdown && (
                <div
                    className={joinClasses(
                        'absolute left-0 right-0 z-50 rounded-xl border border-neutral-200 bg-white shadow-lg',
                        label ? 'top-[4.75rem]' : 'top-[2.875rem]',
                        classNames?.dropdown
                    )}
                >
                    {suggestions.length === 0 ? (
                        <p
                            className={joinClasses(
                                'px-4 py-3 text-sm text-neutral-400',
                                classNames?.emptyMessage
                            )}
                        >
                            {loading ? 'Searching…' : 'No results found'}
                        </p>
                    ) : (
                        <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto py-1">
                            {suggestions?.map((item, index) => (
                                <li
                                    key={item.value}
                                    id={`${name}-suggestion-${index}`}
                                    role="option"
                                    aria-selected={index === activeIndex}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelect(item);
                                    }}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={joinClasses(
                                        'cursor-pointer px-4 py-2.5 text-sm text-neutral-800 transition',
                                        index === activeIndex
                                            ? 'bg-neutral-100 text-neutral-900'
                                            : 'hover:bg-neutral-50',
                                        classNames?.dropdownItem
                                    )}
                                >
                                    {itemTemplate ? itemTemplate(item) : item.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default BaseSearchOptions;
