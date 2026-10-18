'use client';
import { useEffect } from 'react';
import { Background, Controls, Handle, MiniMap, Position, ReactFlow, useEdgesState, useNodesState, type Edge, type Node, type NodeProps } from '@xyflow/react';
import { Activity, Camera, HelpCircle, Lightbulb, Monitor, Router, Smartphone, Wifi } from 'lucide-react';
import type { Device } from '@/lib/initial-data';
import '@xyflow/react/dist/style.css';

type DeviceNode = Node<{ device: Device; select: (device: Device) => void }, 'device'>;
type GroupNode = Node<{ label: string; count: number }, 'group'>;
type MapNode = DeviceNode | GroupNode;
const iconMap: Record<string, typeof Wifi> = { Router, Camera, Computer: Monitor, Phone: Smartphone, 'Smart TV': Monitor, IoT: Lightbulb, Unknown: HelpCircle };

function InventoryNode({ data }: NodeProps<DeviceNode>) {
  const device = data.device;
  const Icon = iconMap[device.category] || Activity;
  const gateway = device.category === 'Router';
  const color = device.risk === 'critical' || device.risk === 'high' ? '#f07870' : device.risk === 'medium' ? '#e9b55f' : '#46ddbc';
  return <div className="network-device-wrap"><Handle type="target" position={Position.Left} id="target"/><button onClick={() => data.select(device)} className="network-node" style={{ borderColor: gateway ? '#49dcb8' : `${color}70`, minWidth: 212 }}>
    <span className="network-node-icon"><Icon size={16}/></span><span className="network-node-copy"><b>{device.name}</b><small>{gateway ? 'GATEWAY' : device.category.toUpperCase()} · {device.ip}</small><small><i style={{ background: device.status === 'online' ? '#46ddbc' : '#87929a' }}/> {device.status} <em style={{ color }}> · {device.risk} risk</em></small></span>
  </button><Handle type="source" position={Position.Right} id="source"/></div>;
}
function CategoryGroup({ data }: NodeProps<GroupNode>) {
  return <div className="network-group"><div className="network-group-title"><span>{data.label}</span><small>{String(data.count).padStart(2, '0')} DEVICES</small></div></div>;
}
const nodeTypes = { device: InventoryNode, group: CategoryGroup };
const groupOrder = [
  { label: 'Cameras & sensors', categories: ['Camera'] },
  { label: 'Personal devices', categories: ['Computer', 'Phone'] },
  { label: 'Smart home', categories: ['Smart TV', 'IoT'] },
  { label: 'Unclassified', categories: ['Unknown'] },
];

export default function NetworkCanvas({ devices, gateway, onSelect }: { devices: Device[]; gateway?: Device; onSelect: (device: Device) => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<MapNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  useEffect(() => {
    const visible = devices.filter(device => device.id !== gateway?.id);
    const groups = groupOrder.map(group => ({ ...group, devices: visible.filter(device => group.categories.includes(device.category)) })).filter(group => group.devices.length);
    const groupedIds = new Set(groups.flatMap(group => group.devices.map(device => device.id)));
    const other = visible.filter(device => !groupedIds.has(device.id));
    if (other.length) groups.push({ label: 'Other devices', categories: [], devices: other });
    const gap = 22;
    let y = 28;
    const groupNodes: GroupNode[] = [];
    const childNodes: DeviceNode[] = [];
    for (const group of groups) {
      const height = 45 + group.devices.length * 78;
      const id = `group-${group.label.toLowerCase().replaceAll(' ', '-')}`;
      groupNodes.push({ id, type: 'group', position: { x: 410, y }, data: { label: group.label, count: group.devices.length }, style: { width: 284, height }, draggable: false, selectable: false });
      group.devices.forEach((device, index) => childNodes.push({ id: device.id, type: 'device', parentId: id, extent: 'parent', position: { x: 20, y: 40 + index * 78 }, data: { device, select: onSelect }, draggable: true }));
      y += height + gap;
    }
    const totalHeight = Math.max(y - gap, 460);
    const gatewayNode: DeviceNode[] = gateway ? [{ id: gateway.id, type: 'device', position: { x: 40, y: Math.max((totalHeight - 90) / 2, 170) }, data: { device: gateway, select: onSelect }, draggable: true }] : [];
    setNodes([...groupNodes, ...gatewayNode, ...childNodes]);
    setEdges(gateway ? visible.filter(device => device.ip.split('.').slice(0, 3).join('.') === gateway.ip.split('.').slice(0, 3).join('.')).map(device => ({ id: `lan-${gateway.id}-${device.id}`, source: gateway.id, sourceHandle: 'source', target: device.id, targetHandle: 'target', type: 'smoothstep', label: 'LAN association', labelStyle: { fontSize: 9, fill: '#75ac9c' }, labelBgStyle: { fill: '#101918', fillOpacity: .96 }, labelBgPadding: [5, 3] as [number, number], style: { stroke: '#42c9a8', strokeWidth: 1.5, strokeDasharray: '5 4' }, animated: false, selectable: false })) : []);
  }, [devices, gateway, onSelect, setNodes, setEdges]);

  if (!gateway && devices.length === 0) return <div className="empty network-empty">No devices are available. Refresh the inventory or connect a monitoring agent.</div>;
  return <><div className="network-legend"><span><i className="legend-router"/> Gateway</span><span><i className="legend-device"/> Device record</span><span><i className="legend-line"/> Same-subnet association</span><small>Dashed links are inferred from recorded IP subnet values; they do not show verified traffic or device-to-device communication.</small></div><div className="network-flow"><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView fitViewOptions={{ padding: .16 }} minZoom={.18} maxZoom={1.6} proOptions={{ hideAttribution: true }}><Background color="#24433d" gap={20}/><MiniMap pannable zoomable/><Controls showInteractive={false}/></ReactFlow></div><div className="network-footer"><span><b>{devices.length}</b> inventory records</span><span><b>{edges.length}</b> gateway associations</span><span>Drag device nodes · scroll to zoom · click a device for details</span></div></>;
}
