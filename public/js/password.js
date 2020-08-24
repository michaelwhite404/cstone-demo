import axios from "axios";
import { showAlert } from "./alerts";

export const updatePassword = async (password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:8080/api/v1/users/update-password",
      data: { password, passwordConfirm },
    });

    if (res.data.status === "success") {
      showAlert("success", "Password changed");
      window.setTimeout(() => {
        location.assign("/dashboard");
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response.data);
  }
};
