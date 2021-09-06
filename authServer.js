import express from 'express';
const app = express();
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 5500;
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// Fake database
const databaseRefreshToken = [];

app.post('/refreshtoken', (req, res) => {

    const refreshToken = req.body.token;
    if (!refreshToken) res.json("Token Does Not Exist In Client");
    if (!databaseRefreshToken.includes(refreshToken)) res.json("Token Does Not Exist In Server");
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) res.sendStatus(403);
        console.log(data);

        const accessToken = jwt.sign({ user: data.username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '180s'
        });
        res.json({ accessToken });
    })
})

app.post('/login', (req, res) => {
    const data = req.body;
    console.log(data);

    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);

    databaseRefreshToken.push(refreshToken)
    
    res.json({ accessToken, refreshToken });
});

app.post('/logout', (req, res) => {
    const refreshToken = req.body.token;

    databaseRefreshToken = databaseRefreshToken.filter((refToken) => refToken !== refreshToken);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})
