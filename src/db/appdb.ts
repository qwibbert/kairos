import type { VineID, VineStatus, VineType } from '$features/vines/types';
import type { Pauses, PomoType, SessionStatus } from '$lib/session/types';
import Dexie, { Entity, type EntityTable } from 'dexie';
import type { SettingsKey, SettingType } from './settings';


export class Setting extends Entity<AppDB> {
  key!: SettingsKey;
  value!: SettingType;
}

export class Vine extends Entity<AppDB> {
  id!: VineID;
  position!: number;
  type!: VineType;
  title!: string;
  session_aim?: number;
  status!: VineStatus;
  parent_id!: VineID;
  created_at!: Date;
  updated_at?: Date;
  archived!: number;
  public!: number;
}

export class HistoryEntry extends Entity<AppDB> {
  id!: string;
  date_finished!: Date | undefined;
  pauses!: Pauses[];
  target_time!: number;
  elapsed_time!: Map<string, number>;
  vine_id!: VineID | undefined;
  status!: SessionStatus;
  created_at!: Date;
  updated_at!: Date;
  pomo_type!: PomoType;
  cycle!: number;
  paused_at?: Date;
}

export default class AppDB extends Dexie {
  settings!: EntityTable<Setting, 'key'>;
  vines!: EntityTable<Vine, 'id'>;
  history!: EntityTable<HistoryEntry, 'id'>

  constructor() {
    super('KairosDB');
    this.version(1).stores({
      settings: 'key',
      vines: 'id, status, created_at, updated_at, title, parent_id, archived, type, public, session_aim, position',
      history: 'id, date_finished, time_aim, time_real, vine_id, status, created_at, updated_at, pomo_type, cycle'
    });
    this.settings.mapToClass(Setting);
    this.vines.mapToClass(Vine);
    this.history.mapToClass(HistoryEntry);
  }
}