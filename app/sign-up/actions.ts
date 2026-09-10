"use server";

import axios from "axios";

interface FormInfo {
  username: string;
  email: string;
  password: string;
}

const getFormInfo = (formData: FormData): FormInfo => {
  const username = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!username.trim() || !email.trim() || !password.trim()) {
    throw new Error("Missing required fields");
  }
  return {
    username,
    email,
    password,
  };
};

export async function handleSignUp(formData: FormData) {
  const { username, email, password } = getFormInfo(formData);

  try {
    const response = await axios.post("/api/auth/signup", {
      username,
      email,
      password,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
