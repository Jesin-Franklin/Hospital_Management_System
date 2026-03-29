// Helper for making API calls with JWT
const BASE_URL = '/api';

function getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

async function apiFetch(endpoint, options = {}) {
    options.headers = getAuthHeaders();
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        if (response.status === 401 || response.status === 403) {
            // Unauthorized, redirect to login
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                localStorage.removeItem('jwt');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        }
        
        // Handle no content or empty responses
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        
        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }
        return data;
    } catch (error) {
        throw error;
    }
}

// Download file handling (PDF)
async function downloadFile(endpoint, filename) {
    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Download failed");
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch(err) {
        console.error(err);
        alert("Failed to download PDF");
    }
}
