import { NotifyOrderBy } from "../generated/prisma/enums";
import { Cart, Favorite, RoleUser, StateUser, StatusUser } from "./types";

export interface UserAuth {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: RoleUser;
  state: StateUser;
  status: StatusUser;
  favorites?: Favorite[];
  cart?: Cart;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  avatar?: string;
}

export interface UserMe {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  avatar?: string;
  notifyOrderBy : NotifyOrderBy,
  notifyNewsletter : boolean
}
