require('dotenv').config();
const mongoose = require('mongoose');
const Outlet = require('../models/outlets');

const outlets = [{
    sapNo: '4901',
    outletId: 0,
    name: 'Geis Germany',
    type: 'NDC',
    isoCountryCode: 'DE'
  },
  {
    sapNo: 'M860',
    outletId: 1125,
    name: 'DE - MM Online',
    type: 'OnlineStore',
    isoCountryCode: 'DE'
  },
  {
    sapNo: 'S802',
    outletId: 1015,
    name: 'DE - SE Online',
    type: 'OnlineStore',
    isoCountryCode: 'DE'
  },
  {
    sapNo: 'M001',
    outletId: 466,
    name: 'MEDIA MARKT Ingolstadt',
    type: 'Store',
    isoCountryCode: 'DE'
  },
  {
    sapNo: 'S001',
    outletId: 1,
    name: 'SATURN Hannover',
    type: 'Store',
    isoCountryCode: 'DE'
  }
]


outlets.forEach((outlet,index) => {

  Outlet.find(outlet)
    .then(result => {
      if (result.length === 0) {

        Outlet.create(outlet, (err) => {
          if (err) { throw(err) }
          console.log(`***** Has been missing, created the missing outlet: `, outlet)
          if (index === outlets.length-1) {
          }
        });
      
      } else {
        if (index === outlets.length-1) {
        }
        
      }

      
    })
    .catch(err => {
      console.log('####### Outlet lookup failed due to: ', err)

    })
    
});

