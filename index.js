const express = require('express');
const app = express();
const router = express.Router();

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
const path = require('path');

router.get('/home', (req,res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
  throw new Error('Intentional Error');
});

/*
- Return all details from user.json file to client as JSON format
*/
const fs = require('fs');

router.get('/profile', (req,res) => {
  const userFilePath = path.join(__dirname, 'user.json');
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
        return res.status(500).json({ error: 'Error reading user file' });
    }
    res.json(JSON.parse(data));
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
const bodyParser = require('body-parser');
app.use(bodyParser.json());

router.post('/login', (req,res) => {
  const {username, password } = req.body;
  
  const userFilePath = path.join(__dirname, 'user.json');
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading user file'});
    }

    const user = JSON.parse(data);

    // Check if username and password are valid
    if (username !== user.name) {
      return res.json({
          status: false,
          message: 'User Name is invalid'
      });
  }

  if (password !== user.password) { 
    return res.json({
        status: false,
        message: 'Password is invalid'
    });
  }

  // If both username and password are valid
  res.json({
    status: true,
    message: 'User Is valid'
  });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout/:username', (req,res) => {
  const {username} = req.params;

  // Create the logout message in HTML format
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Logout</title>
  </head>
  <body>
      <h1><b>${username} successfully logged out.</b></h1>
  </body>
  </html>
`;
  res.send(htmlContent);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err,req,res,next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));