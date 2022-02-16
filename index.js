const express = require('express');
const app = express();
const port = 3000;

app.post('/api/auth/sign-in', (req, res) => {
    console.log(req);
    res.json({ jwt: 'access_token_from_api' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
