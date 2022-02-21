const express = require("express"), // Load express framework
  bodyParser = require("body-parser"),
  morgan = require("morgan"), // import morgan middleware
  uuid = require("uuid");
const res = require("express/lib/response");

const app = express();
app.use(bodyParser.json());
//morgan function
app.use(morgan("common"));

let users = [
  {
    id: 1,
    name: "Jon",
    favoriteMovies: ["Inglourious Basterds"],
  },
  {
    id: 2,
    name: "Kate",
    favoriteMovies: [],
  },
];

let movies = [
  {
    "Title": "Inglourious Basterds",
    "Description":
      "In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same. In German-occupied France, young Jewish refugee Shosanna Dreyfus witnesses the slaughter of her family by Colonel Hans Landa",
    "Genre": {
      "Name": "Action",
    },
    "Director": {
      "Name": "Quentin Tarantino",
      "Bio":
        "Quentin Tarantino was born on March 27, in Knoxville, Tennessee. He is the only child of Connie McHugh, who is part Cherokee and part Irish, and actor Tony Tarantino, who left the family before Quentin was born. Moving to California at the age of 4, Tarantino developed his love for movies at an early age.",
      "Born": "1963",
    },
  },

  {
    "Title": "The Matrix",
    "Description":
      "It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, which intelligent machines have created to distract humans while using their bodies as an energy source.",
    "Genre": {
      "Name": "Sci-Fi",
    },
    "Director": {
      "Name": "Lana Wachowski",
      "Bio":
        "Lana Wachowski He is an American film director, screenwriter and producer. Lana is a popular transgender woman and has been one of the best directors and writers for making a successful movie, “The Matrix” and her series and Critical hit movie “Bound” with his sister, Lilly Wachowski.",
      "Born": " 1965 ",
    },
  },

  {
    "Title": "The Godfather",
    "Description":
      "The Godfather is set in the 1940s and takes place entirely within the world of the Corleones, a fictional New York Mafia family. It opens inside the dark office of the family patriarch, Don Vito Corleone (also known as the Godfather and played by Brando), on the wedding day of his daughter, Connie (Talia Shire).",
    "Genre": {
      "Name": "Drama",
    },
    "Director": {
      "Name": " Francis Ford Coppola",
      "Bio":
        "Coppola was born on April 7, in Detroit, Michigan. Stricken with polio as a child, he was bedridden and found creative ways to entertain himself, including producing his own puppet shows. Coppola developed an interest in film early on and studied theater at Hofstra University in New York",
      "Born": " 1939",
    },
  },

  {
    "Title": "The Girl with the Dragon Tattoo",
    "Description":
      "Starring Daniel Craig as journalist Mikael Blomkvist and Rooney Mara as Lisbeth Salander, it tells the story of Blomkvist's investigation to find out what happened to a girl from a wealthy family who disappeared 40 years prior. He recruits the help of Salander, a computer hacker.",
    "Genre": {
      "Name": "Thriller",
    },
    "Director": {
      "Name": "David Fincher",
      "Bio":
        "David Fincher was born  in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley. He subsequently worked at ILM (Industrial Light and Magic) from 1981-1983.",
      "Born": "1962",
    },
  },
];

//app.get ('/', (req, res) => {
//  res.send ('Welcome to my Movies App!');
//});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Create user
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser) {
    newUser.id = uuid.v4();
    user.push(newUser);
    res.status(201).jason(newUser);
  } else {
    res.status(400).send("user need names");
  }
});

//Update user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updateUser.name;
    res.status(200).jason(user);
  } else {
    res.status(400).send("no such user");
  }
});

//Create movie
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send("$(movieTitle) has been added to user $(id)`s array");
  } else {
    res.status(400).send("no such user");
  }
});

//Delete movie
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send("$(movieTitle) has been removed from user $(id)`s array");
  } else {
    res.status(400).send("no such user");
  }
});

//Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send("users $(id) has been deleted");
  } else {
    res.status(400).send("no such user");
  }
});

//read all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//read all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

//read specific movie
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200), jason(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

//read specific genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200), jason(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

//read director
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200), jason(director);
  } else {
    res.status(400).send("no such director");
  }
});

//static file given access via express static
app.use(express.static("public"));

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen to port 8080
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
