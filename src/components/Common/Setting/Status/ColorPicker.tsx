import { useEffect, useRef, useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import BaseButton from '../../../Base/BaseButton';

const STATUS_COLORS = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#a855f7', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#64748b', // slate
];

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: Readonly<ColorPickerProps>) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <BaseButton
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="flex items-center cursor-pointer gap-2 h-[43px] px-3 border border-slate-200 rounded-[8px] bg-white hover:bg-gray-50 transition w-[60px]"
            >
                <span
                    className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                    style={{ backgroundColor: value }}
                />
                <IconChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </BaseButton>

            <div
                className={[
                    'absolute bottom-full left-0 mb-2 z-50',
                    'bg-white border border-slate-200 rounded-lg shadow-lg p-3',
                    'origin-bottom-left transition-all duration-150 ease-out',
                    'w-[60px]',
                    open
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 pointer-events-none translate-y-1 scale-95',
                ].join(' ')}
            >
                <div className="grid grid-cols-1 gap-2 place-items-center">
                    {STATUS_COLORS?.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => {
                                onChange(color);
                                setOpen(false);
                            }}
                            className="w-4 h-4 cursor-pointer rounded-full border-2 transition-transform duration-150 ease-out hover:scale-110"
                            style={{
                                backgroundColor: color,
                                borderColor: value === color ? '#1e293b' : 'transparent',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
