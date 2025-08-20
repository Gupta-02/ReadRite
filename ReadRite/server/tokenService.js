import { jwtDecode } from 'jwt-decode';

export function getToken() {
    return localStorage.getItem('token');
}

export function removeToken() {
    localStorage.removeItem('token');
}

export function isTokenExpired(token) {
    if (!token) return true;

    const decodedToken = jwtDecode(token);
    if (!decodedToken || !decodedToken.exp) return true;

    const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
    const currentTime = Date.now();

    return currentTime > expirationTime;
}

export function checkAndRemoveExpiredToken() {
    const token = getToken();
    if (isTokenExpired(token)) {
        removeToken();
    }
}