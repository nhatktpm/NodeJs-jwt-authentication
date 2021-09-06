import express from 'express';
const app = express();
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

const boooks = [
    {
        id: 1,
        name: 'chi phep',
        author: 'abc'

    }, {
        id: 2,
        name: 'nam cao',
        author: 'sdf'
    }
]

app.get('/book', authenToken, (req, res) => {
    res.json({ status: 'success', data: boooks })
});

function authenToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    if (!token) res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        console.log(data);
        if (err) res.sendStatus(403);
        next();
    });
}

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})
