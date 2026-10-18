import type {ButtonHTMLAttributes} from 'react';

type ButtonVariant = 'default' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'icon';

export function Button({
  className = '',
  variant = 'ghost',
  size = 'default',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {variant?: ButtonVariant; size?: ButtonSize}) {
  return <button type={type} className={`ui-button ui-button-${variant} ui-button-${size} ${className}`.trim()} {...props}/>;
}
