
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/Card';
import { Switch } from './ui/Switch';
import { HOUSE_STRUCTURE } from '../constants';
import { HierarchyNode } from '../types';
import { 
  Building2, 
  Layers, 
  DoorOpen, 
  Armchair, 
  Box, 
  Package,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface TreeNodeProps {
  node: HierarchyNode;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = React.useState(level < 2);
  const [isInMotion, setIsInMotion] = React.useState(node.inMotion || false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'house': return <Building2 size={18} className="text-blue-600" />;
      case 'floor': return <Layers size={18} className="text-slate-500" />;
      case 'room': return <DoorOpen size={18} className="text-slate-500" />;
      case 'furniture': return <Armchair size={18} className="text-slate-500" />;
      case 'box': return <Box size={18} className="text-amber-600" />;
      case 'item': return <Package size={18} className="text-slate-400" />;
      default: return null;
    }
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors
          ${level === 0 ? 'bg-slate-50 font-semibold mb-1' : ''}
        `}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {hasChildren ? (
            isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />
          ) : (
            <div className="w-4" />
          )}
          {getIcon(node.type)}
          <span className="text-sm text-slate-700 truncate">{node.name}</span>
        </div>
        
        {node.type === 'item' && (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-slate-400">In Bewegung:</span>
            <Switch checked={isInMotion} onCheckedChange={setIsInMotion} />
          </div>
        )}
      </div>
      
      {hasChildren && isOpen && (
        <div className="mt-1">
          {node.children!.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const HouseHierarchy: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Haus-Ansicht</h1>
        <p className="text-sm text-slate-500">Exploriere die Hierarchie deiner Lagerorte.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Struktur-Browser</CardTitle>
          <CardDescription>Navigiere durch Etagen, Räume und Kisten.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-inner max-h-[600px] overflow-y-auto">
            <TreeNode node={HOUSE_STRUCTURE} level={0} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
