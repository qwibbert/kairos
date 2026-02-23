export class Logger {
	static debug(message: string): void {
		const timestamp = new Date().toISOString();

		console.debug(
			'\x1b[3m\x1b[1m' + `[DEBUG][${timestamp}]` + '\x1b[0m\x1b[3m' + ` ${message}` + '\x1b[0m',
		);
	}

	static info(message: string): void {
		const timestamp = new Date().toISOString();
		console.info(
			'\x1b[104m\x1b[97m\x1b[1m' + `[INFO][${timestamp}]` + '\x1b[0m' + ` ${message}` + '\x1b[0m',
		);
	}

	static warning(message: string): void {
		const timestamp = new Date().toISOString();
		console.warn(
			'\x1b[43m\x1b[97m\x1b[1m' + `[WARNING][${timestamp}]` + '\x1b[0m' + ` ${message}` + '\x1b[0m',
		);
	}

	static error(message: string): void {
		const timestamp = new Date().toISOString();

		console.error(
			'\x1b[41m\x1b[97m\x1b[1m' + `[ERROR][${timestamp}]` + '\x1b[0m' + ` ${message}` + '\x1b[0m',
		);
	}
}
