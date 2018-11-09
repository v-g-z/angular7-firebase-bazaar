import { ICartItemId } from "./cart-items.model";

export interface IProtocol {
    user: string;
    sum: number;
    createdAt: string;
    cartItems: ICartItemId[];
  }
  export interface IProtocolId extends IProtocol { id: string; }
  
  