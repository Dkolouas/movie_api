// Load express framework
const express = require ('express');
morgan = require ('morgan'); // import morgan middleware

const app = express ();

let topMovies = [
  {
    title: 'Movie 1',
    author: 'Director 1',
  },
  {
    title: 'Movie 2',
    author: 'Director 2',
  },
  {
    title: 'Movie 3',
    author: 'Director 3',
  },
  {
    title: 'Movie 4',
    author: 'Director 4',
  },
  {
    title: 'Movie 5',
    author: 'Director 5',
  },
  {
    title: 'Movie 6',
    author: 'Director 6',
  },
  {
    title: 'Movie 7',
    author: 'Director 7',
  },
  {
    title: 'Movie 8',
    author: 'Director 8',
  },
  {
    title: 'Movie 9',
    author: 'Director 9',
  },
  {
    title: 'Movie 10',
    author: 'Director 10',
  },
];

//morgan function
app.use (morgan ('common'));

app.get ('/', (req, res) => {
  res.send ('Welcome to my Movies App!');
});

app.get ('/documentation', (req, res) => {
  res.sendFile ('public/documentation.html', {root: __dirname});
});

//static file given access via express static
app.use (express.static ('public'));

//topMovies array served
app.get ('/movies', (req, res) => {
  res.json (topMovies);
});

// error handling

app.use ((err, req, res, next) => {
  console.error (err.stack);
  res.status (500).send ('Something broke!');
});

// listen to port 8080
app.listen (8080, () => {
  console.log ('Your app is listening on port 8080.');
});
