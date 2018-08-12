const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/users");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected');
  // we're connected!
});

let userSchema = new mongoose.Schema({
  name: String,
  email: String
 });

const User = mongoose.model("User", userSchema);

const registration = (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then(item => {
      console.log("item saved to database");
      res.send("item saved to database");
  })
  .catch(err => {
    res.status(400).send("unable to save to database");
    console.log("unable to save to database");
  });
 };

module.exports = registration;
