const express = require('express');
const app = express();
const path = require('path');

const port = 8000;

// Serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// below code serve static HTML page on page website startups
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//below given code is for showing error generic page for unrelated URLs
app.use((req,res,next) => {
    res.status(404).send(`<h1>page url is not working</h1>${req.url}`);
});

//this is a startup message
app.listen(port, () => {
    console.log(`Server started at port number : ${port}`);
});