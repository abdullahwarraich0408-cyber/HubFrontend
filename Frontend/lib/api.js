const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function apiFetch(path, options = {}) {
  let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && token !== 'cookie-auth-active' && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // If using FormData, let the browser set the boundary header automatically
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (err) {
    throw new Error(
      err?.message === 'Failed to fetch'
        ? 'Unable to reach the server. Check that the backend is running.'
        : err?.message || 'Network request failed'
    );
  }

  // Automatically refresh expired tokens on 401
  if (response.status === 401 && typeof window !== 'undefined' && path !== '/auth/refresh' && path !== '/auth/login') {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newTokens = refreshData.data?.tokens || refreshData.tokens || refreshData.data;

          if (newTokens?.accessToken) {
            localStorage.setItem('token', newTokens.accessToken);
            if (newTokens.refreshToken) {
              localStorage.setItem('refreshToken', newTokens.refreshToken);
            }

            const retryHeaders = {
              ...headers,
              Authorization: `Bearer ${newTokens.accessToken}`,
            };

            response = await fetch(`${BASE_URL}${path}`, {
              ...options,
              headers: retryHeaders,
              credentials: 'include',
            });
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      } catch (err) {
        console.error("Auto token refresh failed:", err);
      }
    }
  }

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (err) {
    json = { message: text || 'An error occurred' };
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }

  return json.data || json;
}

export const api = {
  // 🔐 Authentication API
  auth: {
    login: async (email, password) => {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.tokens?.accessToken) {
        api.setToken(data.tokens.accessToken);
        if (data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', data.tokens.refreshToken);
        }
      } else if (data.token) {
        api.setToken(data.token);
      } else if (data.user) {
        api.setToken("cookie-auth-active");
      }
      if (data.user && typeof window !== 'undefined') {
        localStorage.setItem('pharmahub_user', JSON.stringify(data.user));
      }
      return data;
    },
    register: async (userData) => {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (data.tokens?.accessToken) {
        api.setToken(data.tokens.accessToken);
        if (data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', data.tokens.refreshToken);
        }
      } else if (data.token) {
        api.setToken(data.token);
      } else if (data.user) {
        api.setToken("cookie-auth-active");
      }
      if (data.user && typeof window !== 'undefined') {
        localStorage.setItem('pharmahub_user', JSON.stringify(data.user));
      }
      return data;
    },
    logout: async () => {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      try {
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        });
      } catch (err) {
        console.error("Logout request failed", err);
      } finally {
        api.clearToken();
        localStorage.removeItem('refreshToken');
      }
    },
  },

  // Authentication helpers
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('pharmahub_user');
    }
  },

  // 🛒 Cart API
  cart: {
    get: () => apiFetch('/customer/cart'),
    add: async (productId, quantity) => {
      const res = await apiFetch('/customer/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity })
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }
      return res;
    },
    update: async (itemId, quantity) => {
      const res = await apiFetch(`/customer/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }
      return res;
    },
    remove: async (itemId) => {
      const res = await apiFetch(`/customer/cart/${itemId}`, {
        method: 'DELETE'
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }
      return res;
    },
    merge: async (guestCartItems) => {
      const res = await apiFetch('/customer/cart/merge', {
        method: 'POST',
        body: JSON.stringify({ items: guestCartItems })
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }
      return res;
    },
  },

  // ⭐ Reviews & Ratings API
  reviews: {
    submit: (data) => apiFetch('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getProductReviews: (productId) => apiFetch(`/products/${productId}/reviews`),
    update: (reviewId, data) => apiFetch(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (reviewId) => apiFetch(`/reviews/${reviewId}`, {
      method: 'DELETE'
    }),
    getVendorReviews: (vendorId) => apiFetch(`/vendors/${vendorId}/reviews`),
  },

  // 💊 Prescriptions API
  prescriptions: {
    upload: (file) => {
      const formData = new FormData();
      formData.append('prescription', file);
      return apiFetch('/prescriptions/upload', {
        method: 'POST',
        body: formData
      });
    },
    getHistory: () => apiFetch('/customer/prescriptions'),
  },

  // 🏷️ Coupons & Offers API
  coupons: {
    validate: (code, orderAmount = 0) => apiFetch(`/coupons/${code}?orderAmount=${orderAmount}`),
    listApplicable: () => apiFetch('/customer/coupons'),
  },

  // 🔍 Search & Filtering API
  search: {
    getFilters: () => apiFetch('/search/filters'),
    advanced: (filters) => apiFetch('/search/advanced', {
      method: 'POST',
      body: JSON.stringify(filters)
    }),
    autocomplete: (q) => apiFetch(`/search/autocomplete?q=${encodeURIComponent(q)}`),
    trending: () => apiFetch('/search/trending'),
  },

  // 📍 Saved Addresses API
  addresses: {
    list: () => apiFetch('/addresses'),
    add: (data) => apiFetch('/addresses', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => apiFetch(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiFetch(`/addresses/${id}`, {
      method: 'DELETE'
    }),
  },

  // 🔔 Notifications API
  notifications: {
    updatePreferences: (data) => apiFetch('/notifications/preferences', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  },

  // 📦 Orders API
  orders: {
    create: (data) => apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getMine: () => apiFetch('/orders'),
    getDetails: (id) => apiFetch(`/orders/${id}`)
  },
};
