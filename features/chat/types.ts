import { JWTPayload } from "jose";

// No need for this but just keeping it for the fucking as string thing
export interface SessionPayload extends JWTPayload {
  userId?: string;
}
