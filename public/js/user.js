import axios from "axios";
import { showAlert } from "./alerts";

export const newUser = async (
  firstName,
  lastName,
  title,
  email,
  role,
  grade
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/create",
      data: { firstName, lastName, title, email, role, grade },
    });

    if (res.data.status === "success") {
      showAlert("success", "New user added!");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response.data);
  }
};

export const editUser = async (
  firstName,
  lastName,
  title,
  email,
  role,
  grade,
  id
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/${id}`,
      data: { firstName, lastName, title, email, role, grade },
    });

    if (res.data.status === "success") {
      showAlert("success", "User edited!");
      window.setTimeout(() => {
        location.assign(`/users/${res.data.data.employee.slug}/edit`);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response.data);
  }
};
