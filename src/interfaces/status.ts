export type Status = {
    id: string;
    name: string;
    description: string;
    color: string;
};

export type StatusCardProps = {
    status: Status;
    active?: boolean;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    editingId: string | null;
    onSaveEdit: (id: string, values: { name: string; description: string; color: string }) => void;
    onCancelEdit: () => void;
};

export type InlineFormProps = {
    initialValues: { name: string; description: string; color: string };
    onSave: (values: { name: string; description: string; color: string }) => void;
    onCancel: () => void;
};
