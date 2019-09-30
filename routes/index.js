const express = require('express');
const router = express.Router();
const axios = require('axios');


const path = 'http://stock-api-2839734554.feature.stock-api.d-p.io/v1/stocks';


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET search page */
router.get('/search', (req, res, next) => {
  res.render('search');
});

/* POST search page */
router.post('/search', (req, res, next) => {

 //let org_entity_id_type = req.body.org_entity_id_type;
 //let org_entity_ids = req.body.org_entity_ids;
 //let warehouse_glns = req.body.warehouse_glns;
 //let storage_locations = req.body.storage_locations;
 //let stock_types = req.body.stock_types;
 //let product_mdng_ids = req.body.product_mdng_ids;
 //let product_sap_ids = req.body.product_sap_ids;
  let queryObject ={};
  queryObject["org_entity_id_type"] = req.body.org_entity_id_type;
  queryObject["org_entity_ids"] = req.body.org_entity_ids;
  queryObject["warehouse_glns"] = req.body.warehouse_glns;
  queryObject["storage_locations"] = req.body.storage_locations;
  queryObject["stock_types"] = req.body.stock_types;
  queryObject["product_mdng_ids"] = req.body.product_mdng_ids;
  queryObject["product_sap_ids"] = req.body.product_sap_ids;
  
  for(let prop in queryObject){
    if(queryObject[prop]===""){
      delete queryObject[prop];
    }
  };
  console.log(queryObject);
  console.log('------------ ', queryObject.org_entity_ids); // [ '4901', 'M860'] 

  //?org_entity_id_type=${org_entity_id_type}&org_entity_ids=${org_entity_ids}&storage_locations=${storage_locations}
  axios.get(`${path}`,
    {params: queryObject,
      auth: {
        username: 'stock_user',
        password: 'stock_pass'
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


module.exports = router;
