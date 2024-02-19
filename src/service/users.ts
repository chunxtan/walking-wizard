import * as usersAPI from "../api/users";
// import { getToken, removeToken } from "../util/security";
import { SignUpFormInput } from "../components/UserProfile/LoginSignUp/SignUpForm"
import { LoginDetails } from "../components/UserProfile/LoginSignUp/LoginForm"
import { getToken, removeToken } from "../util/security";
import { GetLoginDetailsResponse, LogoutResponse } from "../api/users";

export async function signUp(userData: SignUpFormInput) {
    console.log("service signup: ", userData)
    const token = await usersAPI.signUp(userData);
    return token;
}

export async function getLoginDetails(email: string): Promise<GetLoginDetailsResponse> {
    console.log("getLoginDetails email", email)
    const loginDetails = await usersAPI.getLoginDetails(email);
    return loginDetails;
}

export async function loginUser(userData: LoginDetails) {
    // Delegate the network request code to the users-api.js API module
    // which will ultimately return a JSON Web Token (JWT)
    console.log("loginUser userData:", userData);
    const res = await usersAPI.loginUser(userData);
    return res;
}

export async function logoutUser(): Promise<LogoutResponse> {
  const token = getToken();
  console.log("token:", token);
  if (token) {
    const res = await usersAPI.logoutUser(token, JSON.parse(atob(token.split(".")[1])).payload);
    removeToken();
    console.log("logout res: ", res)
    return res;
  } else {
    throw new Error("No token found.")
  }
}