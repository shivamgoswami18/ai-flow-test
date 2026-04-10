import React, { useEffect, useRef, useState } from 'react';
import { Modal } from '@heroui/react';
import BaseInput from './BaseInput';

export interface ModalClassNames {
    backdrop?: string;
    container?: string;
    dialog?: string;
    header?: string;
    body?: string;
    footer?: string;
    closeButton?: string;
}

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'cover' | 'full';
type ModalPlacement = 'auto' | 'center' | 'top' | 'bottom';
type ModalScroll = 'inside' | 'outside';

interface BaseModalProps {
    visible: boolean;
    onHide: () => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    classNames?: ModalClassNames;
    closable?: boolean;
    closeOnEscape?: boolean;
    dismissableMask?: boolean;
    size?: ModalSize;
    placement?: ModalPlacement;
    scrollBehavior?: ModalScroll;
    showCloseIcon?: boolean;
    searchEnabled?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    searchDebounceMs?: number;
}

function joinClasses(...classes: Array<string | undefined | null | false>): string | undefined {
    const result = classes.filter(Boolean).join(' ');
    return result || undefined;
}

const BaseModal: React.FC<BaseModalProps> = ({
    visible,
    onHide,
    header,
    footer,
    children,
    className,
    classNames,
    closable = true,
    closeOnEscape = true,
    dismissableMask = true,
    size = 'md',
    placement = 'center',
    scrollBehavior = 'inside',
    showCloseIcon = true,
    searchEnabled = false,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    searchDebounceMs = 500,
}) => {
    const [localSearch, setLocalSearch] = useState<string>(searchValue);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    useEffect(() => {
        if (visible && searchEnabled) {
            const timer = setTimeout(() => searchRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [visible, searchEnabled]);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (localSearch !== searchValue) {
            debounceRef.current = setTimeout(() => {
                onSearchChange?.(localSearch);
            }, searchDebounceMs);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [localSearch, searchDebounceMs, onSearchChange, searchValue]);

    const handleClearSearch = () => {
        setLocalSearch('');
        onSearchChange?.('');
        setTimeout(() => searchRef.current?.focus(), 0);
    };

    const headerNode = searchEnabled ? (
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            {header ? <div className="shrink-0">{header}</div> : null}

            <div className="relative flex-1">
                <BaseInput
                    ref={searchRef}
                    type="text"
                    value={localSearch}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLocalSearch(e.target.value)
                    }
                    placeholder={searchPlaceholder}
                    suffix={
                        localSearch ? (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                                className={joinClasses(
                                    'inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700',
                                    classNames?.closeButton
                                )}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className="h-4 w-4"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        ) : null
                    }
                />
            </div>
        </div>
    ) : (
        header
    );

    return (
        <Modal>
            <Modal.Backdrop
                isOpen={visible}
                onOpenChange={(isOpen: boolean) => {
                    if (!isOpen) {
                        onHide();
                    }
                }}
                isDismissable={dismissableMask}
                isKeyboardDismissDisabled={!closeOnEscape}
                className={classNames?.backdrop}
            >
                <Modal.Container
                    placement={placement}
                    scroll={scrollBehavior}
                    size={size}
                    className={classNames?.container}
                >
                    <Modal.Dialog
                        className={joinClasses(
                            'relative flex flex-col outline-none',
                            className,
                            classNames?.dialog
                        )}
                    >
                        {({ close }: { close: () => void }) => (
                            <>
                                {showCloseIcon && closable ? (
                                    <button
                                        type="button"
                                        onClick={close}
                                        aria-label="Close modal"
                                        className={joinClasses(
                                            'absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700',
                                            classNames?.closeButton
                                        )}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                ) : null}

                                {headerNode ? (
                                    <Modal.Header className={classNames?.header}>
                                        <div className="pr-10">{headerNode}</div>
                                    </Modal.Header>
                                ) : null}

                                <Modal.Body className={classNames?.body}>{children}</Modal.Body>

                                {footer != null ? (
                                    <Modal.Footer className={classNames?.footer}>
                                        {footer}
                                    </Modal.Footer>
                                ) : null}
                            </>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};

export default BaseModal;
