var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, (err) => {
  if (err) console.log(err);
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const discountsRouter = require('./routes/discounts');
const giftsRouter = require('./routes/gifts');
const citiesRouter = require('./routes/cities');
const slidesRouter = require('./routes/slides');
const subcategoriesRouter = require('./routes/subcategories');
const categoriesRouter = require('./routes/categories');

var app = express();
app.use(bodyParser.urlencoded({extended: true}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static('uploads'));

// CORS
app.use(cors());
app.options('*', cors());
// app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/discounts', discountsRouter);
app.use('/gifts', giftsRouter);
app.use('/cities', citiesRouter);
app.use('/slides', slidesRouter);
app.use('/subcategories', subcategoriesRouter);
app.use('/categories', categoriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
