const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;


router.post('/register', (req, res, next) => {
  const username = req.body.userNameToReg;
  const password = req.body.passwordToReg;
  if (username === "" || password === "") {
    res.render("index", {
      errorMessage: "Indicate a email and a password to sign up"
    });
    return;
  }
  User.findOne({ "name": username })
    .then(data => {
      if (data !== null) {
        res.render("index", {
          errorMessage: "The account with this " + username + " already exists!"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({ name: username, password: hashPass });
      newUser.save()
        .then((user) => {
          res.redirect('/');
        })
        .catch((err) => {
          res.redirect('/')
          console.log(err);
        })
    })
});
/*router.get('/', (req, res, next) => {
  console.log("authjs index slash get 44")
    res.render('index')
});*/
router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


  if (username === "" || password === "") {
    res.render("index", {
      errorMessage: "Please enter both, email and password to sign up."
    });
    return;
  }

  User.findOne({ "name": username })
    .then(user => {
      if (!user) {
        res.render("index", {
          errorMessage: `The account by this ` + username + ` doesn't exist.`
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        console.log(req.session.currentUser)
        if (req.session.currentUser.role === "authorized") {
          res.redirect("/search");
        } else if (req.session.currentUser.role === "administrator") {
          res.redirect("/manageusers");
        }
        else {
          console.log("Ich muss draussen bleiben")
          res.render("index", {
            errorMessage: "You do not have the right yet to proceed."
          });
        }
      } else {
        console.log("falsches Passwort")
        res.render("index", {
          errorMessage: "Incorrect password!"
        });
      }
    })
    .catch(error => {
      next(error);
    })
});

router.get(`/logout`, (req, res, next) => {  
  req.session.destroy((err) => {
    res.redirect(`/`);
  })
})

module.exports = router;