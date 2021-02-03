const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const Film = require('./film');


const app = express();
app.use(express.json());
// one tutorial had - not sure what this line does or means
// app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use((req, res, next) => {
	// control which client servers have access
	res.header('Access-Control-Allow-Origin', '*');
	//  control which headers have access to the API
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorisation'
	);
	// method is a property that gives us access to the http method used on request
	// add all the request keywords we want to support with the API
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	// need to call next() so that the other routes can take over.
	next();
});


// connect to mongob change this to new mongo
const dbURI = 'mongodb+srv://netninja:netninjaautoenhance1@cluster0.lhtji.mongodb.net/Cluster0?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


// add a new wine.
app.post('/add-film', (req, res) => {
  var body = req.body
  const film = new Film({
    title: body.title,
    director: body.director,
    year: body.year,
    rating: body.rating
  });
  // save to the database
  film.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err);
    });
});

// endpoint call to return all films in directory
app.get('/all-films', (req, res) => {
  Film.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// return one film given an id
app.post('/single-film/:id', (req, res) => {
  // Can find using id
  var body = req.body
  Film.findById(body.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// // update, need to send to the console
app.put('/update-film/:id', (req, res) => {
  var body = req.body
  Film.updateOne(
    { id: body.id },
    {
      $set: body,
      $currentDate: { lastModified: true }
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
  });

// Delete by id

app.put('/remove-film/:id', (req, res) => {
  var body = req.body
  Film.deleteOne( { id: body.id } )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
  });

// Homepage
app.get('/', (req,res) => {
  const films = [
    {title: 'The Dark Knight', director: 'Christopher Nolan', year: '2008', rating: 9.0},
    {title: 'Avengers Endgame', director: 'The Russo Brothers', year: '2019', rating: 8.4},
    {title: 'Life is Beautiful', director: 'Roberto Benigni', year: '1999', rating: 8.6},
    {title: 'Fight Club', director: 'David Fincher', year: '1999', rating: 8.8}
  ];
});

app.use((req, res, next) => {
  const error = new Error('Not found sucker');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});
// PORT TO LISTEN ON
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
