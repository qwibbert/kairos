/* eslint-disable @typescript-eslint/no-explicit-any */
export function svelteDeepCopy<T>(obj: object, asObject: boolean): T {
	// Handle null, undefined and primitive types
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	// Handle Date objects
	if (obj instanceof Date) {
		return new Date(obj.getTime()) as any;
	}

	// Handle Array objects
	if (Array.isArray(obj)) {
		return obj.map((item) => svelteDeepCopy(item, asObject)) as any;
	}

	// Handle Map objects
	if (obj instanceof Map) {
		return new Map(
			Array.from(obj.entries()).map(([key, value]) => [key, svelteDeepCopy(value, asObject)]),
		) as any;
	}

	// Handle Set objects
	if (obj instanceof Set) {
		return new Set(Array.from(obj).map((value) => svelteDeepCopy(value, asObject))) as any;
	}

	// Handle Object literals and class instances
	let clone: any;
	const constructor = obj.constructor;
	if (!asObject && constructor && constructor.name && constructor.name !== 'Object') {
		if (constructor.length === 0) {
			clone = new constructor();
			Object.assign(clone, obj);
		} else {
			console.warn(
				'Cannot deep copy object with constructor with arguments. Using Object.assign instead.',
				constructor.name,
				constructor.length,
				constructor,
				obj,
			);
			clone = Object.assign({}, obj);
		}
	} else {
		clone = Object.assign({}, obj);
	}

	const prototype = Object.getPrototypeOf(obj);
	if (!prototype) {
		return clone;
	}

	for (const key of Object.getOwnPropertyNames(prototype)) {
		clone[key] = svelteDeepCopy(obj[key], asObject);
	}

	return clone;
}

export function svelteStringify(obj: any): string {
	return JSON.stringify(svelteDeepCopy(obj, true));
}
