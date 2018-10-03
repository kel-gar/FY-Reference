const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;


describe("Collaborator", () => {

// #2: Before each test, we scope a user, topic, post, and comment to the test context.
  beforeEach((done) => {
    this.user;
    this.wiki;
    this.collaborator;

    sequelize.sync({force: true}).then((res) => {

// #3: We create test data we can use during test execution
      User.create({
        username: "starman",
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Expeditions to Alpha Centauri",
          body: "A compilation of reports from recent visits to the star system.",
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

// #4: We start a test suite for the `create` action
  describe("#create()", () => {

    it("should create a collaborator", (done) => {
      Collaborator.create({                // create a comment
        userId: this.user.id,
        wikiId: this.wiki.id
      })
      .then((collaborator) => {            // confirm it was created with the values passed
        // expect(collaborator.id).toBe(1);
        expect(collaborator.userId).toBe(this.user.id);
        expect(collaborator.wikiId).toBe(this.wiki.id);
        done();

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });


// #5: We test that comments with invalid attributes are not created
    it("should not create a Collaborator without a user or wiki id", (done) => {
      Collaborator.create({
        userId: this.user.id,
        // wikiId: this.wiki.id
      })
      .then((collaborator) => {
        done();

      })
      .catch((err) => {
        // expect(err.message).toContain("Collaborator.userId cannot be null");
        expect(err.message).toContain("Collaborator.wikiId cannot be null");
        done();

      })
    });

  });
    });
