const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/auth/sign-in', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (username === 'user@gmail.com') {
        if (password === 'qwerty') {
            return res.json({ jwt: 'access_token_from_api' });
        } else {
            return res.json({ error: true, message: "Username and password doesn't match" });
        }
    } else {
        return res.json({ error: true, message: "User doesn't exist" });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
