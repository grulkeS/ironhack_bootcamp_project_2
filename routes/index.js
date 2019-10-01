const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user.js');




/* GET home page */
router.get('/', (req, res, next) => {
  console.log("index slash get 11");
  res.render('index');
});

/* GET search page */
router.get('/search', isLoggedIn, (req, res, next) => {
  console.log("search slash get 17")
  res.render('search');
});

/* POST search page */
router.post('/search', isLoggedIn, (req, res, next) => {
  console.log("index slash post 23")
  //let org_entity_id_type = req.body.org_entity_id_type;
  //let org_entity_ids = req.body.org_entity_ids;
  //let warehouse_glns = req.body.warehouse_glns;
  //let storage_locations = req.body.storage_locations;
  //let stock_types = req.body.stock_types;
  //let product_mdng_ids = req.body.product_mdng_ids;
  //let product_sap_ids = req.body.product_sap_ids;
  let queryObject = {};
  queryObject["org_entity_id_type"] = req.body.org_entity_id_type;
  queryObject["org_entity_ids"] = req.body.org_entity_ids;
  queryObject["warehouse_glns"] = req.body.warehouse_glns;
  queryObject["storage_locations"] = req.body.storage_locations;
  queryObject["stock_types"] = req.body.stock_types;
  queryObject["product_mdng_ids"] = req.body.product_mdng_ids;
  queryObject["product_sap_ids"] = req.body.product_sap_ids;

  for (let prop in queryObject) {
    if (queryObject[prop] === "") {
      delete queryObject[prop];
    }
  };
  console.log(queryObject);
  console.log('------------ ', queryObject.org_entity_ids); // [ '4901', 'M860'] 

  //?org_entity_id_type=${org_entity_id_type}&org_entity_ids=${org_entity_ids}&storage_locations=${storage_locations}
  axios.get(`${process.env.API_BASE_PATH}`,
    {
      params: queryObject,
      auth: {
        username: `${process.env.API_USER}`,
        password: `${process.env.API_PASS}`
      }
    }
  )
    .then(list => {
      console.log('######## ', list.data);

      list.data.forEach(element => { element.quantity = parseInt(element.quantity) });


      res.render('search', { entries: list.data });
    })
    .catch(err => {
      console.log('Error while requesting the API: ', err);
    })
});

router.get('/manageusers', isLoggedIn, (req, res, next) => {
  User.find()
    .then(users => {
      console.log(users);
      if (users !== null) {
        console.log("manageusers 80 indexjs")
        res.render('user-admin', users);

      } else {
        console.log("keine user gefunden 74")
        res.render("index", {
          errorMessage: "no users found"
        });
        return;
      }

    })
});
// this is the function we use to make sure the route and the functionality is 
// available only if we have user in the session
function isLoggedIn(req, res, next) {
  if (req.session.currentUser && req.session.currentUser.role === "authorized" || req.session.currentUser && req.session.currentUser.role === "administrator") {
    console.log(req.session.currentUser);
    next();
  } else {
    res.redirect('/');
  }

}

module.exports = router;
