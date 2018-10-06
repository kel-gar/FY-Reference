const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

describe("routes : collaborators", () => {

  beforeEach((done) => {

    sequelize.sync({force: true}).then((res) => {

      User.create({
        username: "starGuy",
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Expeditions to Alpha Centauri",
          body: "Reports from recent visits to Alpha Centauri.",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          Collaborator.create({
            userId: this.user.id,
            wikiId: this.wiki.id
          })
          .then((collaborator) => {
            this.collaborator = collaborator;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /wikis/:wikiId/collaborators", () => {

    it("should render a view and with a form to see and add collaborators", (done) => {
      request.get(`${base}${this.wiki.id}/collaborators`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Alpha Centauri");
        done();
      });
    });

  });


  describe("POST /wikis/:wikiId/collaborators/create", () => {

    it("should add a new collaborator and redirect", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/collaborators/create`,
        form: {
          userId: this.user.id
        }
      };
      request.post(options,
        (err, res, body) => {
          Collaborator.findOne({where: {userId: this.user.id}})
          .then((collaborator) => {
            expect(collaborator).not.toBeNull();
            expect(collaborator.userId).toBe(this.user.id);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });
  });


});
