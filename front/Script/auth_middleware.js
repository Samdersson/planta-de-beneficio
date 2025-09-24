class AuthMiddleware {
    constructor() {
        this.token = this.getTokenFromUrl() || sessionStorage.getItem('auth_token');
        this.isAuthenticated = this.validateToken();

        // Si hay token en URL, guardarlo en sessionStorage
        if (this.token && this.getTokenFromUrl()) {
            sessionStorage.setItem('auth_token', this.token);
            this.cleanUrl();
        }
    }

    // Obtener token de la URL
    getTokenFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token');
    }

    // Limpiar token de la URL
    cleanUrl() {
        const url = new URL(window.location);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.pathname);
    }

    // Validar si el token existe y es válido
    validateToken() {
        if (!this.token) return false;

        try {
            const parts = this.token.split('.');
            if (parts.length !== 3) return false;

            const payload = JSON.parse(atob(parts[1]));

            // Verificar expiración
            if (payload.exp < Math.floor(Date.now() / 1000)) {
                this.logout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error validando token:', error);
            this.logout();
            return false;
        }
    }

    // Proteger una página
    protectPage() {
        if (!this.isAuthenticated) {
            window.location.href = 'inicio.html';
            return false;
        }
        return true;
    }

    // Logout
    logout() {
        sessionStorage.removeItem('auth_token');
        window.location.href = 'inicio.html';
    }

    // Obtener datos del usuario del token
    getUserData() {
        if (!this.token) return null;

        try {
            const parts = this.token.split('.');
            const payload = JSON.parse(atob(parts[1]));
            return payload;
        } catch (error) {
            console.error('Error obteniendo datos del usuario:', error);
            return null;
        }
    }

    // Obtener el token actual
    getToken() {
        return this.token;
    }
}

// Función global para proteger páginas
function requireAuth() {
    const auth = new AuthMiddleware();
    return auth.protectPage();
}

// Función para obtener datos del usuario autenticado
function getCurrentUser() {
    const auth = new AuthMiddleware();
    return auth.getUserData();
}

// Función para logout
function logout() {
    const auth = new AuthMiddleware();
    auth.logout();
}
