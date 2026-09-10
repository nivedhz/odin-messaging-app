"use server";

import { signUp } from "./signup";
import { SignUpData, SignUpResponse } from "./types";

const getFormInfo = (formData: FormData): SignUpData => {
  const username = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!username.trim() || !email.trim() || !password.trim()) {
    throw new Error("Missing required fields");
  }
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Invalid form data");
  }

  return {
    username,
    email,
    password,
  };
};

export async function handleSignUp(
  _prevState: SignUpResponse,
  formData: FormData,
): Promise<SignUpResponse> {
  const { username, email, password } = getFormInfo(formData);

  const user = await signUp({ username, email, password });

  if (!user.success) {
    return {
      success: false,
      message: user.message,
    };
  }

  return {
    success: true,
    message: "",
  };
}
