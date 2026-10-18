'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';

export function DropdownMenu({
  label,
  icon,
  children,
  className = '',
  align = 'end',
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return <div className={`ui-dropdown ${className}`} ref={root}>
    <button type="button" className="ui-dropdown-trigger" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(value => !value)}>
      {icon}
    </button>
    {open && <div className={`ui-dropdown-content align-${align}`} role="menu" aria-label={label} onClick={event => {
      if ((event.target as HTMLElement).closest('[role="menuitem"]')) setOpen(false);
    }}>{children}</div>}
  </div>;
}

export function DropdownMenuItem({
  children,
  onClick,
  href,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  if (href) return <a role="menuitem" className={`ui-dropdown-item ${className}`} href={href}>{children}</a>;
  return <button type="button" role="menuitem" className={`ui-dropdown-item ${className}`} onClick={onClick}>{children}</button>;
}

export function DropdownMenuLabel({children}:{children:ReactNode}) {
  return <div className="ui-dropdown-label">{children}</div>;
}

export function DropdownMenuSeparator() {
  return <div className="ui-dropdown-separator" role="separator"/>;
}
