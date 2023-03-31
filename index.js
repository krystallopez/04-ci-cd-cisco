const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const { User } = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
  try {
    let username = req.body.username;
    let pw = req.body.password;
  
    await User.create({username, password: await bcrypt.hash(pw, 5)})
    res.send(`successfully created user ${username}`);
  } catch (error) {
    console.error(error);
  }
  
})
// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res, next) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
  
    let [user] = await User.findAll({
      where: {
        username: username
      }
    })
    
    let matchPw = await bcrypt.compare(password, user.password);
    if (!matchPw) {
      res.status(401).send('incorrect username or password');
      next();
    } else {
      res.send(`successfully logged in user ${username}`);

    }
  } catch (error) {
    console.error(error);
  }
})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
