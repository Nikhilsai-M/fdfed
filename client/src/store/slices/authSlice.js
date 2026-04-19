import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildApiUrl } from '../../utils/api';


export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password, securityToken, userType }, { rejectWithValue }) => {
    try {
      let endpoint, body;

      if (userType === 'supervisor') {
        endpoint = buildApiUrl('/api/supervisor-auth/signin');
        body = { username, password };
      } else if (userType === 'admin') {
        endpoint = buildApiUrl('/api/admin-auth/admin-signin');
        body = { username, password, securityToken };
      } else {
        body = { username, password };
        endpoint = buildApiUrl('/api/auth/signin');
      }

      let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      let data = await response.json();

      
      if ((!response.ok || data.success === false) && userType === 'customer') {
        response = await fetch(buildApiUrl('/api/supervisor-auth/signin'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        });
        data = await response.json();
        
        if (response.ok && data.success) {
          return {
            user: data.supervisor,
            role: 'supervisor',
            token: data.token
          };
        }
      }

      if (!response.ok || data.success === false) {
        return rejectWithValue(data.message || 'Invalid credentials');
      }

      
      let userData, role;
      if (userType === 'admin') {
        userData = data.admin;
        role = 'admin';
      } else if (userType === 'supervisor') {
        userData = data.supervisor;
        role = 'supervisor';
      } else {
        userData = data.user;
        role = 'customer';
      }

      return {
        user: userData,
        role,
        token: data.token
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const checkSupervisorExists = createAsyncThunk(
  'auth/checkSupervisorExists',
  async (username) => {
    try {
      const response = await fetch(buildApiUrl(`/api/supervisor-auth/check?username=${encodeURIComponent(username)}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      return false;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token:
      localStorage.getItem('token') ||
      localStorage.getItem('supervisorToken') ||
      localStorage.getItem('adminToken') ||
      null,
    userType: 'customer', 
    loading: false,
    error: null,
    supervisorExists: false,
  },
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = 'customer';
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('supervisorToken');
      localStorage.removeItem('adminToken');
      
      fetch(buildApiUrl('/api/auth/signout'), {
        method: 'POST',
        credentials: 'include'
      }).catch(console.error);

      fetch(buildApiUrl('/api/supervisor/logout'), {
        method: 'GET',
        credentials: 'include'
      }).catch(console.error);
    },
    initializeAuth: (state) => {
      const savedUser = localStorage.getItem('user');
      const savedToken =
        localStorage.getItem('token') ||
        localStorage.getItem('supervisorToken') ||
        localStorage.getItem('adminToken');
      if (savedUser && savedToken) {
        state.user = JSON.parse(savedUser);
        state.token = savedToken;
      }
    },
  },
  extraReducers: (builder) => {
    builder
  
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.user, role: action.payload.role };
        state.token = action.payload.token;
        state.userType = action.payload.role;
        state.error = null;
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.removeItem('token');
        localStorage.removeItem('supervisorToken');
        localStorage.removeItem('adminToken');

        if (action.payload.role === 'supervisor') {
          localStorage.setItem('supervisorToken', state.token || '');
        } else if (action.payload.role === 'admin') {
          localStorage.setItem('adminToken', state.token || '');
        } else {
          localStorage.setItem('token', state.token || '');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
      })
      
      .addCase(checkSupervisorExists.fulfilled, (state, action) => {
        state.supervisorExists = action.payload;
      });
  },
});

export const { setUserType, setError, clearError, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
