import api from "../api/api.js"; 

//create currency
export async function addCurrency(data,token){
    const response = await api.post("/currencies", data, {
    headers: { Authorization: `Bearer ${token}` },
    });
  return response.data;
}

//get all currencies
export async function getCurrencies(token,page = 1, limit = 10){
  const response = await api.get(`/currencies?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return response.data;
}

//get currency by id
export async function getCurrencyById(id, token) {
  const response = await api.get(`/currencies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

//update currency
export async function updateCurrency(id, data, token) {
  const response = await api.put(`/currencies/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

//delete currency
export async function deleteCurrency(id, token) {
  const response = await api.delete(`/currencies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}