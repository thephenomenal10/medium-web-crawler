const Pool = require('pg').Pool;
var pg = require('pg');


var conString = "postgres://rfegugol:i5dqFQE8FUO19VXuJlHbyxt8BO8rGHlc@ziggy.db.elephantsql.com:5432/rfegugol";
var pool = new pg.Client(conString);
pool.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    pool.query('SELECT NOW() AS "theTime"', function(err, result) {
      if (err) {
        return console.error('error running query', err);
      }
      // console.log(result.rows[0].theTime);
      // >> output: 2018-08-23T14:02:57.117Z
      //   pool.end();
    });
  });



// const pool = new Pool({
//     user: "postgres",
//     password: "Root#1234",
//     host: "localhost",
//     PORT: 5432,
//     database: "medium"
// }) 

module.exports = pool;