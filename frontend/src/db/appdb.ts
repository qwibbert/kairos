// import type { VineID, VineStatus, VineType } from "$features/vines/types";
// import type { Pauses, PomoType, SessionStatus } from "$lib/session/types";
// import Dexie, { Entity, type EntityTable } from "dexie";
// import "dexie-observable";
// import "dexie-syncable";
// import { Theme } from "./settings.ts";

// export class Settings extends Entity<AppDB> {
//   pomo_time = 25 * 60;
//   short_break_time = 5 * 60;
//   long_break_time = 15 * 60;
//   ui_sounds = true;
//   timer_tick_sound = true;
//   timer_finish_sound = true;
//   ui_sounds_volume = 100;
//   timer_tick_sound_volume = 100;
//   timer_finish_sound_volume = 100;
//   theme_inactive = Theme.LIGHT;
//   theme_active = Theme.DARK;
// }

// export class Vine extends Entity<AppDB> {
//   id!: VineID;
//   position!: number;
//   type!: VineType;
//   title!: string;
//   status!: VineStatus;
//   parent_id!: VineID;
//   created_at!: Date;
//   updated_at?: Date;
//   archived!: number;
//   public!: number;

//   session_aim?: number;
//   course_title?: string;
//   course_id?: string;
//   course_code?: string;
//   course_weight?: number;
//   course_instructor?: string;
// }

// export class HistoryEntry extends Entity<AppDB> {
//   id!: string;
//   date_finished!: Date | undefined;
//   pauses!: Pauses[];
//   target_time!: number;
//   elapsed_time!: { [key: string]: number };
//   status!: SessionStatus;
//   created_at!: Date;
//   updated_at!: Date;
//   pomo_type!: PomoType;
//   cycle!: number;
//   paused_at?: Date;

//   vine_id!: VineID | undefined;

//   // Vine could be deleted by user, but we still want to preserve the title, type and the course (if applicable).
//   vine_title?: string;
//   vine_type?: VineType;
//   vine_course?: string;
// }

// export default class AppDB extends Dexie {
//   settings!: EntityTable<Settings, "id">;
//   vines!: EntityTable<Vine, "id">;
//   history!: EntityTable<HistoryEntry, "id">;

//   constructor() {
//     super("KairosDB");
//     this.version(1).stores({
//       settings: "id",
//       vines:
//         "$$id, status, created_at, updated_at, title, parent_id, archived, type, public, session_aim, position",
//       history:
//         "$$id, date_finished, vine_id, status, created_at, updated_at, pomo_type, cycle, vine_title, vine_type",
//     });

//     this.syncable.on("statusChanged", function (newStatus, url) {
//       console.log(
//         "Sync Status changed: " + Dexie.Syncable.StatusTexts[newStatus],
//       );
//     });
//     this.settings.mapToClass(Settings);
//     this.vines.mapToClass(Vine);
//     this.history.mapToClass(HistoryEntry);
//   }
// }
