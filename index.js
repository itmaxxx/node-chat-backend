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
            image: 'https://static.dw.com/image/43377200_303.jpg',
            lastMessage: 'Your app is better than Telegram'
        },
        {
            id: 'chat_2',
            name: 'ITStep',
            image: 'https://scontent.fsof8-1.fna.fbcdn.net/v/t31.18172-8/11703541_1628435674062994_7860637593528075915_o.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=9TzZgR3i7h8AX-4tMc1&_nc_ht=scontent.fsof8-1.fna&oh=00_AT-x9KcHqqGbl_6EQeinws4HZwhCNdzyUbHQh9A9PlQQNw&oe=629E3570',
            lastMessage: 'JavaScript webinar tomorrow at 5 PM'
        }
    ];

    // for (let i = 0; i < 1000; i++) {
    //     chats.push({ id: `chat_1${i}`, name: `Chat #${i}`, image: null, lastMessage: `Last message from chat ${i}` });
    // }

    return res.json({ type: 'ChatsList', data: chats });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
