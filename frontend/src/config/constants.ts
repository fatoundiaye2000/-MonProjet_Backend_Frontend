// src/config/constants.ts

// URL de base de votre API backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Authentification
  LOGIN: '/api/users/login',           // ✅ Correct selon Swagger
  REGISTER: '/api/users/register',     // ✅ Ajouté pour l'inscription

  // Utilisateurs
  USERS: '/api/users/all',
  USER_BY_ID: (id: number) => `/api/users/getById/${id}`,
  USER_UPDATE: '/api/users/update',
  USER_SAVE: '/api/users/save',
  USER_DELETE: (id: number) => `/api/users/delete/${id}`,

  // ✅ Événements — correspond à evenement-controller
  EVENEMENTS_ALL:        '/api/evenements/all',
  EVENEMENT_BY_ID:       (id: number) => `/api/evenements/getById/${id}`,
  EVENEMENT_SAVE:        '/api/evenements/save',
  EVENEMENT_UPDATE:      '/api/evenements/update',        // ✅ PUT request
  EVENEMENT_DELETE:      (id: number) => `/api/evenements/delete/${id}`,
  EVENEMENT_TEST:        '/api/evenements/test',
  EVENEMENT_CHECK:       '/api/evenements/check',

  // ✅ Réservations — correspond à reservation-controller
  RESERVATIONS_ALL:      '/api/reservations/all',
  RESERVATION_BY_ID:     (id: number) => `/api/reservations/getById/${id}`,
  RESERVATION_SAVE:      '/api/reservations/save',
  RESERVATION_UPDATE:    '/api/reservations/update',      // ✅ PUT request
  RESERVATION_DELETE:    (id: number) => `/api/reservations/delete/${id}`,

  // ✅ Types d'événements
  TYPE_EVENTS_ALL:       '/api/typeEvents/all',
  TYPE_EVENT_BY_ID:      (id: number) => `/api/typeEvents/getById/${id}`,
  TYPE_EVENT_SAVE:       '/api/typeEvents/save',
  TYPE_EVENT_UPDATE:     '/api/typeEvents/update',
  TYPE_EVENT_DELETE:     (id: number) => `/api/typeEvents/delete/${id}`,

  // ✅ Tarifs
  TARIFS_ALL:            '/api/tarifs/all',
  TARIF_BY_ID:           (id: number) => `/api/tarifs/getById/${id}`,
  TARIF_SAVE:            '/api/tarifs/save',
  TARIF_UPDATE:          '/api/tarifs/update',
  TARIF_DELETE:          (id: number) => `/api/tarifs/delete/${id}`,

  // ✅ Adresses
  ADRESSES_ALL:          '/api/adresses/all',
  ADRESSE_BY_ID:         (id: number) => `/api/adresses/getById/${id}`,
  ADRESSE_SAVE:          '/api/adresses/save',
  ADRESSE_UPDATE:        '/api/adresses/update',
  ADRESSE_DELETE:        (id: number) => `/api/adresses/delete/${id}`,

  // ✅ Rôles
  ROLES_ALL:             '/api/roles/all',
  ROLE_BY_ID:            (id: number) => `/api/roles/getById/${id}`,
  ROLE_SAVE:             '/api/roles/save',
  ROLE_UPDATE:           '/api/roles/update',
  ROLE_DELETE:           (id: number) => `/api/roles/delete/${id}`,

  // ✅ Fichiers
  FILES_UPLOAD:          '/files/upload-simple',
  FILES_GET:             (filename: string) => `/files/${filename}`,
  FILES_LIST:            '/files/list',
  FILES_CHECK:           (filename: string) => `/files/check/${filename}`,
} as const;

// Clés du localStorage
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
} as const;

// Configuration JWT
export const JWT_CONFIG = {
  HEADER_NAME: 'Authorization',
  TOKEN_PREFIX: 'Bearer ',
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  INVALID_CREDENTIALS: 'Identifiants incorrects',
  UNAUTHORIZED: 'Accès non autorisé',
  SERVER_ERROR: 'Erreur serveur',
  TOKEN_EXPIRED: 'Session expirée, veuillez vous reconnecter',
  EMAIL_EXISTS: 'Cet email est déjà utilisé',
  REQUIRED_FIELD: 'Ce champ est obligatoire',
} as const;