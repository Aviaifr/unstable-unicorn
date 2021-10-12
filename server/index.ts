'use strict';
import express from 'express';
import MongoStore from 'connect-mongo'
import path from "path";
import cors from 'cors';
import sessions from 'express-session';
import http from 'http'
import { initSockets } from './src/sockets/initSockets'
import { initDB } from './src/DB/initDB'

// Constants
const PORT = 3060;
const HOST = '0.0.0.0';

// App and servers
const app = express();
app.use(cors({
  credentials: true
}));
const secret = 'thisIsMySEcrEt333123';
const session = sessions({
  store: MongoStore.create({
    mongoUrl: 'mongodb://mongodb:27017/test'
  }),
  secret: secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly:true,
    domain: 'localhost'
  }
});
app.use(session);
const server = http.createServer(app);

initDB();
initSockets(app,server, session);



app.get('/api', (req: any, res: any) => {
  res.send('Good morning!');
});

app.use('/static-resources', express.static(path.join(__dirname, "public")))
server.listen(PORT, HOST, () =>console.log(`App Started at ${PORT}`));
