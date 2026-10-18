import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'HomeGuard — Smart Home Security', description: 'Know every device. Detect risks. Secure your home.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
