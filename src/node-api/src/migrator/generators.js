export const constraintName = (c) => {
	if (c.type === "unique") {
		return `${c.key}`;
	}

	if (c.type === "check") {
		// Stub
	}

	if (c.type === "index") {
		return `${c.table}_pkey`;
	}

	if (c.type === "fk") {
		return `${c.table}_${c.key}_fkey`;
	}

	if (c.type === "multi-fk") {
		// STUB
	}
};
