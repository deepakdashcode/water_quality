const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;


app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', (req, res) => {
    console.log(req.body);
    const resultText = `Received parameters: ${JSON.stringify(req.body)}`;
    
    res.json({ result: resultText });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
