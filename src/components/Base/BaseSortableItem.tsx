import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { UniqueIdentifier } from '@dnd-kit/core';

type RenderArgs = {
    setNodeRef: (node: HTMLElement | null) => void;
    setActivatorNodeRef: (node: HTMLElement | null) => void;
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown>;
    style: React.CSSProperties;
    isDragging: boolean;
};

type Props = {
    id: UniqueIdentifier;
    children: (args: RenderArgs) => React.ReactNode;
};

export default function BaseSortableItem({ id, children }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        setActivatorNodeRef,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition ?? 'transform 200ms ease',
    };

    return children({
        setNodeRef,
        setActivatorNodeRef,
        attributes: attributes as unknown as Record<string, unknown>,
        listeners: listeners as unknown as Record<string, unknown>,
        style,
        isDragging,
    });
}
