// src/types/auth.types.ts

export interface RegisterRequest {
  nom: string;
  prenom?: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  dateDeNaissance?: string;   // ✅ ajouté
  role?: {                    // ✅ ajouté
    id: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  nom: string;
  prenom: string;
  roles: string[];
}

export interface User {
  id?: number;
  username: string;
  email: string;
  roles: string[];
  enabled?: boolean;
}

export interface DecodedToken {
  sub: string;
  roles: string[];
  exp: number;
  iat: number;
}

export interface AuthUser {
  email: string;
  nom: string;
  prenom: string;
  roles: string[];
}