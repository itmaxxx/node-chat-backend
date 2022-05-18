const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const users = [
  {
    id: 'user_id_1',
    fullname: 'Max Dmitriev',
    username: 'itmax',
    image: 'https://avatars.githubusercontent.com/u/38819868?v=4',
  },
  {
    id: 'user_id_2',
    fullname: 'Pavel Durov',
    username: 'durov',
    image: 'https://static.dw.com/image/43377200_303.jpg',
  },
  {
    id: 'user_id_3',
    fullname: 'ITStep',
    username: 'itstep',
    image:
      'https://scontent.fsof8-1.fna.fbcdn.net/v/t31.18172-8/11703541_1628435674062994_7860637593528075915_o.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=9TzZgR3i7h8AX-4tMc1&_nc_ht=scontent.fsof8-1.fna&oh=00_AT-x9KcHqqGbl_6EQeinws4HZwhCNdzyUbHQh9A9PlQQNw&oe=629E3570',
  },
];

const chats = [
  {
    id: 'chat_1',
    name: 'Pavel Durov',
    image: 'https://static.dw.com/image/43377200_303.jpg',
    lastMessage: {
      id: 'message_id_1',
      chatId: 'chat_1',
      text: 'Your app looks cool',
      author: users[1],
      isAuthor: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
  {
    id: 'chat_2',
    name: 'ITStep',
    image:
      'https://scontent.fsof8-1.fna.fbcdn.net/v/t31.18172-8/11703541_1628435674062994_7860637593528075915_o.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=9TzZgR3i7h8AX-4tMc1&_nc_ht=scontent.fsof8-1.fna&oh=00_AT-x9KcHqqGbl_6EQeinws4HZwhCNdzyUbHQh9A9PlQQNw&oe=629E3570',
    lastMessage: {
      id: 'message_id_1',
      chatId: 'chat_2',
      text: 'Webinar today at 5 PM',
      author: users[2],
      isAuthor: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
];

app.post('/api/auth/sign-in', (req, res) => {
  console.log('/api/auth/sign-in', req.body);
  const { username, password } = req.body;

  if (username === 'user@gmail.com') {
    if (password === 'qwerty') {
      return res.json({
        token: 'access_token_from_api',
        data: users[0],
      });
    } else {
      return res.json({
        error: true,
        message: "Username and password doesn't match",
      });
    }
  } else {
    return res.json({ error: true, message: "User doesn't exist" });
  }
});

app.get('/api/chats', (req, res) => {
  console.log('/api/chats');

  return res.json({ type: 'ChatsList', data: chats });
});

app.get('/api/chats/:chatId/messages', (req, res) => {
  console.log('/api/chats', req.params);

  const messages = [];

  for (let i = 0; i < 20; i++) {
    messages.push({
      id: 'message_id_' + i,
      chatId: req.params.chatId,
      text: 'Message hello' + i,
      author: users[Math.floor((Math.random() * 3) % 3)],
      isAuthor: Math.random() >= 0.7,
      createdAt: Date.now() - i,
      updatedAt: Date.now() - i,
    });
  }

  return res.json({ type: 'MessagesList', data: messages });
});

app.post('/api/chats/:chatId/messages', (req, res) => {
  console.log('/api/chats/:chatId/messages', req.params, req.body, req.headers.authorization);

  return res.status(201).json({
    type: 'MessageSent',
    data: {
      id: 'message_id_new',
      chatId: req.params.chatId,
      text: req.body.message,
      author: users[0],
      isAuthor: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
