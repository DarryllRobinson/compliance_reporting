import { firstValueFrom } from "rxjs";
import config from "./config";
import { userService } from "../features/users/user.service";

export const fetchWrapper = {
  get,
  getDocument,
  post,
  put,
  delete: _delete,
};

async function get(url) {
  // console.log("userService.userValue, url", userService.userValue, url);
  // console.log(
  //   "firstValueFrom(userService.user)",
  //   await firstValueFrom(userService.user)
  // );
  let headers = authHeader(url);
  headers = {
    "Content-Type": "application/json",
    ...headers,
  };
  // console.log("post headers", headers);
  const requestOptions = {
    method: "GET",
    headers,
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function getDocument(url, location) {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json, application/x-www-form-urlencoded",
      "Content-Type": "application/json",
      ...authHeader(url),
    },
    credentials: "include",
    body: JSON.stringify(location),
  };

  return fetch(url, requestOptions).then(handleResponseForDocuments);
}

async function post(url, body) {
  // console.log(
  //   "userService.userValue, url, body",
  //   userService.userValue,
  //   url,
  //   body
  // );
  let headers = authHeader(url);
  headers = {
    "Content-Type": "application/json",
    ...headers,
  };
  // console.log("post headers", headers);
  const requestOptions = {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(body),
  };
  // console.log("post requestOptions", requestOptions);
  const response = await fetch(url, requestOptions);
  // console.log("post response", response);
  return handleResponse(response);
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  // const user = await firstValueFrom(userService.user);
  const user = userService.userValue;
  const isLoggedIn = user && user.jwtToken;
  const isApiUrl = url.startsWith(config.apiUrl);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.jwtToken}` };
  } else {
    return {};
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status) && userService.userValue) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        userService.logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function handleResponseForDocuments(response) {
  console.log("handleResponseForDocuments response: ", response);
  //return response;
  return response.text().then((text) => {
    const data = text; // && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status) && userService.userValue) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        userService.logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    console.log("data: ", data);
    return data;
  });
}
