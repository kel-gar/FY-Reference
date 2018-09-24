const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    sequelize.sync({force: true}).then((res) => {

     Wiki.create({
       title: "JS Frameworks",
       body: "There is a lot of them",
       private: false
     })
      .then((wiki) => {
        this.wiki = wiki;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

    });

  });

  describe("GET /wikis", () => {

    it("should return a status code 200 and all wikis", (done) => {

      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Wikis");
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {

    it("should render a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });

  });

  describe("POST /wikis/create", () => {
  const options = {
    url: `${base}create`,
    form: {
      title: "blink-182 songs",
      body: "What's your favorite blink-182 song?"
    }
  };

  it("should create a new wiki and redirect", (done) => {

//#1
    request.post(options,

//#2
      (err, res, body) => {
        Wiki.findOne({where: {title: "blink-182 songs"}})
        .then((wiki) => {
          expect(res.statusCode).toBe(303);
          expect(wiki.title).toBe("blink-182 songs");
          expect(wiki.body).toBe("What's your favorite blink-182 song?");
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

describe("GET /wikis/:id", () => {

  it("should render a view with the selected wiki", (done) => {
    request.get(`${base}${this.wiki.id}`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("JS Frameworks");
      done();
    });
  });

});

describe("POST /wikis/:id/destroy", () => {

  it("should delete the wiki with the associated ID", (done) => {
    Wiki.all()
    .then((wikis) => {
      const wikiCountBeforeDelete = wikis.length;
      expect(wikiCountBeforeDelete).toBe(1);
      request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.all()
        .then((wikis) => {
          expect(err).toBeNull();
          expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
          done();
        })

      });
    });

  });

});

describe("GET /wikis/:id/edit", () => {

  it("should render a view with an edit wiki form", (done) => {
    request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("Edit Wiki");
      expect(body).toContain("JS Frameworks");
      done();
    });
  });

});

describe("POST /wikis/:id/update", () => {

  it("should update the wiki with the given values", (done) => {
     const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "JavaScript Frameworks",
          body: "There are a lot of them"
        }
      };
//#1
      request.post(options,
        (err, res, body) => {

        expect(err).toBeNull();
//#2
        Wiki.findOne({
          where: { id: this.wiki.id }
        })
        .then((wiki) => {
          expect(wiki.title).toBe("JavaScript Frameworks");
          done();
        });
      });
  });

});




});
