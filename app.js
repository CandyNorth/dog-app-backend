const express = require('express');
const apiRouter = require("./routes/api-router");
const app = express();
//const cors = require('cors');

//app.use(cors());

app.use(express.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).json({ msg: err.msg });
    } else if (err.code === '22P02') {
        res.status(400).json({ msg: 'Bad request' });
    } else {
        console.log(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = app;