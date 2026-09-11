"use server";

import { login } from "./login";
import { LoginData, LoginResponse } from "./types";

const getFormInfo = (formData: FormData): LoginData => {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email.trim() || !password.trim()) {
    throw new Error("Missing required fields");
  }
  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid form data");
  }

  return {
    email,
    password,
  };
};

export async function handleLogin(
  _prevState: LoginResponse,
  formData: FormData,
): Promise<LoginResponse> {
  const data = getFormInfo(formData);
  const loginStatus = await login(data);

  if (!loginStatus.success) {
    return {
      success: false,
      message: loginStatus.message,
    };
  }

  return {
    success: true,
    message: "Welcome back! Redirecting you to your chats…",
  };
}
