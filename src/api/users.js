// This is the base path of the Express route we'll define

const BASE_URL = "http://localhost:3000/";

export async function signUp(userData) {
  const createURL = BASE_URL + '/create';
  console.log(createURL);

  const res = await fetch(createURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  
  if (res.ok) {
    console.log("api users signUp res:", res);
    // res.json() will resolve to the JWT
    return res.json();
  } else {
    throw new Error("Invalid Sign Up");
  }
}

export async function getLoginDetails(email) {
    const searchParams = new URLSearchParams({"email": email});
    const getLoginDetailsURL = BASE_URL + '/login?' + searchParams;
    console.log(getLoginDetailsURL);

    const res = await fetch(getLoginDetailsURL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    // Check if request was successful
    if (res.ok) {
        // res.json() will resolve to the JWT
        console.log(res);
        return res.json();
    } else {
        throw new Error("Invalid User");
    }
}

export async function loginUser(userData) {
    const loginURL = BASE_URL + '/login';
    console.log(loginURL);

    const res = await fetch(loginURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // Check if request was successful
    if (res.ok) {
      // res.json() will resolve to the JWT
      console.log(res);
      return res.json();
    } else {
      throw new Error("Invalid Login");
    }
  }
  
  export async function logoutUser(token, userData) {
    // Fetch uses an options object as a second arg to make requests
    // other than basic GET requests, include data, headers, etc.
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
      // res.json() will resolve to the JWT
      console.log(res);
      return res.json();
    } else {
      throw new Error("Invalid Logout");
    }
  }