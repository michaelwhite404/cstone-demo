import axios from "axios";
import capitalize from "capitalize";
import pluralize from "pluralize"
import { showAlert } from "./alerts";

export const editDevice = async (name, brand, model, serialNumber, macAddress, status) => {
  try {
    const { id, deviceType } = window.pageData
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/${pluralize(deviceType)}/${id}`,
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
      showAlert("success", `${capitalize(deviceType)} edit successful!`);
      window.setTimeout(() => {
        location.assign(`/${pluralize(deviceType)}/${res.data.data[deviceType].slug}`);
      }, 1500);
    }
  } catch {
    showAlert("error", err.response.data.message);
  }
};

export const addDevice = async (name, brand, model, serialNumber, macAddress, status) => {
  try {
    const deviceTypePlural = window.location.pathname.split("/")[1];
    const res = await axios({
      method: "POST",
      url: `/api/v1/${deviceTypePlural}`,
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
      showAlert("success", `${capitalize(pluralize.singular(deviceTypePlural))} Added!`);
      window.setTimeout(() => {
        location.assign(`/${deviceTypePlural}/${res.data.data[pluralize.singular(deviceTypePlural)].slug}`);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const checkOutDevice = async (lastUser) => {
  try {
    const { id, deviceType } = window.pageData
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/${pluralize(deviceType)}/${id}/check-out`,
      data: { lastUser },
    });

    if (res.data.status === "success") {
      showAlert("success", `${capitalize(deviceType)} checkout successful!`);
      window.setTimeout(() => {
        history.go();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const checkInDevice = async () => {
  try {
    const { id, deviceType } = window.pageData
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/${pluralize(deviceType)}/${id}/check-in`,
      data: {},
    });

    if (res.data.status === "success") {
      showAlert("success", `${capitalize(deviceType)} checked in!`);
      window.setTimeout(() => {
        history.go();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};