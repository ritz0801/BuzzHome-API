import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'


import postRouter from './catolog/post/post.route'
import emailRouter from './catolog/email/email.route'

import Mailer from './utils/mailer'
// import usersRouter from './routes/users'

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3005', 'http://dev.buzzho.me', 'https://dev.buzzho.me' ], //Prevent all domain from sending request except this one
  credentials: true //Turn on cookie HTTP through CORS
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/post', postRouter);
app.post('/email/send-email', async (req, res) => {
  try {
    await Mailer(req, res)
    return res.status(200).json({ status: true, code: req.body.code })
  } catch (e) {
    return res.status(400).json({ status: false })
  }
});

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
