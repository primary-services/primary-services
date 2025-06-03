import Municipality from "../models/municipality.model.js";
import Contact from "../models/contact.model.js";

let officeController = {
  // Route for the import from JSON. Probably should remove at some point
  create: async (req, res, next) => {
    let data = req.body;

    let municipality = await Municipality.findOne({
      where: {
        name: data.town,
      },
    });

    if (!municipality) {
      console.log("Couldn't find:", data.town, data);
      throw "Municipality Not Found";
    }

    await Promise.all(
      data.contacts.map((contact) => {
        return municipality.createContact(contact);
      }),
    );

    return res.status(200).json({ status: "Success" });
  },
};

export default officeController;
