import  Version  from "../models/version.model.js";
import  User  from "../models/user.model.js";
import sequelizeService from "../services/sequelize.service.js";
import { Op, fn, col } from "sequelize";

const fetchUserContributions = async ({start, end}) => {

  const services = [sequelizeService];

  try {
    for (const service of services) {
      await service.init();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const contributingEmails = await User.findAll({
    attributes: ['email'],
    include: [      {
        model: Version, 
        as: 'version',
        attributes: [],
        where: {
          'created_at': {
              [Op.gte]: start,
              [Op.lte]: end ,
          },
        },
    }],
    raw: true,
  }).then((result) => result.map(({email}) => email));
    return [...new Set(contributingEmails)];
}

const run = async () => {
    console.log(`Running user contribution lookup for env ${process.env["NODE_ENV"]}...`);

    if (process.argv.length !== 4) {
      console.log('Usage: node script.js <start-date> <end-date>');
      console.log('Example: node script.js 2023-01-01 2023-12-31');
      process.exit(1);
    }

    const start = process.argv[2];
    const end = process.argv[3];

    const results = await fetchUserContributions({start, end});

    if (results.length > 0) {
        console.log(results);
    } else {
        console.log(`No user contributions found in [${start}, ${end}].`);
    }
}

run();
