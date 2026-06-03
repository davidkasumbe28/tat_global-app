import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";
import { RankAdmin, RoleUser, StateUser } from "@/lib/generated/prisma/enums";

// ---------------------------------------- handler read profile user event ----------------------------------------

async function handleReadProfileUser() {
  try {
    const res = await api.get(API.private.me);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler update profile user event ----------------------------------------

async function handleUpdateProfileUser(formData: Record<string, any>) {
  try {
    const res = await api.post(API.private.me, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler update password event ----------------------------------------

async function handleUpdatePassword(formData: Record<string, any>, id: number) {
  try {
    const res = await api.patch(API.private.me + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// ---------------------------------------- handler delete user event ----------------------------------------

async function handleDeleteUser(id: number) {
  try {
    const res = await api.delete(API.private.me + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadUsers(
  page?: string,
  limit?: string,
  role?: RoleUser | "ALL",
  state?: StateUser | "ALL",
  search?: string,
  sort?: string,
) {
  try {
    const res = await api.get(
      API.private.users +
        "?role=" +
        role +
        "&state=" +
        state +
        "&search=" +
        search +
        "&sort=" +
        sort +
        "&page=" +
        page +
        "&limit=" +
        limit,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadManagers(
  rank?: RankAdmin | "ALL",
  state?: StateUser | "ALL",
) {
  try {
    const res = await api.get(
      API.private.users + "/managers" + "?rank=" + rank + "&state=" + state,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadUser(id: number) {
  try {
    const res = await api.get(API.private.users + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateUser(id: number, formData: Record<string, any>) {
  try {
    const res = await api.patch(API.private.users + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// async function handleDeleteUser(id: number) {
//   try {
//     const res = await api.delete(API.private.me + "/" + id);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

export {
  handleReadProfileUser,
  handleUpdateProfileUser,
  handleUpdatePassword,
  handleDeleteUser,
  handleReadUsers,
  handleReadManagers,
  handleReadUser,
  handleUpdateUser,
};
