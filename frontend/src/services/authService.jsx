import api from "../api/api.js"; 

export async function loginUser(username, password) {
  const response = await api.post("/login", { username, password });
  return response.data;
}

export async function registerUser(username, password) {
  const response = await api.post("/register", { username, password });
  return response.data;
}
