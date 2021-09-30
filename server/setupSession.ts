import sessions from 'express-session';
import core from 'express'
import { Server } from "socket.io";

export function setupSession( app: core.Express, io : Server){
  const oneDay = 1000 * 60 * 60 * 24;
  const session = sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767", //to be replaced
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
  });
  app.use(session);
  const sharedsession = require("express-socket.io-session");

  // Attach session
  app.use(session);
  
  // Share session with io sockets
  
  io.use(sharedsession(session));
}