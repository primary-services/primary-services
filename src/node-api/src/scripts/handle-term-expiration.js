import  Term  from "../models/term.model.js";
import sequelizeService from "../services/sequelize.service.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

// Find all terms ending before or on given year 
// and create new terms for their seats (with null official_id) if they don't already exist. 
// This script should be run at the end of each year to prepare for the next year.
const handleTermExpiration = async (year) => {

  const services = [sequelizeService];

  try {
    for (const service of services) {
      await service.init();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  // Find all terms starting post-expiration year
  const futureTerms = await Term.findAll({
    where: {
        start_year: {
            [Op.gt]: year
        },
    }
  });

  // Get all seats with a term starting post-expiration year
  const seatsWithFutureTerms = futureTerms.map(term => term.dataValues.seat_id);

  // Find all terms that expired (e.g. end_date < current year) and don't have a following term(s)
  const terms = await Term.findAll({
    where: {
        end_year: {
            [Op.lte]: year
        },
        seat_id: {
            [Op.notIn]: seatsWithFutureTerms
        }
      },
    });

    const newTerms = terms.map((term) => {
        const duration = term.end_year - term.start_year;
        const newStart = term.end_year + 1;
        return { 
            start_year: newStart,
            end_year: newStart + duration,
            seat_id: term.seat_id
        }
    });

    await Term.bulkCreate(newTerms);

    return newTerms
}

const writeLog = (results) => {
    const __dirname = path.resolve();
    const logEntries = results.map((term) => JSON.stringify(term)).join("\n");
    fs.writeFileSync(__dirname + `/src/scripts/log/${new Date().toISOString()}-${process.env["NODE_ENV"]}-term-expiration-log.txt`, logEntries);
}

const run = async () => {
    console.log(`Running term expiration handler for env ${process.env["NODE_ENV"]}...`);

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const results = await handleTermExpiration(previousYear);

    if (results.length > 0) {
        console.log(`Created ${results.length} new terms for expired seats: See log for details.`);
        writeLog(results);
    } else {
        console.log(`No terms expired in ${previousYear}. No new terms created.`);
    }
}

run();