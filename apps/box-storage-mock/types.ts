
export enum AppView {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  INVENTORY = 'inventory',
  HOUSE = 'house',
  MANAGE_STRUCTURE = 'manage_structure',
  MANAGE_ITEMS = 'manage_items'
}

export interface Floor {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  floorId: string;
}

export interface Furniture {
  id: string;
  name: string;
  roomId: string;
}

export interface Box {
  id: string;
  name: string;
  furnitureId: string;
  description?: string;
  isPrivate: boolean;
  inMotion: boolean;
}

export interface StorageItem {
  id: string;
  name: string;
  location: string;
  locationId?: string; // ID of the parent (Box or Furniture)
  locationType?: 'furniture' | 'box';
  inMotion: boolean;
  lastChanged: string;
  owner: string;
  description?: string;
  isPrivate: boolean;
}

export interface ChangeLog {
  id: string;
  itemName: string;
  timestamp: string;
  user: string;
}

export interface HierarchyNode {
  id: string;
  name: string;
  type: 'house' | 'floor' | 'room' | 'furniture' | 'box' | 'item';
  children?: HierarchyNode[];
  inMotion?: boolean;
}
