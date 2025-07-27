/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Auditlog = "auditlog",
	Courses = "courses",
	Hooks = "hooks",
	Institutions = "institutions",
	Passkeys = "passkeys",
	Posts = "posts",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type AuditlogRecord<Tdata = unknown, Toriginal = unknown> = {
	admin?: string
	collection: string
	created?: IsoDateString
	data?: null | Tdata
	event: string
	id: string
	original?: null | Toriginal
	record: string
	updated?: IsoDateString
	user?: RecordIdString
}

export type CoursesRecord = {
	course_code: string
	created?: IsoDateString
	id: string
	institution: RecordIdString
	instructor: string
	title: string
	updated?: IsoDateString
	weight: number
}

export enum HooksEventOptions {
	"insert" = "insert",
	"update" = "update",
	"delete" = "delete",
}

export enum HooksActionTypeOptions {
	"command" = "command",
	"email" = "email",
	"post" = "post",
}
export type HooksRecord = {
	action: string
	action_params?: string
	action_type: HooksActionTypeOptions
	collection: string
	created?: IsoDateString
	disabled?: boolean
	event: HooksEventOptions
	expands?: string
	id: string
	updated?: IsoDateString
}

export type InstitutionsRecord = {
	country: string
	created?: IsoDateString
	id: string
	name?: string
	updated?: IsoDateString
}

export type PasskeysRecord<Tcredentials = unknown> = {
	created?: IsoDateString
	credential_id: string
	credentials: null | Tcredentials
	id: string
	label?: string
	updated?: IsoDateString
	user: RecordIdString
}

export type PostsRecord = {
	body: string
	created?: IsoDateString
	files?: string[]
	id: string
	slug: string
	title: string
	updated?: IsoDateString
	user?: RecordIdString
}

export type UsersRecord<Tmetadata = unknown> = {
	avatar?: string
	created?: IsoDateString
	email?: string
	emailVisibility?: boolean
	id: string
	metadata?: null | Tmetadata
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AuditlogResponse<Tdata = unknown, Toriginal = unknown, Texpand = unknown> = Required<AuditlogRecord<Tdata, Toriginal>> & BaseSystemFields<Texpand>
export type CoursesResponse<Texpand = unknown> = Required<CoursesRecord> & BaseSystemFields<Texpand>
export type HooksResponse<Texpand = unknown> = Required<HooksRecord> & BaseSystemFields<Texpand>
export type InstitutionsResponse<Texpand = unknown> = Required<InstitutionsRecord> & BaseSystemFields<Texpand>
export type PasskeysResponse<Tcredentials = unknown, Texpand = unknown> = Required<PasskeysRecord<Tcredentials>> & BaseSystemFields<Texpand>
export type PostsResponse<Texpand = unknown> = Required<PostsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Tmetadata = unknown, Texpand = unknown> = Required<UsersRecord<Tmetadata>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	auditlog: AuditlogRecord
	courses: CoursesRecord
	hooks: HooksRecord
	institutions: InstitutionsRecord
	passkeys: PasskeysRecord
	posts: PostsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	auditlog: AuditlogResponse
	courses: CoursesResponse
	hooks: HooksResponse
	institutions: InstitutionsResponse
	passkeys: PasskeysResponse
	posts: PostsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'auditlog'): RecordService<AuditlogResponse>
	collection(idOrName: 'courses'): RecordService<CoursesResponse>
	collection(idOrName: 'hooks'): RecordService<HooksResponse>
	collection(idOrName: 'institutions'): RecordService<InstitutionsResponse>
	collection(idOrName: 'passkeys'): RecordService<PasskeysResponse>
	collection(idOrName: 'posts'): RecordService<PostsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
