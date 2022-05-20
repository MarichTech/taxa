
const express = require("express");

const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');

const indexRouter = require('./router/index');



const app = express();

const server = require("http").Server(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 12;

app.use(session({
  secret: 'Keykeyeeeeeeeeeee',
  saveUninitialized:true,
  cookie: { maxAge: oneDay},
  resave: false
  
}))

app.use(flash());

app.use('/', indexRouter);


server.listen(process.env.PORT || 3030);