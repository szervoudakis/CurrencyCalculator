import api from "../api/api.js";

// Get all exchange rates with pagination
export async function getExchangeRates(token, page = 1, limit = 10) {
  const response = await api.get(`/exchange-rates?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

//Get single exchange rate
export async function getExchangeRateById(id, token) {
  const response = await api.get(`/exchange-rates/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

//Create exchange rate
export async function createExchangeRate(data, token) {
  const response = await api.post(`/exchange-rates`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

//Update exchange rate
export async function updateExchangeRate(id, data, token) {
  const response = await api.put(`/exchange-rates/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

//Delete exchange rate
export async function deleteExchangeRate(id, token) {
  const response = await api.delete(`/exchange-rates/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// 🔹 Convert currency (public endpoint)
export async function convertCurrency(from, to, amount) {
  const response = await api.get(`/convert?from=${from}&to=${to}&amount=${amount}`);
  return response.data;
}
