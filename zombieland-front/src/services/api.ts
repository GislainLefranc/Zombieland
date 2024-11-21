// src/services/api.ts
import axios from 'axios';

// Créer une instance Axios avec une baseURL et des en-têtes par défaut
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonction GET : Récupérer une liste de ressources
export const getDatas = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('GET error:', error);
    throw error;
  }
};

// Fonction GET par ID : Récupérer un seul élément
export const getDataById = async (endpoint: string, id: number | string) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error('GET by ID error:', error);
    throw error;
  }
};

// Fonction POST : Créer une nouvelle ressource
export const createData = async (endpoint: string, data: any) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('POST error:', error);
    throw error;
  }
};

// Fonction PUT : Mettre à jour une ressource
export const updateData = async (endpoint: string, id: number | string, data: any) => { 
  try {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('PUT error:', error);
    throw error;
  }
};

// Fonction PUT : Mettre à jour une ressource
export const updateDataPassword = async (endpoint: string, id: number | string, data: any) => { 
  try {
    const response = await api.patch(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('PUT error:', error);
    throw error;
  }
};

// Fonction DELETE : Supprimer une ressource
export const deleteData = async (endpoint: string, id: number | string) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error('DELETE error:', error);
    throw error;
  }
};

export default api;
