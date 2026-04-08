'use client';

import React from 'react';
import { Button, Tooltip } from '@heroui/react';
import type { ButtonRootProps } from '@heroui/react';
import { IconInnerShadowRight } from '@tabler/icons-react';

type BaseButtonProps = Omit<ButtonRootProps, 'onClick' | 'children'> & {
    label?: string;
    type?: 'button' | 'reset' | 'submit';
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
    startIcon?: React.ReactNode;
    startIconTooltip?: string;
    endIcon?: React.ReactNode;
    loader?: boolean;
    dataTest?: string;
    fullWidth?: boolean;
};

type HeroButtonProps = Omit<ButtonRootProps, 'onClick'> & {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const HeroButton = Button as React.ComponentType<
    HeroButtonProps & { ref?: React.Ref<HTMLButtonElement> }
>;

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    (
        {
            label,
            type = 'button',
            onClick,
            disabled = false,
            className = '',
            startIcon,
            startIconTooltip,
            endIcon,
            loader = false,
            children,
            dataTest,
            fullWidth = false,
            ...rest
        },
        ref
    ) => {
        const startIconNode = startIcon ? (
            startIconTooltip ? (
                <Tooltip>
                    <Tooltip.Trigger>
                        <span className="flex items-center">{startIcon}</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content placement="top">{startIconTooltip}</Tooltip.Content>
                </Tooltip>
            ) : (
                <span className="flex items-center">{startIcon}</span>
            )
        ) : null;

        return (
            <HeroButton
                ref={ref}
                type={type}
                onClick={onClick}
                isDisabled={disabled || loader}
                data-testid={dataTest}
                aria-busy={loader}
                {...rest}
                className={[
                    'inline-flex items-center justify-center',
                    'data-[hovered=true]:opacity-100',
                    'data-[pressed=true]:scale-100',
                    'data-[focus-visible=true]:outline-none',
                    fullWidth ? 'w-full' : '',
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {loader ? (
                    <IconInnerShadowRight className="animate-spin" />
                ) : (
                    <>
                        {startIconNode}
                        {label ?? children}
                        {endIcon && <span className="flex items-center">{endIcon}</span>}
                    </>
                )}
            </HeroButton>
        );
    }
);

BaseButton.displayName = 'BaseButton';

export default BaseButton;
