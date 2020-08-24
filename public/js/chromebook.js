import axios from "axios";
import { showAlert } from "./alerts";

export const editChromebook = async (
  name,
  brand,
  model,
  serialNumber,
  macAddress,
  status,
  id
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8080/api/v1/chromebooks/${id}`,
      data: {
        name,
        brand,
        model,
        serialNumber,
        macAddress,
        status,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Chromebook edit successful!");
      window.setTimeout(() => {
        location.assign(`/chromebooks/${res.data.data.chromebook.slug}`);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const addChromebook = async (
  name,
  brand,
  model,
  serialNumber,
  macAddress,
  status
) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8080/api/v1/chromebooks",
      data: {
        name,
        brand,
        model,
        serialNumber,
        macAddress,
        status,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Chromebook Added!");
      window.setTimeout(() => {
        location.assign(`/chromebooks/${res.data.data.chromebook.slug}`);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const checkOut = async (lastUser, chromebookId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8080/api/v1/chromebooks/${chromebookId}/check-out`,
      data: { lastUser },
    });

    if (res.data.status === "success") {
      showAlert("success", "Chromebook checkout successful!");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const checkIn = async (chromebookId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8080/api/v1/chromebooks/${chromebookId}/check-in`,
      data: {},
    });

    if (res.data.status === "success") {
      showAlert("success", "Chromebook checked in!");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    console.log(err.response.data);
  }
};
