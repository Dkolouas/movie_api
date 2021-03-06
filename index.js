const express = require('express');
const app = express();

const morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');

let allowedOrigins = ['http://localhost:1234', 'http://testsite.com'];
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');
Models = require('./models.js');
Movies = Models.Movie;
Users = Models.User;

const { check, validationResult } = require('express-validator');

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_URI || 'mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

// Log  request  in terminal using Morgan
app.use(morgan('common'));

//welcome
app.get('/', (req, res) => {
  res.send('Welcome to the myMovies App!');
});

const handleError = (error, res) => {
  res.status(500).send('Error: ' + error);
};

// Read All movies
app.get('/movies', function (req, res) {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      handleError = (error, res);
    });
});

// Read specific movie
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send('Movie not found');
      };
    })
    .catch((error) => {
      handleError = (error, res);
    });
});

// read genre
app.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Genre);
      } else {
        res.status(404).send('Genre not found');
      };
    })
    .catch((error) => {
      handleError = (error, res);
    });
});

// read data of director
app.get('/movies/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Director);
      } else {
        res.status(404).send('Director not found');
      };
    })
    .catch((error) => {
      handleError = (error, res);
    });
});

// Create user
/* We???ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(404).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              handleError = (error, res);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        handleError = (error, res);
      });
  });

// Read all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      handleError = (error, res);
    });
});

// Read specific user
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).send('User with the username ' + req.params.Username + ' was not found');
      };
    })
    .catch((error) => {
      console.error(err);
      handleError = (error, res);
    });
});

// Update user
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser)
    })
    .catch((err) => {
      console.error(err);
      handleError = (error, res);
    });
});

// Create , add movie to users favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(error);
      handleError = (error, res);
    });
});

// Delete movie from favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(error);
      handleError = (error, res);
    });
});

// Delete user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (user) {
        res.status(200).send('User with the Username ' + req.params.Username + ' was successfully deleted.');
      } else {
        res.status(404).send('User with the Username ' + req.params.Username + ' was not found.');
      };
    })
    .catch((err) => {
      console.error(error);
      handleError = (error, res);
    });
});

app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen to port 8000
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on Port ' + port);
});
// app.listen(process.env.PORT || 3000, function () {
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });