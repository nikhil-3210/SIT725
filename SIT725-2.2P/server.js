const express = require('express');
const app = express();
const path = require('path');

const port = 8000;

// below code serve static HTML page on page website startups
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/add/:num1/:num2', (req,res,next) => {
    const { num1, num2 } = req.params;

    // Convert string inputs to numbers for addition
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    // Check if inputs are valid numbers and not negative numbers or string
    if (isNaN(number1) || isNaN(number2)) {
        return res.status(400).send('<h1>Invalid numbers provided</h1>');
    }
    
    // Calculate the sum
    const sum = number1 + number2;

    res.status(200).send(`<h1>The sum of ${number1} and ${number2} is ${sum}</h1>`);
});

//below given code is for showing error generic page for unrelated URLs
app.use((req,res,next) => {
    res.status(404).send(`<h1>page url is not working</h1>${req.url}`);
});

//this is a startup message
app.listen(port, () => {
    console.log(`Server started at port number : ${port}`);
});