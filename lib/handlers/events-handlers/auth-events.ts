import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";

// ---------------------------------------- handlers auth events ----------------------------------------

// ---------------------------------------- handler login event ----------------------------------------

async function handleLogin(formData: Record<string, any>, remember_me: boolean) {
  try {
    const res = await api.post(API.public.login, { formData, remember_me });
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler signup event ----------------------------------------

async function handleSignup(formData: Record<string, any>) {
  try {
    const res = await api.post(API.public.signup, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler forget password event ----------------------------------------

async function handleForgetPassword(formData: Record<string, any> = {}) {
  try {
    const res = await api.post(API.public.forgetPassword, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler authenticated event ----------------------------------------

async function handleAuthenticated() {
  try {
    const res = await api.get(API.private.auth);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler logout event ----------------------------------------

async function handleLogout() {
  try {
    const res = await api.get(API.private.logout);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}


export {
  handleLogin,
  handleSignup,
  handleAuthenticated,
  handleForgetPassword,
  handleLogout,
};
