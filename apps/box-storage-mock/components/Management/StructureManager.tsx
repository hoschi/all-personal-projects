
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Trash2, ChevronRight, Layers, DoorOpen, Info } from 'lucide-react';
import { Floor, Room, Furniture } from '../../types';
import { MOCK_FLOORS, MOCK_ROOMS, MOCK_FURNITURE } from '../../constants';

export const StructureManager: React.FC = () => {
  const [floors, setFloors] = useState<Floor[]>(MOCK_FLOORS);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [furniture, setFurniture] = useState<Furniture[]>(MOCK_FURNITURE);

  const [activeFloor, setActiveFloor] = useState<string | null>(null);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [activeFurniture, setActiveFurniture] = useState<string | null>(null);

  const [floorName, setFloorName] = useState('');
  
  // Room management states
  const [roomName, setRoomName] = useState('');
  const [roomWizardFloor, setRoomWizardFloor] = useState<string | null>(null);
  
  // Furniture management states
  const [furnitureName, setFurnitureName] = useState('');
  const [furnWizardFloor, setFurnWizardFloor] = useState<string | null>(null);
  const [furnWizardRoom, setFurnWizardRoom] = useState<string | null>(null);

  const handleFloorClick = (id: string) => {
    if (activeFloor === id) {
      setActiveFloor(null);
      setFloorName('');
    } else {
      setActiveFloor(id);
      const floor = floors.find(f => f.id === id);
      setFloorName(floor?.name || '');
    }
  };

  const handleRoomClick = (id: string) => {
    if (activeRoom === id) {
      setActiveRoom(null);
      setRoomName('');
      setRoomWizardFloor(null);
    } else {
      setActiveRoom(id);
      const room = rooms.find(r => r.id === id);
      setRoomName(room?.name || '');
      setRoomWizardFloor(room?.floorId || null);
    }
  };

  const handleFurnitureClick = (id: string) => {
    if (activeFurniture === id) {
      setActiveFurniture(null);
      setFurnitureName('');
      setFurnWizardFloor(null);
      setFurnWizardRoom(null);
    } else {
      setActiveFurniture(id);
      const piece = furniture.find(f => f.id === id);
      setFurnitureName(piece?.name || '');
      
      const room = rooms.find(r => r.id === piece?.roomId);
      setFurnWizardRoom(room?.id || null);
      setFurnWizardFloor(room?.floorId || null);
    }
  };

  const isFloorEmpty = (floorId: string) => !rooms.some(r => r.floorId === floorId);
  const isRoomEmpty = (roomId: string) => !furniture.some(f => f.roomId === roomId);

  const getPathBreadcrumb = (floorId: string | null, roomId: string | null = null) => {
    if (!floorId) return null;
    const fName = floors.find(f => f.id === floorId)?.name;
    const rName = roomId ? rooms.find(r => r.id === roomId)?.name : null;
    return (
      <div className="flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm animate-in fade-in zoom-in duration-300">
        <Layers size={14} className="text-blue-400" />
        <span>{fName}</span>
        {rName && (
          <>
            <ChevronRight size={14} className="text-blue-300" />
            <DoorOpen size={14} className="text-blue-400" />
            <span>{rName}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20 px-4 md:px-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Struktur-Verwaltung</h1>
        <p className="text-slate-500">Haus-Struktur hierarchisch bearbeiten.</p>
      </div>

      {/* 1. ETAGEN */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">1</div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Etagen</h2>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col md:flex-row flex-wrap gap-2">
              {floors.map(f => (
                <div key={f.id} className="flex items-center gap-0">
                  <Button 
                    variant={activeFloor === f.id ? 'primary' : 'outline'} 
                    className="rounded-r-none border-r-0 h-10 px-4"
                    onClick={() => handleFloorClick(f.id)}
                  >
                    {f.name}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-l-none text-red-500 hover:text-red-700 h-10 px-3"
                    disabled={!isFloorEmpty(f.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
              <div className="flex-1 w-full">
                <Input 
                  label="Name der Etage" 
                  placeholder="z.B. Erdgeschoss" 
                  value={floorName}
                  onChange={(e) => setFloorName(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Button className="shrink-0 h-10 px-8 font-bold" onClick={() => { setFloorName(''); setActiveFloor(null); }}>
                {activeFloor ? 'Update' : 'Hinzufügen'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 2. RÄUME */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">2</div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Räume</h2>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col md:flex-row flex-wrap gap-2">
              {rooms.map(r => (
                <div key={r.id} className="flex items-center gap-0">
                  <Button 
                    variant={activeRoom === r.id ? 'primary' : 'outline'} 
                    className="rounded-r-none border-r-0 h-10 px-4"
                    onClick={() => handleRoomClick(r.id)}
                  >
                    {r.name} ({floors.find(f => f.id === r.floorId)?.name})
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-l-none text-red-500 hover:text-red-700 h-10 px-3"
                    disabled={!isRoomEmpty(r.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
              <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Zugeordnete Etage</label>
                  {roomWizardFloor ? (
                    getPathBreadcrumb(roomWizardFloor)
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 italic">
                      <Info size={14} />
                      <span>Bitte Etage wählen...</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <Input 
                    label="Raumname" 
                    placeholder="z.B. Küche" 
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button 
                  className="h-10 px-8 font-bold" 
                  disabled={!roomWizardFloor || !roomName}
                  onClick={() => { setRoomName(''); setActiveRoom(null); setRoomWizardFloor(null); }}
                >
                  {activeRoom ? 'Update' : 'Hinzufügen'}
                </Button>
              </div>

              <div className="pt-2">
                <div className="flex flex-col md:flex-row flex-wrap gap-2">
                  {floors.map(f => (
                    <Button 
                      key={f.id} 
                      size="sm"
                      variant={roomWizardFloor === f.id ? 'primary' : 'outline'}
                      onClick={() => setRoomWizardFloor(f.id)}
                      className="h-9 px-4 flex-1 md:flex-none border-2"
                    >
                      {f.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. MÖBELSTÜCKE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">3</div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Möbelstücke</h2>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col md:flex-row flex-wrap gap-2">
              {furniture.map(f => (
                <div key={f.id} className="flex items-center gap-0">
                  <Button 
                    variant={activeFurniture === f.id ? 'primary' : 'outline'} 
                    className="rounded-r-none border-r-0 h-10 px-4"
                    onClick={() => handleFurnitureClick(f.id)}
                  >
                    {f.name}
                  </Button>
                  <Button variant="outline" className="rounded-l-none text-red-500 hover:text-red-700 h-10 px-3">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
              <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">Zugeordneter Raum</label>
                  {furnWizardRoom ? (
                    getPathBreadcrumb(furnWizardFloor, furnWizardRoom)
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 italic">
                      <Info size={14} />
                      <span>Bitte Etage & Raum wählen...</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <Input 
                    label="Bezeichnung" 
                    placeholder="z.B. Regal Billy" 
                    value={furnitureName}
                    onChange={(e) => setFurnitureName(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button 
                  className="h-10 px-8 font-bold" 
                  disabled={!furnWizardRoom || !furnitureName}
                  onClick={() => { setFurnitureName(''); setActiveFurniture(null); setFurnWizardFloor(null); setFurnWizardRoom(null); }}
                >
                  {activeFurniture ? 'Update' : 'Hinzufügen'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div>
                  <div className="flex flex-col md:flex-row flex-wrap gap-2">
                    {floors.map(f => (
                      <Button 
                        key={f.id} 
                        size="sm"
                        variant={furnWizardFloor === f.id ? 'primary' : 'outline'}
                        onClick={() => { setFurnWizardFloor(f.id); setFurnWizardRoom(null); }}
                        className="h-9 px-4 flex-1 md:flex-none border-2"
                      >
                        {f.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  {furnWizardFloor ? (
                    <div className="flex flex-col md:flex-row flex-wrap gap-2 animate-in slide-in-from-left-2 duration-200">
                      {rooms.filter(r => r.floorId === furnWizardFloor).map(r => (
                        <Button 
                          key={r.id} 
                          size="sm"
                          variant={furnWizardRoom === r.id ? 'primary' : 'outline'}
                          onClick={() => {
                            setFurnWizardRoom(r.id);
                            setFurnWizardFloor(r.floorId);
                          }}
                          className="h-9 px-4 flex-1 md:flex-none border-2"
                        >
                          {r.name}
                        </Button>
                      ))}
                      {rooms.filter(r => r.floorId === furnWizardFloor).length === 0 && (
                        <p className="text-xs text-slate-400 italic py-2">Keine Räume auf dieser Etage.</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border-2 border-dashed border-slate-200 text-center text-xs text-slate-400 italic">
                      Etage wählen für Räume
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
