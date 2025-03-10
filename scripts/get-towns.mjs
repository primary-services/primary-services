import fs from "fs";
import { townListScraper } from "../scrapers/town-list-scraper.mjs";

let towns = await townListScraper();

fs.writeFileSync(
	"./scraped-data/town-links.json",
	JSON.stringify(towns, null, 2),
);
