
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/Card';
import { Badge } from './ui/Badge';
import { MOCK_ITEMS, MOCK_LOGS } from '../constants';
import { Activity, User, MoveRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const myItems = MOCK_ITEMS.filter(i => i.owner === 'Self' && i.inMotion);
  const otherItems = MOCK_ITEMS.filter(i => i.owner !== 'Self');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Willkommen zurück, hier ist eine Übersicht über dein System.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kachel 1: Meine Gegenstände */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Meine Gegenstände</CardTitle>
              <CardDescription>Aktuell "In Bewegung"</CardDescription>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <MoveRight size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.location.split(' > ').pop()}</p>
                  </div>
                  <Badge variant="blue">In Bewegung</Badge>
                </div>
              ))}
              {myItems.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">Keine Gegenstände in Bewegung.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kachel 2: Fremde Gegenstände */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Fremde Gegenstände</CardTitle>
              <CardDescription>Gegenstände anderer User</CardDescription>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <User size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {otherItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Besitzer: {item.owner}</p>
                  </div>
                  <Badge variant="outline">{item.inMotion ? 'In Bewegung' : 'Gelagert'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kachel 3: Zuletzt geändert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Zuletzt geändert</CardTitle>
              <CardDescription>Die letzten 10 Aktivitäten</CardDescription>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Activity size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_LOGS.slice(0, 10).map(log => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-900 leading-tight">
                      <span className="font-semibold">{log.user}</span> hat <span className="font-semibold">{log.itemName}</span> geändert.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
