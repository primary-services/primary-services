let homeController = {
  // Route for the import from JSON. Probably should remove at some point
  welcome: async (req, res, next) => {
    return res.status(200).json({ status: "Welcome to the API" });
  },
};

export default homeController;
