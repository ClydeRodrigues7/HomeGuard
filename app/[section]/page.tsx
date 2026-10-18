import HomeGuard from '@/components/homeguard';
export default async function SectionPage({params}:{params:Promise<{section:string}>}){const {section}=await params;return <HomeGuard section={section}/>}
