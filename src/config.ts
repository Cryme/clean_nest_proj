import { config as loadConfig } from "dotenv";
import { isNil, trim } from "ramda";

type AllowedTypes = "string" | "integer" | "float" | "boolean";

const configKeys: {
	property: string;
	type: AllowedTypes;
	array: boolean;
}[] = [];

function RequiredString(): <K extends PropertyKey>(
	t: Record<K, string>,
	p: K,
) => void {
	return <K extends PropertyKey>(
		target: Record<K, string>,
		propertyKey: K,
	) => {
		configKeys.push({
			property: propertyKey.toString(),
			type: "string",
			array: false,
		});
	};
}

function RequiredBoolean(): <K extends PropertyKey>(
	t: Record<K, boolean>,
	p: K,
) => void {
	return <K extends PropertyKey>(
		target: Record<K, boolean>,
		propertyKey: K,
	) => {
		configKeys.push({
			property: propertyKey.toString(),
			type: "boolean",
			array: false,
		});
	};
}

function RequiredFloat(): <K extends PropertyKey>(
	t: Record<K, number>,
	p: K,
) => void {
	return <K extends PropertyKey>(
		target: Record<K, number>,
		propertyKey: K,
	) => {
		configKeys.push({
			property: propertyKey.toString(),
			type: "float",
			array: false,
		});
	};
}

function RequiredInteger(): <K extends PropertyKey>(
	t: Record<K, number>,
	p: K,
) => void {
	return <K extends PropertyKey>(
		target: Record<K, number>,
		propertyKey: K,
	) => {
		configKeys.push({
			property: propertyKey.toString(),
			type: "integer",
			array: false,
		});
	};
}

function Optional<V>(
	defaultValue: V,
): <K extends PropertyKey>(t: Record<K, V>, p: K) => void {
	return <K extends PropertyKey>(target: Record<K, V>, propertyKey: K) => {
		let type;

		switch (typeof defaultValue) {
			case "boolean":
				type = "boolean";
				break;
			case "number":
				type = "float";
				break;
			case "string":
				type = "string";
				break;
			default:
				throw new Error(`Unsupported type ${typeof defaultValue}`);
		}

		configKeys.push({
			property: propertyKey.toString(),
			type,
			array: false,
		});

		target[propertyKey] = defaultValue;
	};
}

function OptionalArray<V>(
	elementType: AllowedTypes,
	defaultValue: V[],
): <K extends PropertyKey>(t: Record<K, V[]>, p: K) => void {
	return <K extends PropertyKey>(target: Record<K, V[]>, propertyKey: K) => {
		configKeys.push({
			property: propertyKey.toString(),
			type: elementType,
			array: true,
		});

		target[propertyKey] = defaultValue;
	};
}

function RequiredArray<V>(
	elementType: AllowedTypes,
): <K extends PropertyKey>(t: Record<K, V>, p: K) => void {
	return <K extends PropertyKey>(target: Record<K, V>, propertyKey: K) => {
		configKeys.push({
			property: propertyKey.toString(),
			type: elementType,
			array: true,
		});
	};
}

function parseItem(
	obj: object,
	type: AllowedTypes,
	property: string,
	env: string,
) {
	switch (type) {
		case "string":
			return env;
		case "boolean":
			if (env.toLowerCase() === "true") {
				return true;
			} else if (env.toLowerCase() === "false") {
				return false;
			} else {
				throw Error(
					`Environment property ${property} is boolean! Possible values: true or false`,
				);
			}
		case "float": {
			const val = Number.parseFloat(env);
			if (isNaN(val)) {
				throw Error(
					`Environment property ${property} is integer! Provide correct value!`,
				);
			}

			return val;
		}
		case "integer": {
			const val = Number.parseInt(env);
			if (isNaN(val)) {
				throw Error(
					`Environment property ${property} is integer! Provide correct value!`,
				);
			}

			return val;
		}
		default:
			throw Error(`Unhandled type ${typeof obj[property]}`);
	}
}

class Config {
	@RequiredString()
	DATABASE_URL: string;
	@RequiredString()
	JWT_SECRET: string;

	constructor() {
		loadConfig();

		for (const { type, property, array } of configKeys) {
			const env = process.env[property];

			if (isNil(env)) {
				if (this[property] === undefined) {
					throw Error(
						`Environment property ${property} is required!`,
					);
				}

				continue;
			}

			if (array) {
				this[property] = env
					.split(",")
					.map((v) => parseItem(this, type, property, trim(v)));
			} else {
				this[property] = parseItem(this, type, property, env);
			}
		}
	}
}

export const CONFIG: Config = new Config();
