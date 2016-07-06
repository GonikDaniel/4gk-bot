// https://github.com/mysqljs/mysql

/*=================================
=            Bootstrap            =
=================================*/

const mysql      = require('mysql');
const fetch      = require('node-fetch');
const fs         = require('fs');

const config     = require('./db.config.js');
const connection = mysql.createConnection(config);

connection.connect(e => {
  if (e) {
    console.log('error in DB connection');
    connection.end();
  }
});

/*=====  End of Bootstrap  ======*/


/*===================================
=            VK requests            =
===================================*/

// https://new.vk.com/questions_of_chgk
const groupId = 62655504;
const URL = `https://api.vk.com/method/wall.get?owner_id=-${groupId}&offset=1&count=10`;
// const headers = new Headers();

const options = { 
  method: 'GET',
  // headers: headers,
  cache: 'default'
};

const replacer = (key, value) => {
  const removeFields = /comments|reposts|attachments/i;
  if (removeFields.test(key)) {
    return undefined;
  }
  return value;
}

fetch(URL, options).then(res => {
  const contentType = res.headers.get('content-type');
  
  if(contentType && contentType.includes('application/json')) {
    return res.json().then(json => {
      fs.writeFile("./test.json", JSON.stringify(json, replacer, 2), err =>
        err ? console.log(err) : console.log("The file was saved!")
      );
    });
  } else {
    console.log('Oops, we haven\'t got JSON!');
  }
});

/*=====  End of VK requests  ======*/



/*===============================
=            Queries            =
===============================*/

const question  = { question: 'Hello MySQL', answer: 'Test' };

// const query = connection.query(
//   'INSERT INTO questions SET ?',
//   question,
//   (e, result) => {
//     console.log('Result: ', result);
//     console.log('Error: ', e);
//   }
// );
// console.log(query.sql); // INSERT INTO questions SET `id` = int (AUTO INCREMENT), `question` = 'Hello MySQL'

/*=====  End of Queries  ======*/


connection.end();
