module.exports = {
  init(app){
    const staticRoutes = require("../routes/static");
    const userRoutes = require("../routes/users");
    const wikiRoutes = require("../routes/wikis");
    const collaboratorRoutes = require("../routes/collaborators");

    if(process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    };
    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(wikiRoutes);
    app.use(collaboratorRoutes);
  }
}
