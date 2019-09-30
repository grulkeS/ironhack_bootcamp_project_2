const express = require('express');
const router  = express.Router();
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

  let org_entity_id_type = req.body.org_entity_id_type;
  let org_entity_ids     = req.body.org_entity_ids;
  let warehouse_glns     = req.body.warehouse_glns; 
  let storage_locations  = req.body.storage_locations;
  let stock_types        = req.body.stock_types;
  let product_mdng_ids   = req.body.product_mdng_ids; 
  let product_sap_ids    = req.body.product_sap_ids;

  console.log('------------ ', org_entity_ids); // [ 'SAP4901', 'M860'] 

axios.get(`${path}?org_entity_id_type=${org_entity_id_type}&org_entity_ids=${org_entity_ids}&storage_locations=${storage_locations}`,
{auth: {
  username: 'stock_user',
  password: 'stock_pass'
}}
)
.then(list => {
  console.log('######## ', list);
  res.render('search');
})
.catch(err => {
  console.log('Error while requesting the API: ', err);
})






  
});


module.exports = router;
