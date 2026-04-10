import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SortDescriptor } from '@heroui/react';
import { Pagination, Table } from '@heroui/react';
import {
    IconArrowNarrowDown,
    IconArrowNarrowUp,
    IconArrowsSort,
    IconFileDescription,
    IconInnerShadowRight,
    IconSearch,
    IconX,
} from '@tabler/icons-react';
import BaseDropdown from './BaseDropdown';

export interface ColumnConfig<T> {
    field: keyof T | string;
    header: string;
    sortable?: boolean;
    body?: (rowData: T) => React.ReactNode;
    style?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    className?: string;
    headerClassName?: string;
}

export interface TableClassNames {
    base?: string;
    wrapper?: string;
    table?: string;
    thead?: string;
    tbody?: string;
    emptyWrapper?: string;
    loadingWrapper?: string;
    headerCell?: string;
    bodyRow?: string;
    bodyCell?: string;
}

export interface PaginationClassNames {
    base?: string;
    wrapper?: string;
    item?: string;
    prev?: string;
    next?: string;
    cursor?: string;
}

interface BaseTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    className?: string;
    classNames?: TableClassNames;
    paginationClassNames?: PaginationClassNames;
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchFields?: (keyof T | string)[];
    emptyMessage?: string;
    loading?: boolean;
    tableClassName?: string;
    paginatorClassName?: string;
    globalFilterFields?: (keyof T | string)[];
    serverSide?: boolean;
    totalRecords?: number;
    onPageChange?: (first: number, rows: number) => void;
    onSearchChange?: (searchText: string) => void;
    onSortChange?: (field: string, order: 1 | -1 | 0) => void;
    currentPage?: number;
    externalSearchValue?: string;
    showPagination?: boolean;
    showItemsPerPage?: boolean;
    showResultsCount?: boolean;
    removeLastRowBorder?: boolean;
    ariaLabel?: string;
}

function joinClasses(...classes: Array<string | undefined | null | false>): string | undefined {
    const result = classes.filter(Boolean).join(' ');
    return result || undefined;
}

function buildPageItems(page: number, pageCount: number): Array<number | 'ellipsis'> {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    if (page <= 4) {
        return [1, 2, 3, 4, 5, 'ellipsis', pageCount];
    }

    if (page >= pageCount - 3) {
        return [
            1,
            'ellipsis',
            pageCount - 4,
            pageCount - 3,
            pageCount - 2,
            pageCount - 1,
            pageCount,
        ];
    }

    return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', pageCount];
}

