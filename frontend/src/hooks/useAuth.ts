// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import { RegisterRequest, AuthUser } from '../types/auth.types';
import { STORAGE_KEYS } from '../config/constants'; // ✅ IMPORTATION AJOUTÉE

interface UseAuthReturn {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hasRole: (role: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  // États
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * INITIALISATION : Vérifier si l'utilisateur est déjà connecté
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getUser();
        
        // Debug
        console.log('🔍 [useAuth] initAuth - Token:', storedToken ? '✓ Présent' : '✗ Absent');
        console.log('🔍 [useAuth] initAuth - User:', storedUser ? '✓ Présent' : '✗ Absent');
        console.log('🔍 [useAuth] initAuth - isAuthenticated:', authService.isAuthenticated());
        
        // Vérifier directement dans localStorage pour debug
        console.log('🔍 [useAuth] localStorage - auth_token:', localStorage.getItem(STORAGE_KEYS.TOKEN));
        console.log('🔍 [useAuth] localStorage - user_data:', localStorage.getItem(STORAGE_KEYS.USER));
        
        if (storedToken && authService.isAuthenticated()) {
          setToken(storedToken);
          setUser(storedUser);
        } else {
          console.log('⚠️ [useAuth] Pas authentifié, déconnexion...');
          authService.logout();
        }
      } catch (err) {
        console.error('❌ [useAuth] Erreur initialisation auth:', err);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * FONCTION 1 : LOGIN
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loggedUser = await authService.login(email, password);
      const newToken = authService.getToken();
      setToken(newToken);
      setUser(loggedUser);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      console.error('❌ [useAuth] Erreur login:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * FONCTION 2 : REGISTER
   */
  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.register(data);
      await login(data.email, data.motDePasse);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur d\'inscription';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  /**
   * FONCTION 3 : LOGOUT
   */
  const logout = useCallback(() => {
    console.log('👋 [useAuth] Logout...');
    authService.logout();
    setToken(null);
    setUser(null);
    setError(null);
    
    // Debug après logout
    console.log('🔍 [useAuth] localStorage après logout - auth_token:', localStorage.getItem(STORAGE_KEYS.TOKEN));
    console.log('🔍 [useAuth] localStorage après logout - user_data:', localStorage.getItem(STORAGE_KEYS.USER));
  }, []);

  /**
   * FONCTION 4 : CLEAR ERROR
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * FONCTION 5 : CHECK ROLE
   */
  const hasRole = useCallback((role: string): boolean => {
    return authService.hasRole(role);
  }, []);

  // État dérivé
  const isAuthenticated = !!token && !!user;

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    hasRole,
  };
};