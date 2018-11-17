const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express()
var maintenance = false;

hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear())
hbs.registerHelper('screamIt', (text) => text.toUpperCase())
app.set('view engine', 'hbs')

app.use((req, res, next) => {
  var now = new Date().toString()
  var log = `${now}: ${req.method} ${req.url}`

  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to append to server.log.')
    }
  })
  console.log(log)
  next()
})

app.use((req, res, next) => {
  if (maintenance) res.render('maintenance.hbs')
  next()
})

app.use(express.static(__dirname + '/client'))

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome mdfk!'
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  })
})

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
  })
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Wtf'
  })
})

app.listen(port, () => {
  console.log('Server is up on port:', port)
});
