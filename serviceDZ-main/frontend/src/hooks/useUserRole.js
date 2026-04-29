import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const useUserRole = () => {
    const { user, isAuthenticated, getAccessTokenSilently, isLoading: authLoading } = useAuth0();
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const fetchRole = async () => {
      // Si l'utilisateur n'est pas connecté, on arrête le chargement
        if (!isAuthenticated) {
        setIsLoading(false);
        return;
    }

    try {
        const token = await getAccessTokenSilently();
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
        const data = await response.json();
          setRole(data.role); // Récupère 'client' ou 'worker' depuis MongoDB
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
    } finally {
        setIsLoading(false);
    }
    };

    if (!authLoading) {
    fetchRole();
    }
    }, [isAuthenticated, authLoading, getAccessTokenSilently]);

return { role, isLoading: isLoading || authLoading, user };
};