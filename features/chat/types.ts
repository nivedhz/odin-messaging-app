import { JWTPayload } from "jose";

export interface User {
  id: string;
  username: string;
  email: string;
  chats: string[];
  friends: string[];
  blocked: string[];
}

export interface SessionPayload extends JWTPayload {
  userId?: string;
}
