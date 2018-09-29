const userQueries = require("../db/queries.users.js");
// const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const publishableKey = process.env.PUBLISHABLE_KEY;
const secretKey = process.env.SECRET_KEY;
const stripe = require("stripe")(secretKey);

module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },

  create(req, res, next){
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {

        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up!");
          res.redirect("/");
        })
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  seeAccount(req, res, next){
    res.render("users/account");
  },
  seeUpgrade(req, res, next){
    res.render("users/upgrade");
  },
  pay(req, res, next){
    stripe.customers.create({
       email: req.body.stripeEmail,
       source: req.body.stripeToken
     })
     .then((customer) => {
       stripe.charges.create({
         amount: 1500,
         currency: "usd",
         customer: customer.id,
         // source: 'tok_visa',
         description: "Premium membership"
       })
     })
     .then((charge) => {
       userQueries.upgrade(req.user.dataValues.id);
       res.render("users/upgrade-success");
     })
  },
  seeUpgradeSuccess(req, res, next){
    res.render("users/upgrade-success");
  },
  downgrade(req, res, next){
    userQueries.downgrade(req.user.dataValues.id);
    req.flash("notice", "You've successfully downgraded your account!");
    res.redirect("/");
  }
}
