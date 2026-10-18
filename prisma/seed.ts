import { PrismaClient, Role, Severity, FindingStatus, DeviceStatus } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
 const user=await prisma.user.upsert({where:{email:'alex@example.com'},update:{},create:{email:'alex@example.com',name:'Alex Morgan'}});
 let org=await prisma.organization.findFirst({where:{name:'Morgan Household'}});if(!org)org=await prisma.organization.create({data:{name:'Morgan Household'}});
 await prisma.membership.upsert({where:{organizationId_userId:{organizationId:org.id,userId:user.id}},update:{role:Role.OWNER},create:{organizationId:org.id,userId:user.id,role:Role.OWNER}});
 let property=await prisma.property.findFirst({where:{organizationId:org.id,name:'Home network'}});if(!property)property=await prisma.property.create({data:{organizationId:org.id,name:'Home network'}});
 let network=await prisma.network.findFirst({where:{propertyId:property.id,name:'Primary LAN'}});if(!network)network=await prisma.network.create({data:{propertyId:property.id,name:'Primary LAN'}});
 const rows=[['HomeGuard Gateway','router','192.168.1.1','A4:5E:60:2B:91:10','Ubiquiti',DeviceStatus.ONLINE],['Living Room Camera','camera','192.168.1.24','B8:27:EB:44:09:31','Eufy',DeviceStatus.ONLINE],['Alex MacBook Pro','computer','192.168.1.18','7C:2A:31:C8:11:4F','Apple',DeviceStatus.ONLINE],['Samsung Frame TV','smart-tv','192.168.1.32','F0:2F:74:8D:AA:02','Samsung',DeviceStatus.ONLINE],['Unknown device · 7B:91','unknown','192.168.1.47','34:98:7A:10:7B:91','Unknown',DeviceStatus.ONLINE],['Nest Thermostat','iot','192.168.1.55','18:B4:30:0F:62:81','Google',DeviceStatus.OFFLINE]] as const;
 for(const [name,category,ipAddress,macAddress,vendor,status] of rows)await prisma.device.upsert({where:{networkId_macAddress:{networkId:network.id,macAddress}},update:{},create:{networkId:network.id,name,category,ipAddress,macAddress,vendor,status}});
 const unknown=await prisma.device.findFirst({where:{networkId:network.id,name:'Unknown device · 7B:91'}});
 await prisma.securityFinding.upsert({where:{id:'11111111-1111-4111-8111-111111111111'},update:{},create:{id:'11111111-1111-4111-8111-111111111111',propertyId:property.id,deviceId:unknown?.id,title:'New device needs identification',category:'Device identity',severity:Severity.HIGH,evidence:'First observed on the network today. Vendor could not be identified from available metadata.',confidence:'unverified',remediation:'Confirm whether this is a device you own. Unknown identity is not evidence of malicious activity.',status:FindingStatus.OPEN}});
 await prisma.integration.upsert({where:{propertyId_provider:{propertyId:property.id,provider:'sample-data'}},update:{},create:{propertyId:property.id,provider:'sample-data',status:'connected',capabilities:{mode:'illustrative'}}});
 console.log(`Seeded sample household ${org.id} with property ${property.id}.`);
}
main().finally(()=>prisma.$disconnect());


