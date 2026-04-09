export type Status = {
    id: string;
    name: string;
    description?: string;
    color: string;
};

export type StatusData = {
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
    onSaveEdit: (id: string, values: StatusData) => void;
    onCancelEdit: () => void;
};

export type InlineFormProps = {
    initialValues: StatusData;
    onSave: (values: StatusData) => void;
    onCancel: () => void;
};
