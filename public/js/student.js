import axios from "axios";
import { showAlert } from "./alerts";

export const newStudent = async (
  firstName,
  lastName,
  status,
  grade,
  schoolEmail,
  personalEmail,
  customID
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8080/api/v1/students",
      data: {
        firstName,
        lastName,
        status,
        grade,
        schoolEmail,
        personalEmail,
        customID,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Student added successfully!");
      window.setTimeout(() => {
        location.assign(`/students/${res.data.data.student.slug}`);
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response.data);
  }
};

export const editStudent = async (
  firstName,
  lastName,
  status,
  grade,
  schoolEmail,
  personalEmail,
  customID,
  id
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8080/api/v1/students/${id}`,
      data: {
        firstName,
        lastName,
        status,
        grade,
        schoolEmail,
        personalEmail,
        customID,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Student added successfully!");
      window.setTimeout(() => {
        location.assign(`/students/${res.data.data.student.slug}`);
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response.data);
  }
};
