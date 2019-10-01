
require('dotenv').config();
const mongoose = require('mongoose');
const Outlet = require('../models/outlets');

const dbName = 'project2';
mongoose.connect(`mongodb:${process.env.HOST}/${dbName}`);

const outlets = [
{
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

/*Outlet.create(outlets, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${outlets.length} outlets.`)
  mongoose.connection.close();
});

*/

outlets.forEach(outlet => {

  Outlet.find(outlet)
  .then(result => console.log('Dich kenn ich scho!'))
  .catch(err => {
    console.log('Dich könnt ich neu anlegen, weil: ', err)

  })

});

mongoose.connection.close();



