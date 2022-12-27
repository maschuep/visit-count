const express = require('express'); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
const sq = require('sequelize');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3005;
const name = 'astra-count';

const appNames = ['astra'];

let visit = setUpDb();

app.get('/', (req, res) => {
  res.send(JSON.stringify(req.headers));
});

app.get('/:app', (req, res) => {
  const app = req.params.app;
  const timestamp = Date.now();
  const useragent = req.headers['user-agent'];
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if(!ip.match(/[\.,\:]/gm)?.length){
    ip = -1;
  }
   if(!appNames.find(a => a === app)){
    res.send('none inserted');
    return;
  }

  visit.create({app, timestamp, ip, useragent}).then(resolved => res.send({inserted: true, resolved}) );
 
  
});


app.listen(port, () => {
  
  console.log(`Example app listening on port ${port}`)
});



function setUpDb(){
  let db = new sq.Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: true // can be set to true for debugging
        });
  const visits = db.define('visits', {
    app: sq.DataTypes.STRING,
    ip: sq.DataTypes.STRING,
    useragent: sq.DataTypes.STRING
  });
  db.sync();
  return visits;
}