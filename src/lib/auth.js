/**
 * LMS Auth & User Role Service
 * Real Authentication Engine linked to Supabase Auth & DB Profiles
 */
import { supabase, isSupabaseConfigured } from './supabase';

// Designated Platform Admin Email
export const ADMIN_EMAIL = 'admin@gmail.com';

/**
 * Get active authenticated user from session storage
 */
export function getCurrentUser() {
  const saved = localStorage.getItem('studypulse_active_user');
  if (saved) {
    try { 
      return JSON.parse(saved); 
    } catch (e) {
      console.error('Failed to parse user session:', e);
    }
  }
  return null;
}

/**
 * Save active user session & track in platform directory
 */
export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem('studypulse_active_user');
    return;
  }
  localStorage.setItem('studypulse_active_user', JSON.stringify(user));

  // Also add/update user in shared platform users directory
  saveToUsersDirectory(user);
}

/**
 * Persist user into shared directory (LocalStorage + Supabase)
 */
export async function saveToUsersDirectory(userObj) {
  if (!userObj || !userObj.email) return;

  // 1. LocalStorage Directory
  const storedUsers = JSON.parse(localStorage.getItem('studypulse_all_users') || '[]');
  const existingIdx = storedUsers.findIndex(u => u.email.toLowerCase() === userObj.email.toLowerCase());
  
  if (existingIdx >= 0) {
    storedUsers[existingIdx] = { ...storedUsers[existingIdx], ...userObj };
  } else {
    storedUsers.push(userObj);
  }
  localStorage.setItem('studypulse_all_users', JSON.stringify(storedUsers));

  // 2. Supabase DB Profiles Directory
  if (isSupabaseConfigured && supabase && userObj.id) {
    try {
      await supabase.from('profiles').upsert([{
        id: userObj.id,
        email: userObj.email,
        full_name: userObj.full_name,
        role: userObj.role,
        avatar_url: userObj.avatar_url,
        updated_at: new Date().toISOString()
      }], { onConflict: 'id' });
    } catch (err) {
      console.warn('Supabase profile upsert error:', err);
    }
  }
}

/**
 * Fetch ALL Registered Users on the Platform (For Admin Console)
 */
export async function getAllRegisteredUsers() {
  const localUsers = JSON.parse(localStorage.getItem('studypulse_all_users') || '[]');
  
  // Ensure default Admin exists in list
  const defaultAdmin = {
    id: 'usr_admin_master',
    email: ADMIN_EMAIL,
    full_name: 'Platform Administrator',
    role: 'admin',
    avatar_url: `https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff`,
    joinedAt: new Date().toISOString()
  };

  const map = new Map();
  map.set(ADMIN_EMAIL.toLowerCase(), defaultAdmin);

  // Add Local Storage Users
  localUsers.forEach(u => {
    if (u && u.email) map.set(u.email.toLowerCase(), u);
  });

  // Fetch Supabase Users if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach(p => {
          if (p && p.email) {
            map.set(p.email.toLowerCase(), {
              id: p.id,
              email: p.email,
              full_name: p.full_name || p.email.split('@')[0],
              role: p.role || 'student',
              avatar_url: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.email)}&background=6366f1&color=fff`,
              joinedAt: p.created_at || new Date().toISOString()
            });
          }
        });
      }
    } catch (err) {
      console.warn('Supabase fetch profiles error:', err);
    }
  }

  return Array.from(map.values());
}

/**
 * Sign in user with email and password
 */
export async function loginUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const isAdminEmail = cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail.includes('admin');

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) throw error;
      
      if (data && data.user) {
        // Fetch user role & profile from Supabase DB
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const role = profile?.role || (isAdminEmail ? 'admin' : 'student');

        const userObj = {
          id: data.user.id,
          email: data.user.email,
          full_name: profile?.full_name || (isAdminEmail ? 'Platform Administrator' : cleanEmail.split('@')[0]),
          role: role,
          avatar_url: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail)}&background=${isAdminEmail ? '7c3aed' : '6366f1'}&color=fff`,
          joinedAt: profile?.created_at || new Date().toISOString()
        };

        setCurrentUser(userObj);
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.warn('Supabase Auth Sign In error:', err.message);
      return { success: false, error: err.message };
    }
  }

  // Local Session Auth
  const role = isAdminEmail ? 'admin' : 'student';

  const userObj = {
    id: 'usr_' + Date.now(),
    email: cleanEmail,
    full_name: isAdminEmail ? 'Platform Administrator' : cleanEmail.split('@')[0],
    role: role,
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail)}&background=${isAdminEmail ? '7c3aed' : '6366f1'}&color=fff`,
    joinedAt: new Date().toISOString()
  };

  setCurrentUser(userObj);
  return { success: true, user: userObj };
}

/**
 * Register a new user
 */
export async function registerUser(email, password, fullName) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const isAdminEmail = cleanEmail === ADMIN_EMAIL.toLowerCase();
  const role = isAdminEmail ? 'admin' : 'student';

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName || (isAdminEmail ? 'Platform Administrator' : cleanEmail.split('@')[0]),
            role: role
          }
        }
      });
      if (error) throw error;

      if (data && data.user) {
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || (isAdminEmail ? 'Platform Administrator' : cleanEmail.split('@')[0]),
          role: role,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || cleanEmail)}&background=${isAdminEmail ? '7c3aed' : '6366f1'}&color=fff`,
          joinedAt: new Date().toISOString()
        };
        setCurrentUser(userObj);
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.warn('Supabase Auth Registration error:', err.message);
      return { success: false, error: err.message };
    }
  }

  // Local fallback registration
  const userObj = {
    id: 'usr_' + Date.now(),
    email: cleanEmail,
    full_name: fullName || (isAdminEmail ? 'Platform Administrator' : cleanEmail.split('@')[0]),
    role: role,
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || cleanEmail)}&background=${isAdminEmail ? '7c3aed' : '6366f1'}&color=fff`,
    joinedAt: new Date().toISOString()
  };

  setCurrentUser(userObj);
  return { success: true, user: userObj };
}

/**
 * Sign out active user
 */
export async function logoutUser() {
  if (isSupabaseConfigured && supabase) {
    try { await supabase.auth.signOut(); } catch (err) {}
  }
  localStorage.removeItem('studypulse_active_user');
}
