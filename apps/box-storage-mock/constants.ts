
import { StorageItem, ChangeLog, HierarchyNode, Floor, Room, Furniture, Box } from './types';

export const MOCK_USER = {
  name: 'Admin User',
  initials: 'AU'
};

export const MOCK_FLOORS: Floor[] = [
  { id: 'f1', name: 'Erdgeschoss' },
  { id: 'f2', name: 'Keller' },
  { id: 'f3', name: 'Dachboden' }
];

export const MOCK_ROOMS: Room[] = [
  { id: 'r1', name: 'Wohnzimmer', floorId: 'f1' },
  { id: 'r2', name: 'Küche', floorId: 'f1' },
  { id: 'r3', name: 'Werkstatt', floorId: 'f2' },
  { id: 'r4', name: 'Vorratskeller', floorId: 'f2' }
];

export const MOCK_FURNITURE: Furniture[] = [
  { id: 'm1', name: 'Regal 1', roomId: 'r1' },
  { id: 'm2', name: 'Vorratskammer', roomId: 'r2' },
  { id: 'm3', name: 'Werkbank', roomId: 'r3' },
  { id: 'm4', name: 'Schwerlastregal', roomId: 'r4' }
];

export const MOCK_BOXES: Box[] = [
  { id: 'b1', name: 'Kiste Blau', furnitureId: 'm1', isPrivate: false, inMotion: false },
  { id: 'b2', name: 'Regalbrett 3', furnitureId: 'm2', isPrivate: false, inMotion: false },
  { id: 'b3', name: 'Metallbox', furnitureId: 'm3', isPrivate: true, inMotion: true }
];

export const MOCK_ITEMS: StorageItem[] = [
  { id: '1', name: 'Hammer', location: 'Keller > Werkstatt > Werkbank > Metallbox', locationId: 'b3', locationType: 'box', inMotion: true, lastChanged: '2023-10-24 10:30', owner: 'Self', isPrivate: true },
  { id: '2', name: 'Kaffeebohnen', location: 'Erdgeschoss > Küche > Vorratskammer > Regalbrett 3', locationId: 'b2', locationType: 'box', inMotion: false, lastChanged: '2023-10-24 09:15', owner: 'Self', isPrivate: false },
  { id: '3', name: 'Wintermantel', location: 'Dachboden > Ecke West > Box 4', locationId: 'box4_id', inMotion: true, lastChanged: '2023-10-23 18:20', owner: 'Self', isPrivate: false },
  { id: '4', name: 'Bohrmaschine', location: 'Garage > Werkbank > Schublade 1', locationId: 'm3', locationType: 'furniture', inMotion: false, lastChanged: '2023-10-23 15:40', owner: 'Michael', isPrivate: false },
];

export const MOCK_LOGS: ChangeLog[] = [
  { id: '1', itemName: 'Hammer', timestamp: 'vor 5 Min', user: 'Admin User' },
  { id: '2', itemName: 'Kaffeebohnen', timestamp: 'vor 20 Min', user: 'Admin User' },
];

export const HOUSE_STRUCTURE: HierarchyNode = {
  id: 'h1',
  name: 'Unser Haus',
  type: 'house',
  children: [
    {
      id: 'f1',
      name: 'Erdgeschoss',
      type: 'floor',
      children: [
        {
          id: 'r1',
          name: 'Wohnzimmer',
          type: 'room',
          children: [
            {
              id: 'm1',
              name: 'Regal 1',
              type: 'furniture',
              children: [
                {
                  id: 'b1',
                  name: 'Kiste Blau',
                  type: 'box',
                  children: [
                    { id: 'i1', name: 'Fernbedienung Ersatz', type: 'item', inMotion: false },
                    { id: 'i2', name: 'HDMI Kabel', type: 'item', inMotion: true },
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
