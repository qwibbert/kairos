import type { TaskID, TaskStatus } from '$features/tasks/types';
import type { Pauses, PomoType, SessionStatus } from '$lib/session/types';
import Dexie, { Entity, type EntityTable } from 'dexie';
import type { SettingsKey, SettingType } from './settings';


export class Setting extends Entity<AppDB> {
  key!: SettingsKey;
  value!: SettingType;
}

export class Task extends Entity<AppDB> {
  id!: string;
  title!: string;
  session_aim!: number;
  status!: TaskStatus;
  parent_id?: string;
  created_at!: Date;
  updated_at?: Date;
  archived!: number;
}

export class HistoryEntry extends Entity<AppDB> {
  id!: string;
  date_finished!: Date | undefined;
  pauses!: Pauses[];
  time_aim!: number;
  time_real!: number;
  task_id!: TaskID | undefined;
  status!: SessionStatus;
  created_at!: Date;
  updated_at!: Date;
  pomo_type!: PomoType;
  cycle!: number;
  paused_at?: Date;
}

export default class AppDB extends Dexie {
  settings!: EntityTable<Setting, 'key'>;
  tasks!: EntityTable<Task, 'id'>;
  history!: EntityTable<HistoryEntry, 'id'>

  constructor() {
    super('KairosDB');
    this.version(1).stores({
      settings: 'key',
      tasks: 'id, status, created_at, updated_at, title, parent_id, archived',
      history: 'id, date_started, date_finished, time_aim, time_real, task_id, status, created_at, updated_at, pomo_type, cycle'
    });
    this.settings.mapToClass(Setting);
    this.tasks.mapToClass(Task);
    this.history.mapToClass(HistoryEntry);
  }
}