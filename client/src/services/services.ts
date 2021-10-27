import axios from "axios";

// create a file for every service

axios.defaults.withCredentials = true;

export const SOCKET_URL = "http://localhost:8000";
export const SERVER_API_URL = `${SOCKET_URL}/api`;
export const SERVER_RCS_URL = `${SOCKET_URL}/static-resources/cards`;

export const appConnection = () => axios.get(SERVER_API_URL);

export const appConnectionOld = () =>
  fetch(SERVER_API_URL, {
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
