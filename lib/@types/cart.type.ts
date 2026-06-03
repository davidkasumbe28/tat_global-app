import { CartItem, StateCart } from "./types";
import favorites from './../data/processed/favorites';
import { Favorite } from "../generated/prisma/client";

export interface CartAuth {
  id: number;
  state: StateCart;
  cartItems: CartItem[];
}
