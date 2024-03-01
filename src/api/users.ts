import { SignUpFormInput } from "../components/UserProfile/LoginSignUp/SignUpForm"
import { LoginDetails } from "../components/UserProfile/LoginSignUp/LoginForm"
import { UserPayload } from "../components/UserProfile/LoginSignUp/LoginUserStore";

// This is the base path of the Express route we'll define
const BASE_URL = "https://walking-wizard-be.onrender.com/users";

type UserDao = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  datasets: string[],
  scenarios: string[],
  bookmarks: string[],
  salt: string,
  iterations: number,
  token: string,
  expire_at: number,
  is_admin: boolean,
  id: string,
  createdAt: Date,
  updatedAt: Date
}

type CreateEndpointResponse = {
  success: boolean,
  data: UserDao
}

export type GetLoginDetailsResponse = {
  _id: string,
  firstName: string,
  salt: string,
  iterations: number
}

export type LogoutResponse = {
  acknowledged: boolean,
  matchedCount: number, 
  modifiedCount: number,
  upsertedCount: number,
  upsertedId: string | null
}

export async function signUp(userData: SignUpFormInput): Promise<CreateEndpointResponse> {
  const createURL = BASE_URL + '/create';
  console.log(createURL);

  const res = await fetch(createURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  
  if (res.ok) {
    console.log("api users signUp res:", res);
    const jsonData = await res.json();
    return jsonData;
  } else {
    throw new Error("Invalid Sign Up");
  }
}

export async function getLoginDetails(email: string): Promise<GetLoginDetailsResponse> {
    const searchParams = new URLSearchParams({"email": email});
    const getLoginDetailsURL = BASE_URL + '/login?' + searchParams;
    console.log(getLoginDetailsURL);

    const res = await fetch(getLoginDetailsURL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    // Check if request was successful
    if (res.ok) {
        console.log(res);
        const jsonData = res.json();
        return jsonData;
    } else {
        throw new Error("Invalid User");
    }
}

export async function loginUser(userData: LoginDetails): Promise<string> {
    const loginURL = BASE_URL + '/login';
    console.log(loginURL);

    const res = await fetch(loginURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // Check if request was successful
    if (res.ok) {
      console.log(res);
      const jsonData = await res.json();
      return jsonData;
    } else {
      throw new Error("Invalid Login");
    }
  }
  
  export async function logoutUser(token: string, userData: UserPayload): Promise<LogoutResponse> {
    const logoutURL = BASE_URL + '/logout';
    console.log(logoutURL);
    console.log("logoutUser userData:", userData);
    const res = await fetch(logoutURL, {
      method: "POST",
      headers: { "Content-Type": "application/json",  "Authorization": token},
      // Fetch requires data payloads to be stringified
      // and assigned to a body property on the options object
      body: JSON.stringify(userData),
    });
    console.log("logout res:", res);
    // Check if request was successful
    if (res.ok) {
      const jsonData = await res.json();
      console.log("logout json: ", jsonData);
      return jsonData;
    } else {
      throw new Error("Invalid Logout");
    }
  }