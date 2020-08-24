import axios from "axios";
import { showAlert } from "./alerts";

export const updatePassword = async (password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/update-password",
      data: { password, passwordConfirm },
    });

    if (res.data.status === "success") {
      showAlert("success", "Password changed");
      window.setTimeout(() => {
        location.assign("/dashboard");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response.data);
  }
};
