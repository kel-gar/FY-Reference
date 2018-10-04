const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require('../policies/application');
const wikiQueries = require("../db/queries.wikis.js");

module.exports = {

  show(req, res, next) {
    wikiQueries.getWiki(req.params.wikiId, (err, result) => {
      wiki = result["wiki"];
      collaborators = result["collaborators"];

      if(err || wiki == null) {
          res.redirect(404, "/");
      } else {
          const authorized = new Authorizer(req.user, wiki, collaborators).edit();
          if(authorized){
              res.render("collaborators/show", {wiki, collaborators});
          } else {
              req.flash("notice", "You are not authorized to do that.");
              res.redirect(`/wikis/${req.params.wikiId}`)
          }
      }
    });
  },

  create(req, res, next) {
    collaboratorQueries.createCollaborator(req, (err, collaborator) => {
      if(err) {
          req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  },

  delete(req, res, next) {
    if(req.user){
      collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
          if(err){
              req.flash("error", err);
          }
          res.redirect(req.headers.referer);
        });
    } else {
        req.flash("notice", "You must be signed in to do that");
        res.redirect(req.headers.referer);
    }
  }
}
