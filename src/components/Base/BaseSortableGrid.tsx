import React, { useMemo, useState } from 'react';
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

export type BaseSortableItem = {
    id: UniqueIdentifier;
};

type RenderItemArgs = {
    activeId: UniqueIdentifier | null;
};

type Props<TItem extends BaseSortableItem> = {
    items: TItem[];
    onItemsChange: (next: TItem[]) => void;
    renderItem: (item: TItem, args: RenderItemArgs) => React.ReactNode;
    renderOverlay?: (activeItem: TItem) => React.ReactNode;
    containerClassName?: string;
    activationDistance?: number;
    children?: React.ReactNode;
};

export default function BaseSortableGrid<TItem extends BaseSortableItem>({
    items,
    onItemsChange,
    renderItem,
    renderOverlay,
    containerClassName = '',
    activationDistance = 8,
    children,
}: Props<TItem>) {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: activationDistance } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const activeItem = useMemo(
        () => (activeId != null ? items.find((i) => i.id === activeId) : undefined),
        [activeId, items]
    );

    const onDragStart = (e: DragStartEvent) => setActiveId(e.active.id);

    const onDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        setActiveId(null);
        if (!over) return;
        if (active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        onItemsChange(arrayMove(items, oldIndex, newIndex));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragCancel={() => setActiveId(null)}
            onDragEnd={onDragEnd}
        >
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div className={containerClassName}>
                    {items.map((item) => renderItem(item, { activeId }))}
                    {children}
                </div>
            </SortableContext>

            {renderOverlay ? (
                <DragOverlay>{activeItem ? renderOverlay(activeItem) : null}</DragOverlay>
            ) : null}
        </DndContext>
    );
}
