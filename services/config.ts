// Toggle between Local and Production Backend:
// Set to `true` for Local (http://localhost:5000)
// Set to `false` for Live Render (https://f-b-payment-backend.onrender.com)
export const USE_LOCAL_BACKEND = false;

export const RENDER_BACKEND_URL = 'https://f-b-payment-backend.onrender.com/api';
export const LOCAL_BACKEND_URL = 'http://localhost:5000/api';

export const API_BASE_URL = USE_LOCAL_BACKEND ? LOCAL_BACKEND_URL : RENDER_BACKEND_URL;
export const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
