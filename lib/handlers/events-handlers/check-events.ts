import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";

// ---------------------------------------- handler checking event ----------------------------------------

async function handleChecking(formData: Record<string, any> = {}) {
  try {
    const res = await api.post(API.private.check, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler is not me event ----------------------------------------

async function handleIsNotMe(formData: Record<string, any> = {}) {
  try {
    const res = await api.post(API.private.isNotMe, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler is not me event ----------------------------------------

async function handleResendForgotPasswordEmail(formData: Record<string, any> = {}) {
  try {
    const res = await api.post(API.private.resendForgotPasswordEmail, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler reset password event ----------------------------------------

async function handleResetPassword(formData: Record<string, any> = {}) {
  try {
    const res = await api.post(API.private.resetPassword, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler verify event ----------------------------------------

async function handleVerify(formData: Record<string, any> = {}) {
  try {
    const res = await api.post(API.private.verify, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export {
  handleChecking,
  handleIsNotMe,
  handleResendForgotPasswordEmail,
  handleResetPassword,
  handleVerify
}