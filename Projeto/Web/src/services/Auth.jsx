export const userAuthentication = () => localStorage.getItem('user-token') !== null;

export const parseJwt = () => {
    const payload = localStorage.getItem('user-token').split('.')[1];

    const token = JSON.parse(window.atob(payload));
    return token;
    
}

export const logout = () => {
    localStorage.removeItem('user-token');
}