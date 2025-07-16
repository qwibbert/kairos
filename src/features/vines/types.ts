import type { Vine } from "../../db/appdb";

export type VineID = string;

export interface VineTreeItem extends Vine {
    children?: VineTreeItem[];
}

export enum VineStatus {
    Active = 'ACTIVE',
    InActive = 'INACTIVE',
}

export enum VineType {
    Course = 'COURSE',
    Task = 'TASK'
}