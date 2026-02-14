
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
import { 
  Package, 
  Box as BoxIcon, 
  Sparkles, 
  ChevronRight, 
  Home, 
  ArrowLeft,
  Layers,
  DoorOpen,
  Armchair,
  Trash2,
  TreePine,
  MapPin
} from 'lucide-react';
import { MOCK_FLOORS, MOCK_ROOMS, MOCK_FURNITURE, MOCK_BOXES } from '../../constants';

export const ItemWizard: React.FC = () => {
  const [type, setType] = useState<'item' | 'box'>('item');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [inMotion, setInMotion] = useState(false);

  // Wizard State
  const [wizardLevel, setWizardLevel] = useState<number>(0); 
  const [selectedPath, setSelectedPath] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isWizardVisible, setIsWizardVisible] = useState(false);

  useEffect(() => {
    setSelectedPath([]);
    setWizardLevel(0);
    // Automatically show wizard for boxes, hide for items until triggered
    setIsWizardVisible(type === 'box');
  }, [type]);

  const getAvailableOptions = () => {
    switch (wizardLevel) {
      case 0: return MOCK_FLOORS;
      case 1: return MOCK_ROOMS.filter(r => r.floorId === selectedPath[0]?.id);
      case 2: return MOCK_FURNITURE.filter(m => m.roomId === selectedPath[1]?.id);
      case 3: return type === 'item' ? MOCK_BOXES.filter(b => b.furnitureId === selectedPath[2]?.id) : [];
      default: return [];
    }
  };

  const handleSelect = (option: any) => {
    const newPath = [...selectedPath.slice(0, wizardLevel), option];
    setSelectedPath(newPath);
    
    const maxLevel = type === 'item' ? 3 : 2;
    if (wizardLevel < maxLevel) {
      setWizardLevel(wizardLevel + 1);
    }
  };

  const resetToLevel = (level: number) => {
    setSelectedPath(selectedPath.slice(0, level));
    setWizardLevel(level);
  };

  const isSaveDisabled = () => {
    if (!title) return true;
    const minRequiredPathLength = type === 'item' ? 3 : 2; 
    if (selectedPath.length < minRequiredPathLength) return true;
    if (type === 'box' && selectedPath.some(p => p.id.startsWith('b'))) return true;
    return false;
  };

  const simulateAiSuggestion = async () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const floor = MOCK_FLOORS[Math.floor(Math.random() * MOCK_FLOORS.length)];
      const room = MOCK_ROOMS.find(r => r.floorId === floor.id) || MOCK_ROOMS[0];
      const furn = MOCK_FURNITURE.find(m => m.roomId === room.id) || MOCK_FURNITURE[0];
      
      const aiPath = [floor, room, furn];
      if (type === 'item') {
        const box = MOCK_BOXES.find(b => b.furnitureId === furn.id) || MOCK_BOXES[0];
        aiPath.push(box);
        setWizardLevel(3);
      } else {
        setWizardLevel(2);
      }
      setSelectedPath(aiPath);
      setIsAiLoading(false);
      setIsWizardVisible(true);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {type === 'item' ? 'Gegenstand' : 'Box'} erstellen
          </h1>
          <p className="text-slate-500 mt-1">Stammdaten und Standort definieren.</p>
        </div>
        <Button variant="ghost" onClick={() => window.history.back()} className="text-slate-500">
          <ArrowLeft className="mr-2" size={18} /> Zurück
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg">Stammdaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Typ</label>
                <div className="flex gap-3">
                  <Button 
                    variant={type === 'item' ? 'primary' : 'outline'} 
                    onClick={() => setType('item')}
                    className="flex-1 h-14"
                  >
                    <Package className="mr-2" size={20} /> Gegenstand
                  </Button>
                  <Button 
                    variant={type === 'box' ? 'primary' : 'outline'} 
                    onClick={() => setType('box')}
                    className="flex-1 h-14"
                  >
                    <BoxIcon className="mr-2" size={20} /> Box
                  </Button>
                </div>
              </div>

              <Input 
                label="Bezeichnung" 
                placeholder={type === 'item' ? "z.B. Akkuschrauber" : "z.B. Umzugskiste Keller"} 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg h-12"
              />
              
              <Textarea 
                label="Zusatzinformationen" 
                placeholder="Inhalt, Zustand..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="text-sm font-medium">Privat</span>
                  <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <span className="text-sm font-medium">In Bewegung</span>
                  <Switch checked={inMotion} onCheckedChange={setInMotion} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Gewählter Speicherort</label>
                <div className="flex items-center gap-2 p-4 bg-slate-100 border border-slate-200 rounded-xl">
                  <TreePine size={18} className="text-slate-400 shrink-0" />
                  <div className="flex items-center flex-wrap gap-1 text-sm font-medium text-slate-600">
                    {selectedPath.length === 0 ? (
                      <span className="text-slate-400 italic">Noch nichts gewählt...</span>
                    ) : (
                      selectedPath.map((node, i) => (
                        <React.Fragment key={node.id}>
                          {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">{node.name}</span>
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="danger" size="lg" className="flex-1 rounded-xl">
              Abbrechen
            </Button>
            <Button size="lg" className="flex-[2] rounded-xl font-bold shadow-lg shadow-blue-200" disabled={isSaveDisabled()}>
              Speichern
            </Button>
          </div>
        </div>

        {/* Right Column: Wizard & Suggestion */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Suggestion Card - Only for items */}
          {type === 'item' && (
            <Card className="bg-blue-600 border-none p-6 text-white shadow-xl shadow-blue-100 overflow-hidden relative">
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <Sparkles size={24} /> KI-Lagerort Vorschlag
                  </h3>
                  <p className="text-blue-100 text-sm">Vorschlag basierend auf deiner Haus-Struktur.</p>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-white text-blue-600 border-none hover:bg-slate-100 font-bold px-6 h-12"
                  onClick={simulateAiSuggestion}
                  disabled={isAiLoading || !title}
                >
                  {isAiLoading ? (
                    <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                  ) : "Ort vorschlagen"}
                </Button>
              </div>
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </Card>
          )}

          {/* Conditional Rendering of Wizard or Selection Trigger */}
          {isWizardVisible ? (
            <Card className="border-2 border-slate-200 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Hierarchischer Wizard</CardTitle>
                    <CardDescription>Navigiere zum Zielort</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => resetToLevel(0)} className="text-blue-600">
                    Neu starten
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* INTERACTIVE BREADCRUMBS */}
                <div className="flex items-center gap-1 p-4 bg-white border-b border-slate-100 overflow-x-auto">
                  <button 
                    onClick={() => resetToLevel(0)}
                    className={`p-2 rounded-md transition-colors ${wizardLevel === 0 ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100 text-slate-400'}`}
                  >
                    <Home size={18} />
                  </button>
                  {selectedPath.map((node, i) => (
                    <React.Fragment key={node.id}>
                      <ChevronRight size={14} className="text-slate-300 shrink-0" />
                      <button 
                        onClick={() => resetToLevel(i + 1)}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap border-2
                          ${wizardLevel === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}
                        `}
                      >
                        {node.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                <div className="p-8 min-h-[350px]">
                  <div className="mb-6">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {wizardLevel === 0 && "Etage wählen"}
                      {wizardLevel === 1 && "Raum wählen"}
                      {wizardLevel === 2 && "Möbelstück wählen"}
                      {wizardLevel === 3 && "Kiste wählen (Optional)"}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row flex-wrap gap-4">
                    {getAvailableOptions().map((opt: any) => (
                      <Button 
                        key={opt.id} 
                        variant="outline" 
                        className={`
                          flex-1 md:flex-none justify-start px-6 py-10 h-auto text-base rounded-2xl border-2 transition-all
                          ${selectedPath[wizardLevel]?.id === opt.id ? 'border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-50' : 'hover:border-slate-300'}
                        `}
                        onClick={() => handleSelect(opt)}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${selectedPath[wizardLevel]?.id === opt.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              {wizardLevel === 0 && <Layers size={20} />}
                              {wizardLevel === 1 && <DoorOpen size={20} />}
                              {wizardLevel === 2 && <Armchair size={20} />}
                              {wizardLevel === 3 && <BoxIcon size={20} />}
                            </div>
                            <span className="font-bold text-lg">{opt.name}</span>
                          </div>
                        </div>
                      </Button>
                    ))}
                    
                    {wizardLevel === 3 && type === 'item' && getAvailableOptions().length === 0 && (
                      <div className="w-full flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                          <Package size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-600 font-bold">Keine Boxen vorhanden</p>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">
                          Gegenstand wird direkt im Möbelstück "{selectedPath[2]?.name}" verzeichnet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl space-y-6 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <MapPin size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xl">Lagerort festlegen</h3>
                <p className="text-slate-500 max-w-sm">Wähle den Standort manuell aus der Hausstruktur.</p>
              </div>
              <Button 
                variant="outline" 
                className="h-12 px-8 font-semibold border-2 hover:bg-slate-50"
                onClick={() => setIsWizardVisible(true)}
              >
                Standort manuell wählen
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
