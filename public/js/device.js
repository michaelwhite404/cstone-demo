import axios from "axios";
import capitalize from "capitalize";
import pluralize from "pluralize";
import { showAlert } from "./alerts";

export const editDevice = async (
  name,
  brand,
  model,
  serialNumber,
  macAddress,
  status
) => {
  try {
    const { id, deviceType } = window.pageData;
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
        location.assign(
          `/${pluralize(deviceType)}/${res.data.data[deviceType].slug}`
        );
      }, 1500);
      return true;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    return false;
  }
};

export const addDevice = async (
  name,
  brand,
  model,
  serialNumber,
  macAddress,
  status
) => {
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
      showAlert(
        "success",
        `${capitalize(pluralize.singular(deviceTypePlural))} Added!`
      );
      window.setTimeout(() => {
        location.assign(
          `/${deviceTypePlural}/${
            res.data.data[pluralize.singular(deviceTypePlural)].slug
          }`
        );
      }, 1500);
      return true;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    return false;
  }
};

export const checkOutDevice = async (lastUser, lastCheckOut, dueDate) => {
  try {
    const { id, deviceType } = window.pageData;
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/${pluralize(deviceType)}/${id}/check-out`,
      data: {
        lastUser,
        lastCheckOut,
        checkOutDate: lastCheckOut,
        dueDate,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", `${capitalize(deviceType)} checkout successful!`);
      window.setTimeout(() => {
        history.go();
      }, 1500);
      return true;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    return false;
  }
};

export const checkInDevice = async (error, checkInDate, title, description) => {
  try {
    const { id, deviceType } = window.pageData;
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/${pluralize(deviceType)}/${id}/check-in`,
      data: { error, checkInDate, title, description },
    });

    if (res.data.status === "success") {
      showAlert("success", `${capitalize(deviceType)} checked in!`);
      window.setTimeout(() => {
        history.go();
      }, 1500);
      return true;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    return false;
  }
};

export const updateError = async (errorId, status, description) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/error-logs/${errorId}`,
      data: { status, description },
    });

    if (res.data.status === "success") {
      showAlert("success", "Error updated sucessfully");
      window.setTimeout(() => {
        history.go();
      }, 1500);
      return true;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    return false;
  }
};

export const createError = async (title, description, createdAt) => {
  try {
    const { id } = window.pageData;
    const res = await axios({
      method: "POST",
      url: "/api/v1/error-logs/",
      data: { title, description, device: id, createdAt },
    });

    if (res.data.status === "success") {
      showAlert("success", "Error created sucessfully");
      window.setTimeout(() => {
        history.go();
      }, 1500);
      return true;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    return false;
  }
};
