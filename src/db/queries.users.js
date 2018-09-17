// #1: We require the User model and the bcrypt library.
const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
// #2: createUser takes an object with email, password, and  passwordConfirmation properties, and a callback.
  createUser(newUser, callback){

// #3: We use bcrypt to generate a salt (data to pass to hashing function) and pass that to the hashSync hashing function with the password to hash.
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// #4: We store the hashed password in the database when we create the  User object and return the user.
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      // const msg = {
      //   to: newUser.email,
      //   from: 'test@example.com',
      //   subject: 'Thanks for joining Blocipedia!',
      //   text: 'we are so glad you could join us',
      //   html: '<strong>start collaborating on wikis today!</strong>',
      // };
      // sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  }

}
