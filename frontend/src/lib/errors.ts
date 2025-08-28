export class ErrorBase<T extends string> extends Error {
	name: T;
	message: string;
	context?: {
		operation: string;
		entity_id?: string;
		timestamp: Date;
		additional_data?: Record<string, unknown>;
	};

	constructor({
		name,
		message,
		context,
	}: {
		name: T;
		message: string;
		context?: {
			operation: string;
			entity_id?: string;
			timestamp: Date;
			additional_data?: Record<string, unknown>;
		};
	}) {
		super();
		this.name = name;
		this.message = message;
		this.context = context;
	}
}
