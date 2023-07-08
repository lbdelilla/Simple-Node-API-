const fs = require('fs');
const http = require('http'); //core module first
const url = require('url');
const slugify = require('slugify'); //third party module second
const replaceTemplate = require('./modules/replaceTemplate.js'); // own module third

// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')

// Write to file synchronously
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written!')

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     console.log(data)
// })
// console.log('Reading file...')

//CALLBACK HELL

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥')

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       fs.writeFile('./text/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your file has been written 🤗')
//       })
//     })
//   })
// })
// console.log('Reading file...')

// SERVER
//Here we create a server and listen to incoming requests
// const server = http.createServer((req, res) => {
//   res.end('Hello from the server!')
// })
// //port, host(local host ip address)
// server.listen(8000, '127.0.0.1', () => {
//   console.log('Listening to requests on port 8000') //callback function to run when server starts listening
// })

// ROUTING

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
); // read data from file synchronously and store in variable
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
); // read data from file synchronously and store in variable
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
); // read data from file synchronously and store in variable

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); // read data from file synchronously and store in variable
const dataObj = JSON.parse(data); //convert data to object and store in variable
//We want to create a server that sends back different responses for different URLs

const slugs = dataObj.map((elem) => slugify(elem.productName, { lower: true })); //create an array of slugs from dataObj using the name of the product
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview page

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardHtml = dataObj
      .map((elem) => {
        //loop through dataObj and create a card for each element
        return replaceTemplate(tempCard, elem); // the function is imported from replaceTemplate.js
      })
      .join(''); //join all the cards together
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);

    //Product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    res.writeHead(200, { 'Content-type': 'text/html' });
    const output = replaceTesmplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data); //once the client makes a request, we send the data back to the client

    //Not found
  } else {
    res.writeHead(404, {
      //status code 404
      'Content-type': 'text/html',
      'my-own-header': 'hello-world', //always send headers before response
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000'); //callback function to run when server starts listening
});
