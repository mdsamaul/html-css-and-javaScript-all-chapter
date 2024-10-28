const express = require('express');
const formidable = require('formidable');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.get('/', (req, res) =>
    res.sendFile(__dirname + '/chapter_13.html')
);

app.post('/', (req, res) => {
    const form = formidable();
    form.parse(req, (err, fields) => {
        if (err) {
            console.error('Error parsing the form:', err);
            res.sendStatus(400); // Bad Request
            return;
        }
        console.log('POST body:', fields);
        res.sendStatus(200);
    });
});

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);