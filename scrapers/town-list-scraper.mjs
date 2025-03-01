import { load } from "./load.mjs";

export const townListScraper = async () => {
	const baseURL =
		"https://www.mass.gov/lists/massachusetts-city-and-town-websites";
	const $ = await load(baseURL);

	let towns = {};
	let parsed = $(".ma__form-downloads__links a");

	$(".ma__form-downloads__links a").map((index, link) => {
		towns[$(link).text().trim()] = {
			url: $(link).attr("href"),
			townClerk: {
				name: "",
				phone: "",
			},
			electedPositions: [],
		};
	});

	return towns;
};
