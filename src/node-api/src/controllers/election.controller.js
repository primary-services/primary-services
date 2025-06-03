import Municipality from "../models/municipality.model.js";
import Election from "../models/election.model.js";
import Term from "../models/term.model.js";

import Requirement from "../models/requirement.model.js";
import Deadline from "../models/deadline.model.js";
import Form from "../models/form.model.js";

let officeController = {
  save: async (req, res, next) => {
    let data = req.body;

    // Save the incoming election data
    let election = await Election.prototype.upsertAll(data);

    // Get the election's municipality
    let municipality = await Municipality.findByPk(election.municipality_id);

    console.log(municipality);
    // get arrays of the deadlines, forms, and requirements
    let deadlines = await election.getDeadlines();
    let forms = await election.getForms();
    let requirements = await election.getRequirements();

    // Add the requirements to the municipality, adding the deadline and
    // form to arrays above
    await Promise.all(
      requirements.map(async (r) => {
        let exists = await municipality.hasRequirement(r);
        if (!exists) {
          await municipality.addRequirement(r);
        }

        let deadline = await r.getDeadline();
        if (deadline !== null) {
          deadlines.push(deadline);
        }

        let form = await r.getForm();
        if (form !== null) {
          forms.push(form);
        }
      }),
    );

    // Add the deadlines to the municipality
    await Promise.all(
      deadlines.map(async (d) => {
        let exists = await municipality.hasDeadline(d);
        if (!exists) {
          await municipality.addDeadline(d);
        }
      }),
    );

    // Add the forms to the municipality
    await Promise.all(
      forms.map(async (f) => {
        let exists = await municipality.hasForm(f);
        console.log(f, exists);
        if (!exists) {
          await municipality.addForm(f);
        }
      }),
    );

    // Reload the election with all the associations
    const reloaded = await Election.findByPk(election.id, {
      include: [
        { model: Term, as: "terms" },
        {
          model: Requirement,
          as: "requirements",
          include: [
            { model: Deadline, as: "deadline" },
            { model: Form, as: "form" },
          ],
        },
        { model: Deadline, as: "deadlines" },
        { model: Form, as: "forms" },
      ],
    });

    return res.status(200).json(reloaded);
  },
};

export default officeController;