const BaseTable = <T extends Record<string, unknown>>({
    data,
    columns,
    className = '',
    classNames,
    paginationClassNames,
    rowsPerPageOptions = [10, 25, 50, 100],
    defaultRowsPerPage = 10,
    searchable = false,
    searchPlaceholder = 'Search',
    searchFields,
    emptyMessage = 'No records found',
    loading = false,
    tableClassName = '',
    paginatorClassName = '',
    globalFilterFields,
    serverSide = false,
    totalRecords,
    onPageChange,
    onSearchChange,
    onSortChange,
    currentPage,
    externalSearchValue,
    showPagination = false,
    showItemsPerPage = false,
    showResultsCount = false,
    removeLastRowBorder = false,
    ariaLabel = 'Data table',
}: BaseTableProps<T>) => {
    const [internalSearchValue, setInternalSearchValue] = useState<string>(
        externalSearchValue ?? ''
    );
    const [internalPage, setInternalPage] = useState<number>(
        currentPage && currentPage > 0 ? currentPage : 1
    );
    const [rows, setRows] = useState<number>(defaultRowsPerPage);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(null);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchDebounceReadyRef = useRef(false);

    const effectiveSearchValue = serverSide
        ? (externalSearchValue ?? internalSearchValue)
        : internalSearchValue;

    const effectivePage = serverSide && currentPage && currentPage > 0 ? currentPage : internalPage;

    const fieldsToSearch = useMemo(() => {
        if (searchFields && searchFields.length > 0) return searchFields as string[];
        if (globalFilterFields && globalFilterFields.length > 0)
            return globalFilterFields as string[];
        return columns?.map((col) => col.field as string);
    }, [searchFields, globalFilterFields, columns]);

    const getNestedValue = useCallback((obj: T, path: string): unknown => {
        return path.split('.').reduce<unknown>((current, key) => {
            if (current && typeof current === 'object' && key in current) {
                return (current as Record<string, unknown>)[key];
            }
            return undefined;
        }, obj);
    }, []);

    const filteredData = useMemo(() => {
        const searchText = effectiveSearchValue.trim().toLowerCase();

        if (serverSide || !searchText) return data;

        return data.filter((item) =>
            fieldsToSearch.some((field) => {
                const value = getNestedValue(item, field);
                return String(value ?? '')
                    .toLowerCase()
                    .includes(searchText);
            })
        );
    }, [data, effectiveSearchValue, fieldsToSearch, serverSide, getNestedValue]);

    const compareValues = (a: unknown, b: unknown): number => {
        if (a === b) return 0;
        if (a == null) return 1;
        if (b == null) return -1;

        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        }

        if (a instanceof Date && b instanceof Date) {
            return a.getTime() - b.getTime();
        }

        return String(a).localeCompare(String(b), undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    };

    const sortedData = useMemo(() => {
        if (serverSide || !sortDescriptor?.column) return filteredData;

        const sortField = String(sortDescriptor.column);
        const directionMultiplier = sortDescriptor.direction === 'ascending' ? 1 : -1;

        return [...filteredData].sort((a, b) => {
            const av = getNestedValue(a, sortField);
            const bv = getNestedValue(b, sortField);
            return compareValues(av, bv) * directionMultiplier;
        });
    }, [filteredData, serverSide, sortDescriptor, getNestedValue]);

    const totalCount = serverSide ? (totalRecords ?? data.length) : sortedData.length;
    const pageCount = Math.max(1, Math.ceil(totalCount / rows));

    const safePage = Math.min(Math.max(1, effectivePage), pageCount);
    const first = (safePage - 1) * rows;

    const displayedData = useMemo(() => {
        if (serverSide) return data;
        if (!showPagination) return sortedData;
        return sortedData.slice(first, first + rows);
    }, [data, first, rows, serverSide, showPagination, sortedData]);

    const pageItems = useMemo(() => buildPageItems(safePage, pageCount), [safePage, pageCount]);

    useEffect(() => {
        if (!serverSide || !onSearchChange) return undefined;

        if (!searchDebounceReadyRef.current) {
            searchDebounceReadyRef.current = true;
            return undefined;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            onSearchChange(effectiveSearchValue);
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [effectiveSearchValue, onSearchChange, serverSide]);

    const handleRowsChange = useCallback(
        (value: string) => {
            const nextRows = Number(value);
            if (!Number.isFinite(nextRows) || nextRows <= 0) return;

            setRows(nextRows);
            setInternalPage(1);
            if (serverSide) onPageChange?.(0, nextRows);
        },
        [serverSide, onPageChange]
    );

    const handlePageChange = useCallback(
        (nextPage: number) => {
            const boundedPage = Math.min(Math.max(1, nextPage), pageCount);
            setInternalPage(boundedPage);

            if (serverSide) {
                onPageChange?.((boundedPage - 1) * rows, rows);
            }
        },
        [pageCount, serverSide, onPageChange, rows]
    );

    const handleSortChange = useCallback(
        (descriptor: SortDescriptor) => {
            setSortDescriptor(descriptor);

            if (serverSide) {
                const order: 1 | -1 | 0 = descriptor.direction === 'ascending' ? 1 : -1;
                onSortChange?.(String(descriptor.column), order);
            }
        },
        [serverSide, onSortChange]
    );

    const start = totalCount === 0 ? 0 : (safePage - 1) * rows + 1;
    const end =
        totalCount === 0
            ? 0
            : serverSide
              ? Math.min(start + displayedData.length - 1, totalCount)
              : Math.min(start + displayedData.length - 1, totalCount);

    return (
        <div className={joinClasses('w-full min-w-0 overflow-x-auto', className, classNames?.base)}>
            {(searchable || showItemsPerPage) && (
                <div className="mb-5 flex flex-col items-center gap-4 md:flex-row md:justify-between">
                    {searchable ? (
                        <div className="relative w-full max-w-sm">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-neutral-500">
                                <IconSearch />
                            </span>

                            <input
                                type="text"
                                value={effectiveSearchValue}
                                onChange={(e) => setInternalSearchValue(e.target.value)}
                                placeholder={searchPlaceholder}
                                aria-label={searchPlaceholder}
                                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-10 pr-10 m-2 text-sm outline-none transition focus:border-neutral-400"
                            />

                            {effectiveSearchValue ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setInternalSearchValue('');
                                        if (!serverSide) {
                                            onSearchChange?.('');
                                        }
                                    }}
                                    aria-label="Clear search"
                                    className="absolute right-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
                                >
                                    <IconX />
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="flex-1" />
                    )}

                    {showItemsPerPage ? (
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-xs font-medium text-neutral-700">Showing</span>
                            <BaseDropdown
                                value={String(rows)}
                                onChange={handleRowsChange}
                                options={rowsPerPageOptions?.map((opt) => ({
                                    value: String(opt),
                                    label: String(opt),
                                }))}
                                placeholder="10"
                                classNames={{
                                    wrapper: 'w-16 sm:w-16',
                                    trigger:
                                        'h-8 rounded-xl border border-neutral-200 bg-white px-3 text-sm',
                                }}
                            />
                            <span className="text-xs font-medium text-neutral-700">entries</span>
                        </div>
                    ) : null}
                </div>
            )}

            <Table className={classNames?.base}>
                <Table.ScrollContainer className={classNames?.wrapper}>
                    <Table.Content
                        aria-label={ariaLabel}
                        className={joinClasses(tableClassName, classNames?.table)}
                        sortDescriptor={sortDescriptor ?? undefined}
                        onSortChange={handleSortChange}
                    >
                        <Table.Header className={classNames?.thead}>
                            {columns?.map((col) => {
                                const isActiveSort = sortDescriptor?.column === col.field;
                                const isAscending = sortDescriptor?.direction === 'ascending';

                                return (
                                    <Table.Column
                                        key={String(col.field)}
                                        style={col.headerStyle}
                                        className={joinClasses(
                                            classNames?.headerCell,
                                            col.headerClassName
                                        )}
                                    >
                                        <div
                                            className={joinClasses(
                                                'flex items-center gap-1.5',
                                                col.sortable !== false && displayedData.length > 0
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            )}
                                            onClick={() => {
                                                if (
                                                    col.sortable !== false &&
                                                    displayedData.length > 0
                                                ) {
                                                    const direction =
                                                        isActiveSort && isAscending
                                                            ? 'descending'
                                                            : 'ascending';
                                                    handleSortChange({
                                                        column: String(col.field),
                                                        direction: direction as
                                                            | 'ascending'
                                                            | 'descending',
                                                    });
                                                }
                                            }}
                                        >
                                            <span>{col.header}</span>
                                            {col.sortable !== false ? (
                                                <span className="inline-flex h-3.5 w-3.5 items-center justify-center text-neutral-500">
                                                    {isActiveSort ? (
                                                        isAscending ? (
                                                            <IconArrowNarrowUp />
                                                        ) : (
                                                            <IconArrowNarrowDown />
                                                        )
                                                    ) : (
                                                        <IconArrowsSort />
                                                    )}
                                                </span>
                                            ) : null}
                                        </div>
                                    </Table.Column>
                                );
                            })}
                        </Table.Header>

                        <Table.Body className={classNames?.tbody}>
                            {displayedData?.map((row, rowIndex) => (
                                <Table.Row
                                    key={rowIndex}
                                    id={rowIndex}
                                    className={joinClasses(
                                        classNames?.bodyRow,
                                        removeLastRowBorder && rowIndex === displayedData.length - 1
                                            ? 'border-b-0'
                                            : undefined
                                    )}
                                >
                                    {columns?.map((col) => (
                                        <Table.Cell
                                            key={String(col.field)}
                                            style={col.style}
                                            className={joinClasses(
                                                classNames?.bodyCell,
                                                col.className
                                            )}
                                        >
                                            {col.body
                                                ? col.body(row)
                                                : ((getNestedValue(
                                                      row,
                                                      String(col.field)
                                                  ) as React.ReactNode) ?? '—')}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>

                    {loading ? (
                        <div
                            className={joinClasses(
                                'flex items-center justify-center gap-2 text-sm text-neutral-500 py-16',
                                classNames?.loadingWrapper
                            )}
                        >
                            <IconInnerShadowRight className="animate-spin" />
                            <span>Loading...</span>
                        </div>
                    ) : null}

                    {!loading && displayedData.length === 0 ? (
                        <div className={joinClasses('py-16 text-center', classNames?.emptyWrapper)}>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center text-neutral-400">
                                <IconFileDescription />
                            </div>
                            <p className="mb-1 text-sm font-medium text-neutral-500">
                                {emptyMessage}
                            </p>
                        </div>
                    ) : null}
                </Table.ScrollContainer>

                {showPagination || showResultsCount ? (
                    <Table.Footer
                        className={joinClasses(
                            'mt-4 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                            paginatorClassName
                        )}
                    >
                        {showResultsCount ? (
                            <div className="text-sm text-neutral-600">
                                Showing {start} to {end} of {totalCount} entries
                                {!serverSide && effectiveSearchValue
                                    ? ` (filtered from ${data.length} total)`
                                    : ''}
                            </div>
                        ) : (
                            <div className="flex-1" />
                        )}

                        {showPagination && totalCount > 0 && pageCount > 1 ? (
                            <Pagination className={paginationClassNames?.base}>
                                <Pagination.Content
                                    className={joinClasses(
                                        'ml-auto flex flex-wrap items-center gap-1',
                                        paginationClassNames?.wrapper
                                    )}
                                >
                                    <Pagination.Item className={paginationClassNames?.item}>
                                        <Pagination.Previous
                                            isDisabled={safePage <= 1}
                                            onPress={() => handlePageChange(safePage - 1)}
                                            className={paginationClassNames?.prev}
                                        >
                                            <Pagination.PreviousIcon />
                                            <span>Prev</span>
                                        </Pagination.Previous>
                                    </Pagination.Item>

                                    {pageItems?.map((item, index) => (
                                        <Pagination.Item
                                            key={`${item}-${index}`}
                                            className={paginationClassNames?.item}
                                        >
                                            {item === 'ellipsis' ? (
                                                <Pagination.Ellipsis />
                                            ) : (
                                                <Pagination.Link
                                                    isActive={item === safePage}
                                                    onPress={() => handlePageChange(item)}
                                                    className={joinClasses(
                                                        item === safePage
                                                            ? paginationClassNames?.cursor
                                                            : undefined
                                                    )}
                                                >
                                                    {item}
                                                </Pagination.Link>
                                            )}
                                        </Pagination.Item>
                                    ))}

                                    <Pagination.Item className={paginationClassNames?.item}>
                                        <Pagination.Next
                                            isDisabled={safePage >= pageCount}
                                            onPress={() => handlePageChange(safePage + 1)}
                                            className={paginationClassNames?.next}
                                        >
                                            <span>Next</span>
                                            <Pagination.NextIcon />
                                        </Pagination.Next>
                                    </Pagination.Item>
                                </Pagination.Content>
                            </Pagination>
                        ) : null}
                    </Table.Footer>
                ) : null}
            </Table>
        </div>
    );
};

export default BaseTable;
