const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user.js');
const mongoose = require('mongoose');
const Outlet = require('../models/outlets');
let currentSelection = "";

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("index slash get 11");
  if(req.session.currentUser !== null){
    res.render('index', {session: req.session.currentUser});  
  }else{
  res.render('index');
}
});

/* GET search page */
router.get('/search', isLoggedIn, (req, res, next) => {
  console.log("search slash get 17")
  if(req.session.currentUser !== null){
  res.render('search', {session: req.session.currentUser});
  }else{
  res.render('search');
}
});
router.get('/selectMainCriteria', isLoggedIn, (req, res, next) => {
  if(req.session.currentUser !== null){
  res.redirect('/search');
  }else{
  res.redirect('/');
}
});

/* POST main search criteria */
router.post('/selectMainCriteria',(req, res, next) => {

Outlet.find()
.then(allOutlets => {
  let identifier = req.body.selectNow;
  currentSelection = req.body.selectNow;

if (identifier === 'mms_outlet_id') {

//filter sapNo oder outlet ID
/*let newList = Array.from(allOutlets);

newList.forEach((outlet, index) => {
  newList[index].ident=identifier;
})
console.log("in if",newList);
*/

const newList = allOutlets.map(outlet => {
  const res = {...outlet}._doc;
  res.ident = res.outletId;
  return res;
});
res.render('search', {outlets: newList, session: req.session.currentUser, searchCriteria: req.body.selectNow})
} else {
  const newList = allOutlets.map(outlet => {
    const res = {...outlet}._doc;
    res.ident = res.sapNo;
    return res;
  });
  res.render('search', {outlets: newList, session: req.session.currentUser, searchCriteria: req.body.selectNow})
}


  //res.render('search', {outlets: newList})
})
.catch(err => console.log('error: '.err))

});

/* POST search page */
router.post('/search', isLoggedIn, (req, res, next) => {
  console.log("index slash post 23")
  //User.findByIdAndUpdate(req.session.currentUser._id, {$set:{"search": []}})
  //.then((user) =>{
    //console.log(user);
  

  let queryObject = {};
  queryObject["org_entity_id_type"] = currentSelection; //req.body.org_entity_id_type;
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
  // console.log(queryObject);
  // console.log('------------ ', queryObject.org_entity_ids); // [ '4901', 'M860'] 

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
      //console.log(user, "test")
       // User.findByIdAndUpdate(req.session.currentUser._id, {$addToSet: {"search" : list.data}})
       // .then((user2) =>{
         // console.log(user2)
          //res.render('search', { entries: user2.search, searchCriteria: req.body.selectNow, session: req.session.currentUser });
          res.render('search', { entries: list.data, searchCriteria: req.body.selectNow, session: req.session.currentUser });
      //  })
      })
      .catch(err => {
      console.log('Error while requesting the API: ', err);
    })
 // })
});

router.get('/manageusers', isLoggedIn, (req, res, next) => {
  backURL=req.header('Referer') || '/';
  // do your thang
 
  User.find()
    .then(users => {
      console.log(users);
      if (users !== null && req.session.currentUser.role === "administrator") {
        console.log("manageusers 80 indexjs")
        res.render('user-admin', {users, session: req.session.currentUser});

      }else if(req.session.currentUser.role === "authorized") {
        
        res.redirect(backURL);
      }else {
        console.log("keine user gefunden 74")
        res.render("index", {
          errorMessage: "no users found", session: req.session.currentUser
        });
        return;
      }

    })
});

router.post('/savechanges/:userId', isLoggedIn, (req, res, next) => {
  console.log(req.body.role + "91 indexjs");
  User.findByIdAndUpdate(req.params.userId, {"role": req.body.role})
  .then(user => {
    res.redirect("/manageusers");
  })
  .catch(err => {
    console.log('Error while updating Role ', err);
  })
});

router.post('/delete/:userId', isLoggedIn, (req, res, next) => {
  console.log(req.body.role + "91 indexjs");
  User.findByIdAndRemove(req.params.userId)
  .then(user => {
    res.redirect("/manageusers");
  })
  .catch(err => {
    console.log('Error while deleting user ', err);
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
