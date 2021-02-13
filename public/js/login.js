import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.localStorage.setItem("email", email);
      if (!res.data.data.employee.passwordChangedAt) {
        window.setTimeout(() => {
          location.assign("/new-password");
        }, 1500);
      } else {
        window.setTimeout(() => {
          location.assign("/dashboard");
        }, 1500);
      }
      return true;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    return false;
  }
};

export const logout = async (e) => {
  try {
    e.preventDefault();
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    if (res.data.status === "success") {
      window.location.assign("/");
    }
    return true;
  } catch (err) {
    showAlert("error", "Error logging out! Try again");
    return false;
  }
};
