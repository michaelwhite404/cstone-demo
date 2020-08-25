import axios from "axios";
import { showAlert } from "./alerts";

export const editTablet = async (
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
      url: `/api/v1/tablets/${id}`,
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
      showAlert("success", "Tablet edit successful!");
      window.setTimeout(() => {
        location.assign(`/tablets/${res.data.data.tablet.slug}`);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const addTablet = async (
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
      url: "/api/v1/tablets",
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
      showAlert("success", "Tablet Added!");
      window.setTimeout(() => {
        location.assign(`/tablets/${res.data.data.tablet.slug}`);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const checkOutTablet = async (lastUser, tabletId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/tablets/${tabletId}/check-out`,
      data: { lastUser },
    });

    if (res.data.status === "success") {
      showAlert("success", "Tablet checkout successful!");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const checkInTablet = async (tabletId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/tablets/${tabletId}/check-in`,
      data: {},
    });

    if (res.data.status === "success") {
      showAlert("success", "Tablet checked in!");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    // console.log(err.response.data);
  }
};
