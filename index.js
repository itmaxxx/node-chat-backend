const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();

const API_PORT = process.env.API_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3030;

app.use(express.json());

const users = [
  {
    id: 'user_id_1',
    fullname: 'Max Dmitriev',
    username: 'itmax',
    image: 'https://avatars.githubusercontent.com/u/38819868?v=4',
    token: 'Bearer access_token_from_api',
  },
  {
    id: 'user_id_2',
    fullname: 'Pavel Durov',
    username: 'durov',
    image: 'https://static.dw.com/image/43377200_303.jpg',
    token: 'Bearer access_token_from_api_1',
  },
  {
    id: 'user_id_3',
    fullname: 'ITStep',
    username: 'itstep',
    image:
      'https://scontent.fsof8-1.fna.fbcdn.net/v/t31.18172-8/11703541_1628435674062994_7860637593528075915_o.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=9TzZgR3i7h8AX-4tMc1&_nc_ht=scontent.fsof8-1.fna&oh=00_AT-x9KcHqqGbl_6EQeinws4HZwhCNdzyUbHQh9A9PlQQNw&oe=629E3570',
    token: 'Bearer access_token_from_api_2',
  },
];

const chats = [
  {
    id: 'chat_1',
    name: 'Pavel Durov',
    image: 'https://static.dw.com/image/43377200_303.jpg',
    messages: [
      {
        id: 'message_id_1',
        text: 'Your app looks cool',
        authorId: users[1].id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
  },
  {
    id: 'chat_2',
    name: 'ITStep',
    image:
      'https://scontent.fsof8-1.fna.fbcdn.net/v/t31.18172-8/11703541_1628435674062994_7860637593528075915_o.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=9TzZgR3i7h8AX-4tMc1&_nc_ht=scontent.fsof8-1.fna&oh=00_AT-x9KcHqqGbl_6EQeinws4HZwhCNdzyUbHQh9A9PlQQNw&oe=629E3570',
    messages: [
      {
        id: 'message_id_1',
        text: 'Webinar today at 5 PM',
        authorId: users[2].id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
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

function serializeChat(chat) {
  const { id, name, image, messages } = chat;

  return {
    id,
    name,
    image,
    lastMessage:
      messages.length && messages[messages.length - 1]
        ? serializeMessage(id, undefined, messages[messages.length - 1])
        : null,
  };
}

app.get('/api/chats', (req, res) => {
  console.log('/api/chats');

  const chatsList = chats.map((chat) => serializeChat(chat));

  return res.json({ type: 'ChatsList', data: chatsList });
});

function serializeMessage(chatId, userId, message) {
  const { id, text, authorId, createdAt, updatedAt } = message;

  return {
    id,
    text,
    chatId,
    author: users.find((user) => user.id === authorId),
    isAuthor: userId && userId === authorId,
    createdAt,
    updatedAt,
  };
}

app.get('/api/chats/:chatId/messages', (req, res) => {
  console.log('/api/chats', req.params);

  const user = requireUserAuthorization(req);

  const messages = chats.find((chat) => chat.id === req.params.chatId).messages;
  const messagesList = messages.map((message) => serializeMessage(req.params.chatId, user.id, message));

  // const messages = [];
  //
  // for (let i = 0; i < 20; i++) {
  //   messages.push({
  //     id: 'message_id_' + i,
  //     chatId: req.params.chatId,
  //     text: 'Message hello' + i,
  //     author: users[Math.floor((Math.random() * 3) % 3)],
  //     isAuthor: Math.random() >= 0.7,
  //     createdAt: Date.now() - i,
  //     updatedAt: Date.now() - i,
  //   });
  // }

  return res.json({ type: 'MessagesList', data: messagesList });
});

function requireUserAuthorization(req) {
  const user = users.find((user) => user.token === req.headers.authorization);

  return user;
}

app.post('/api/chats/:chatId/messages', (req, res) => {
  console.log('/api/chats/:chatId/messages', req.params, req.body);

  const user = requireUserAuthorization(req);

  const chat = chats.find((chat) => chat.id === req.params.chatId);
  const messageId = chat.messages.length + 1;

  const newMessage = {
    id: 'message_id_' + messageId,
    text: req.body.message,
    authorId: user.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  chat.messages.push(newMessage);

  return res.status(201).json({
    type: 'MessageSent',
    data: serializeMessage(chat.id, user.id, newMessage),
  });
});

app.get('/api/chats/:chatId', (req, res) => {
  console.log('/api/chats/:chatId');

  const chat = chats.find((chat) => chat.id === req.params.chatId);

  return res.json({ type: 'Chat', data: chat });
});

app.listen(API_PORT, () => {
  console.log(`Example app listening on port ${API_PORT}`);
});

// WEBSOCKETS SERVER

const httpServer = createServer();
const io = new Server(httpServer, {});

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('message:send', async (message) => {
    console.log('message:send', { message });

    // TODO:
    // - get user by token
    // - add message to database
    // - check if chat exists
    // - broadcast message to chat subscribers

    io
      // .to(message.data.chatId)
      .emit('message', message.data);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });

  socket.on('chat:create', async (rawChat) => {
    console.log('chat:create', { rawChat });

    const chatToCreate = JSON.parse(rawChat);
    const { name, token } = chatToCreate;

    // TODO:
    // - get user by token
    // - create chat in db
    // - create chat created message in chat
    // - get created chat
    // - send chat_invitation to chat owner with created chat

    socket.emit(
      'chat_invitation',
      JSON.stringify({
        id: 'chat_id',
        name,
        image: null,
        lastMessage: {
          id: 'message_id_1',
          chatId: 'chat_2',
          text: 'Chat created',
          author: users[0],
          isAuthor: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      })
    );
  });

  setInterval(() => {
    socket.emit(
      'message',
      JSON.stringify({
        id: 'message_id',
        chatId: Math.random() >= 0.5 ? 'chat_1' : 'chat_2',
        text: "Message hello how are you? I'm fine, thanks",
        author: users[Math.floor((Math.random() * 3) % 3)],
        isAuthor: Math.random() >= 0.7,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    );
  }, 30000);

  // setInterval(() => {
  //   socket.emit(
  //     'chat_invitation',
  //     JSON.stringify({
  //       id: 'chat_id',
  //       name: 'Chat you are invited to',
  //       image:
  //         'https://scontent.fsof8-1.fna.fbcdn.net/v/t31.18172-8/11703541_1628435674062994_7860637593528075915_o.jpg?_nc_cat=107&ccb=1-6&_nc_sid=09cbfe&_nc_ohc=9TzZgR3i7h8AX-4tMc1&_nc_ht=scontent.fsof8-1.fna&oh=00_AT-x9KcHqqGbl_6EQeinws4HZwhCNdzyUbHQh9A9PlQQNw&oe=629E3570',
  //       lastMessage: {
  //         id: 'message_id_1',
  //         chatId: 'chat_2',
  //         text: 'Webinar today at 5 PM',
  //         author: users[2],
  //         isAuthor: false,
  //         createdAt: Date.now(),
  //         updatedAt: Date.now(),
  //       },
  //     })
  //   );
  // }, 8000);
});

httpServer.listen(WS_PORT);
