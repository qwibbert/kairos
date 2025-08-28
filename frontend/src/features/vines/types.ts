import type { VinesDocument } from '../../db/vines/define';

export type VineID = string;

export interface VineTreeItem extends VinesDocument {
	children?: VineTreeItem[];
}

export enum VineStatus {
	Active = 'ACTIVE',
	InActive = 'INACTIVE',
}

export enum VineType {
	Course = 'COURSE',
	Task = 'TASK',
}
