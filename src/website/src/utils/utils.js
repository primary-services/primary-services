export const formatAddress = (address) => {
	let { address_line1, city, state_code } = address;

	if (address_line1 === `${city}, ${state_code}`) {
		return `${city}, ${state_code}`;
	} else {
		return `${address_line1}, ${city} ${state_code}`;
	}
};
