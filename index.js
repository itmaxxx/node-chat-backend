const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/auth/sign-in', (req, res) => {
    console.log('/api/auth/sign-in', req.body);
    const { username, password } = req.body;

    if (username === 'user@gmail.com') {
        if (password === 'qwerty') {
            return res.json({ token: 'access_token_from_api', id: 'user_id_from_backend', fullname: 'Max Dmitriev' });
        } else {
            return res.json({ error: true, message: "Username and password doesn't match" });
        }
    } else {
        return res.json({ error: true, message: "User doesn't exist" });
    }
});

app.get('/api/chats', (req, res) => {
    console.log('/api/chats');

    const chats = [
        {
            id: 'chat_1',
            name: 'Pavel Durov',
            image: 'image_url',
            lastMessage: 'Your app is better than Telegram'
        },
        {
            id: 'chat_2',
            name: 'ITStep',
            image: 'image_url',
            lastMessage: 'JavaScript webinar tomorrow at 5 PM'
        }
    ];

    return res.json({ type: 'ChatsList', data: chats });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
