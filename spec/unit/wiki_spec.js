const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

  beforeEach((done) => {
     this.wiki;
     this.user;

     sequelize.sync({force: true}).then((res) => {
       User.create({
         username: "starman",
         email: "starman@tesla.com",
         password: "Trekkie4lyfe"
       })
       .then((user) => {
         this.user = user; //store the user
         Wiki.create({
           title: "Expeditions to Alpha Centauri",
           body: "A compilation of reports from recent visits to the star system.",
           private: false,
           userId: this.user.id
         })
         .then((wiki) => {
           this.wiki = wiki; //store the wiki
           done();
         })
       })
     });
  });

  describe("#create()", () => {

     it("should create a wiki object with a title and body and user", (done) => {
       Wiki.create({
         title: "Journey around the world",
         body: "The coolest places to see",
         userId: this.user.id
       })
       .then((wiki) => {
         expect(wiki.title).toBe("Journey around the world");
         expect(wiki.body).toBe("The coolest places to see");
         done();
       })
       .catch((err) => {
         // console.log(err);
         done();
       });
     });

     it("should not create a wiki with missing title, or body", (done) => {
       Wiki.create({
         title: "Journey around the world"
       })
       .then((wiki) => {
         done();
       })
       .catch((err) => {
         expect(err.message).toContain("Wiki.body cannot be null");
         done();
       })
     });

   });

  describe("#setUser()", () => {

     it("should associate a wiki and a user together", (done) => {

       User.create({
         username: "marioBro",
         email: "marioBro@example.com",
         password: "password"
       })
       .then((newUser) => {

         expect(this.wiki.userId).toBe(this.user.id);

         this.wiki.setUser(newUser)
         .then((wiki) => {

           expect(this.wiki.userId).toBe(newUser.id);
           done();

         });
       })
     });

   });

   describe("#getUser()", () => {

     it("should return the associated user", (done) => {

       this.wiki.getUser()
       .then((associatedUser) => {
         expect(associatedUser.email).toBe("starman@tesla.com");
         done();
       });

     });

   });


});
