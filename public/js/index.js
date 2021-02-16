import "@babel/polyfill";
import { login, logout } from "./login";
import { newUser, editUser } from "./user";
import { newStudent, editStudent } from "./student";
import { updatePassword } from "./password";
import {
  addDevice,
  checkInDevice,
  checkOutDevice,
  createError,
  editDevice,
  updateError,
} from "./device";
import moment from "moment";

// DOM ELEMENTS
const loginForm = $("#login-form");
const logOutBtn = $("#log-out-button");
const editDeviceForm = $("#edit-device");
const addDeviceForm = $("#add-device");
const newUserForm = $("#new-user");
const editUserForm = $("#edit-user");
const newStudentForm = $("#new-student");
const editStudentForm = $("#edit-student");
const checkOutForm = $("#checkout-form");
const checkInForm = $("#checkin-form");
const firstPasswordForm = $("#create-first-password-form");
const updateErrorForm = $("#update-error-form");
const createErrorForm = $("#create-error-form");

const fakeboxFormat = (el) => {
  const dateStr = $(el).val();
  const date = new Date(dateStr).toLocaleString();
  const dateText = $(el).prev().find(".date-text");
  $(dateText).text(date);
  if ($(el).data("invalid") === "future")
    if (new Date(dateStr).getTime() > new Date(Date.now()).getTime()) {
      $(el).prev().css("color", "red");
      return false;
    } else {
      $(el).prev().css("color", "cornflowerblue");
      return true;
    }
  if ($(el).data("invalid") === "past")
    if (new Date(dateStr).getTime() < new Date(Date.now()).getTime()) {
      $(el).prev().css("color", "red");
      return false;
    } else {
      $(el).prev().css("color", "cornflowerblue");
      return true;
    }
};

const toggleDateHolder = (el) => {
  const checkbox = $(el);
  const dateHolder = $(checkbox).closest(".date-wrapper").find(".date-holder");
  if ($(checkbox).is(":checked")) {
    $(dateHolder).show();
  } else $(dateHolder).hide();
};

// Login (DONE: 2021-02-12T22:45:38Z)
if (loginForm) {
  $("#google-sign-in-button").on("click", () => {
    location.assign("/auth/google");
  });

  $(loginForm).on("submit", async function (e) {
    e.preventDefault();
    $(this).find("input[type='submit']").prop("disabled", true);
    const email = $("input#login-email").val();
    const password = $("input#login-password").val();
    const success = await login(email, password);
    if (!success) $(this).find("input[type='submit']").prop("disabled", false);
  });
}

if (logOutBtn) $(logOutBtn).on("click", logout);

if (editDeviceForm) {
  $(editDeviceForm).on("submit", async function (e) {
    e.preventDefault();
    editDeviceForm.find("input[type='submit']").prop("disabled", true);
    const name = $("#edit-device-name").val();
    const brand = $("#edit-device-brand").val();
    const model = $("#edit-device-model").val();
    const serialNumber = $("#edit-device-sn").val();
    const macAddress = $("#edit-device-mac").val();
    const status = $("#edit-device-status").find(":selected").val();
    const success = await editDevice(
      name,
      brand,
      model,
      serialNumber,
      macAddress,
      status
    );
    if (!success)
      editDeviceForm.find("input[type='submit']").prop("disabled", false);
  });
}

if (addDeviceForm) {
  $(addDeviceForm).on("submit", async function (e) {
    e.preventDefault();
    addDeviceForm.find("input[type='submit']").prop("disabled", true);
    const name = $("#create-device-name").val();
    const brand = $("#create-device-brand").val();
    const model = $("#create-device-model").val();
    const serialNumber = $("#create-device-sn").val();
    const macAddress = $("#create-device-mac").val();
    const status = $("#create-device-status").find(":selected").val();
    const success = await addDevice(
      name,
      brand,
      model,
      serialNumber,
      macAddress,
      status
    );
    if (!success)
      addDeviceForm.find("input[type='submit']").prop("disabled", false);
  });
}

if (newUserForm) {
  $(newUserForm).on("submit", (e) => {
    e.preventDefault();
    let grade;
    const firstName = $("#new-user-first-name").val();
    const lastName = $("#new-user-last-name").val();
    const title = $("#new-user-title").val();
    const email = $("#new-user-email").val();
    const role = $('input[name="role"]:checked').val();
    if ($("#new-user-homeroom-grade").find(":selected").val()) {
      grade = $("#new-user-homeroom-grade").find(":selected").val();
    }
    newUser(firstName, lastName, title, email, role, grade);
  });
}

if (editUserForm) {
  $(editUserForm).on("submit", (e) => {
    e.preventDefault();
    let grade;
    const firstName = $("#edit-user-first-name").val();
    const lastName = $("#edit-user-last-name").val();
    const title = $("#edit-user-title").val();
    const email = $("#edit-user-email").val();
    const role = $('input[name="role"]:checked').val();
    if ($("#edit-user-homeroom-grade").find(":selected").val()) {
      grade = $("#edit-user-homeroom-grade").find(":selected").val();
    }
    const id = $("#edit-user").attr("data-employee");
    editUser(firstName, lastName, title, email, role, grade, id);
  });
}

if (newStudentForm) {
  $(newStudentForm).on("submit", (e) => {
    e.preventDefault();
    let grade, personalEmail, customID;
    const firstName = $("#new-student-first-name").val();
    const lastName = $("#new-student-last-name").val();
    const status = $("#new-student-status").val();
    const schoolEmail = $("#new-student-school-email").val();
    if ($("#new-student-grade").find(":selected").val()) {
      grade = $("#new-student-grade").find(":selected").val();
    }
    if ($("#new-student-personal-email").val()) {
      personalEmail = $("#new-student-personal-email").val();
    }
    if ($("#new-student-custom-id").val()) {
      customID = $("#new-student-custom-id").val();
    }
    newStudent(
      firstName,
      lastName,
      status,
      grade,
      schoolEmail,
      personalEmail,
      customID
    );
  });
}

if (editStudentForm) {
  $(editStudentForm).on("submit", (e) => {
    e.preventDefault();
    let grade = null,
      personalEmail = null,
      customID = null;
    const firstName = $("#edit-student-first-name").val();
    const lastName = $("#edit-student-last-name").val();
    const status = $("#edit-student-status").val();
    const schoolEmail = $("#edit-student-school-email").val();
    if ($("#edit-student-grade").find(":selected").val()) {
      grade = $("#edit-student-grade").find(":selected").val();
    }
    if ($("#edit-student-personal-email").val()) {
      personalEmail = $("#edit-student-personal-email").val();
    }
    if ($("#edit-student-custom-id").val()) {
      customID = $("#edit-student-custom-id").val();
    }
    const id = $("#edit-student").attr("data-student");
    editStudent(
      firstName,
      lastName,
      status,
      grade,
      schoolEmail,
      personalEmail,
      customID,
      id
    );
  });
}

// Check Out (DONE: 2021-02-12T19:09:33Z)
if ($(checkOutForm)) {
  const gradeSelect = $("#check-out-grade");
  const validateSubmit = (submit) => {
    const grade = $(gradeSelect).val();
    // 1.) Is Grade Picked
    if ($(gradeSelect).val() < 0) {
      $("#checkout-button").prop("disabled", true);
      return false;
    }
    // 2.) Is Student Picked
    let lastUser = $(`select.student-list[value="${grade}"]`).val();
    if (lastUser == "-1") {
      $("#checkout-button").prop("disabled", true);
      return false;
    }
    // 3.) Is there a checkout date & is it valid
    let lastCheckOut = $("#checkout-date").val();
    if ($("#checkout-date-checker").is(":checked")) {
      if (
        !lastCheckOut ||
        new Date(lastCheckOut).getTime() > new Date(Date.now()).getTime()
      ) {
        $("#checkout-button").prop("disabled", true);
        lastCheckOut = "";
        return false;
      } else lastCheckOut = new Date(lastCheckOut).toISOString();
    } else lastCheckOut = "";
    // 4.) Is there a due date & is it valid
    let dueDate = $("#due-date").val();
    if ($("#due-date-checker").is(":checked")) {
      if (
        !dueDate ||
        new Date(dueDate).getTime() < new Date(Date.now()).getTime()
      ) {
        $("#checkout-button").prop("disabled", true);
        dueDate = "";
        return false;
      } else dueDate = new Date(dueDate).toISOString();
    } else dueDate = "";
    if (submit !== "submit") $("#checkout-button").prop("disabled", false);
    const data = {
      lastUser,
      lastCheckOut,
      dueDate,
    };
    return data;
  };

  let changeValue;
  $(gradeSelect).change(function () {
    if ($(gradeSelect).val() == -1) {
      $("select.student-list").css("display", "none");
      $('select.student-list[value="-1"]').css("display", "block");
    } else {
      changeValue = $(gradeSelect).val();
      // Hide all Student Lists
      $("select.student-list").css("display", "none");
      // Show Correct Grade List
      $(`select.student-list[value="${changeValue}"]`).css("display", "block");
    }
    validateSubmit();
  });

  $(".student-list").change(function () {
    validateSubmit();
  });

  $("#checkout-form .date-wrapper input[type='checkbox']").on(
    "change",
    function () {
      toggleDateHolder($(this));
      validateSubmit();
    }
  );

  $("#checkout-form .fakebox").on("click", function () {
    $(this).next().trigger("click");
  });

  $("#checkout-form .date-wrapper input[type='text']").on(
    "change",
    function () {
      fakeboxFormat($(this));
      validateSubmit();
    }
  );

  $(checkOutForm).on("submit", async function (e) {
    e.preventDefault();
    checkOutForm.find("input[type='submit']").prop("disabled", true);
    const data = validateSubmit("submit");
    if (data) {
      const { lastUser, lastCheckOut, dueDate } = data;
      const success = await checkOutDevice(lastUser, lastCheckOut, dueDate);
      if (!success)
        checkOutForm.find("input[type='submit']").prop("disabled", false);
    }
  });
}

// Check In (DONE: 2021-02-12T22:51:29Z)
if (checkInForm) {
  Object.freeze($("#checkin-date").data());
  const checkOutDate = $("#checkin-date").data("checkout-date");
  /**
   * Returns if submit button should be disabled
   */
  const testFields = (submit) => {
    let disable = false;
    const $button = $("#checkin-button");
    if ($("input[name='Check In Status']:checked").val() === "Error")
      $("#error-text-fields-checkin .form-text-field").each(function () {
        if ($(this).val().length < 1) {
          disable = true;
          return;
        }
      });
    else if ($("input[name='Check In Status']:checked").val() !== "Fine")
      disable = true;
    if ($("#checkin-date-checker").is(":checked")) {
      if ($("#checkin-date").val()) {
        const dateEl = $("#checkin-date");
        const datePicked = new Date(dateEl.val()).toISOString();
        if (
          !moment(datePicked).isBetween(dateEl.data("checkout-date"), undefined)
        )
          disable = true;
      } else disable = true;
    }
    if (submit !== "submit")
      disable
        ? $button.prop("disabled", true)
        : $button.prop("disabled", false);
    return disable;
  };

  // Show Character Count
  $("#checkin-error-description").on("input", function () {
    $(this).next().find("span").text($(this).val().length);
  });

  // Error Pop Into View
  $("input[name='Check In Status']").on("change", function () {
    let $errorFields = $("#error-text-fields-checkin");
    // If error, show errror box
    if ($("input[name='Check In Status']:checked").val() == "Error")
      $errorFields.slideDown(750);
    else $errorFields.slideUp(750);
    testFields();
  });

  $("#error-text-fields-checkin .form-text-field").on("input", function () {
    if ($("input[name='Check In Status']:checked").val() == "Error") {
      testFields();
    }
  });

  const afterCheckout = (el) => {
    const setDate = new Date($(el).val()).toISOString();
    if (moment(setDate).diff(checkOutDate) <= 0) {
      $(el).prev().css("color", "red");
      return false;
    } else {
      $(el).prev().css("color", "cornflowerblue");
      return true;
    }
  };

  $("#checkin-form .date-wrapper input[type='checkbox']").on(
    "change",
    function () {
      toggleDateHolder($(this));
      testFields();
    }
  );

  $("#checkin-form .fakebox").on("click", function () {
    $(this).next().trigger("click");
  });

  $("#checkin-form .date-wrapper input[type='text']").on("change", function () {
    fakeboxFormat($(this)) && afterCheckout($(this));
    testFields();
  });

  $(checkInForm).on("submit", async function (e) {
    e.preventDefault();
    $(this).find("input[type='submit']").prop("disabled", true);
    const status = $("input[name='Check In Status']:checked").val();
    let success;
    if (status) {
      let checkInDate;
      if ($("#checkin-date-checker").is(":checked"))
        checkInDate = new Date($("#checkin-date").val()).toISOString();
      if (status === "Error") {
        if (!testFields("submit")) {
          const title = $("#checkin-error-title").val();
          const description = $("#checkin-error-description").val();
          success = await checkInDevice(true, checkInDate, title, description);
        }
      } else success = await checkInDevice(false, checkInDate);
      if (!success)
        $(this).find("input[type='submit']").prop("disabled", false);
    }
  });
}

// Check In (DONE: 2021-02-13T00:03:15Z)
if (updateErrorForm) {
  const testFields = (submit) => {
    const $button = $("#update-error-button");
    const $statusCheck = $("input[name='Update Status']").is(":checked");
    const $descCheck = $("#update-error-description").val().length > 0;
    const $idCheck = $("#select-current-error").val();
    if ($statusCheck && $descCheck && $idCheck) {
      if (submit !== "submit") $button.prop("disabled", false);
      return true;
    }
    if (submit !== "submit") $button.prop("disabled", true);
    return false;
  };

  // On Status Change
  $("input[name='Update Status']").on("change", function () {
    $("input[name='Update Status']").each(function () {
      if ($(this).is(":checked")) {
        $(this).closest(".chip").addClass("selected");
        if ($(this).val() === "Fixed" || $(this).val() === "Unfixable") {
          const message =
            '*Updating this error to "' +
            $(this).val() +
            '" will finalize the error';
          $(".pop-text").empty();
          $(".pop-text").append(message);
        } else $(".pop-text").empty();
      } else $(this).closest(".chip").removeClass("selected");
    });
    testFields();
  });

  // On description Change
  $("#update-error-description").on("input", function () {
    // Show Character Count
    $(this).next().find("span").text($(this).val().length);
    testFields();
  });

  $(updateErrorForm).on("submit", async function (e) {
    e.preventDefault();
    $(this).find("input[type='submit']").prop("disabled", true);
    const errorId = $("#select-current-error").val();
    const status = $("input[name='Update Status']:checked").val();
    const description = $("#update-error-description").val();
    if (testFields("submit")) {
      const success = await updateError(errorId, status, description);
      console.log(success);
      if (!success)
        $(this).find("input[type='submit']").prop("disabled", false);
    }
  });

  function waveTrigger(event) {
    // Get clicked element
    const $element = event.target;
    // Create ripple element and append to $element
    let $waves = document.createElement("div");
    $waves.classList.add("waves-ripple");

    // Position waves where we clicked
    $waves.style.left = event.offsetX + "px";
    $waves.style.top = event.offsetY + "px";
    $element.appendChild($waves);

    // Wait a tick!
    $waves.offsetWidth;

    // Then begin ripple effect.
    const elementWidth = $element.offsetWidth;
    const elementHeight = $element.offsetHeight;
    const scale =
      (Math.max(elementHeight, elementWidth) /
        Math.min(elementHeight, elementWidth)) *
      1.53;
    $waves.style.transform = "scale(" + scale + ")";
    $waves.style.opacity = "1";
    $waves.dataset.waving = "true"; // This is to keep track

    // Kill the ripple eventually.
    setTimeout(function () {
      $waves.dataset.waving = "";
    }, 350);
  }

  function waveCheckRelease($element) {
    let isStillWaving;

    // Loop through all ripples
    [].slice
      .call($element.getElementsByClassName("waves-ripple"))
      .forEach(function ($wave) {
        // Check if they're still going.
        if ($wave.dataset.waving) {
          isStillWaving = 1;
        } else {
          // Remove it if not.
          $wave.remove();
        }
      });

    // If anything is still going, check again.
    if (isStillWaving) {
      setTimeout(function () {
        waveCheckRelease($element);
      }, 20);
    }
  }

  // Bind clicks to trigger/cancel effect
  function onMouseDown(event) {
    let $target = event.target;

    // Check if this element needs the wave-effect + trigger it if so.
    if ($target.classList.contains("waves-effect")) {
      waveTrigger(event);
    }
  }

  function onMouseUp(event) {
    let $target = event.target;

    // Begin checking for whether or not this effect has ended
    if ($target.classList.contains("waves-effect")) {
      waveCheckRelease($target);
    }
  }

  document.addEventListener("mousedown", onMouseDown, { passive: true });
  document.addEventListener("mouseup", onMouseUp, { passive: true });
  document.addEventListener("mouseout", onMouseUp);
}

if (createErrorForm) {
  const testErrorFields = (submit) => {
    let disable = false;
    const $button = $("#create-error-button");
    $("#error-text-fields-create .form-text-field").each(function () {
      if ($(this).val().length < 1) {
        disable = true;
        return;
      }
    });
    const errorDate = $("#error-date").val();
    if ($("#error-date-checker").is(":checked")) {
      if (!errorDate) disable = true;
      if (new Date(errorDate).getTime() > new Date(Date.now()).getTime())
        disable = true;
    }

    if (submit !== "submit") {
      if (disable) {
        $button.prop("disabled", true);
      } else {
        $button.prop("disabled", false);
      }
    }
    return disable;
  };

  // Show Character Count
  $("#create-error-description").on("input", function () {
    $(this).next().find("span").text($(this).val().length);
  });

  $("#error-text-fields-create .form-text-field").on("input", testErrorFields);

  $("#create-error-form .date-wrapper input[type='checkbox']").on(
    "change",
    function () {
      toggleDateHolder($(this));
      testErrorFields();
    }
  );

  $(".fakebox").on("click", function () {
    $(this).next().trigger("click");
  });

  $("#create-error-form .date-wrapper input[type='text']").on(
    "change",
    function () {
      fakeboxFormat($(this));
      testErrorFields();
    }
  );

  $("#new-error-button").on("click", function () {
    $(this).hide();
    $("#error-text-fields-create").fadeIn(250);
    $(this).siblings(".nothing").hide();
    $("html, body").animate(
      { scrollTop: $(".create-error-form-wrapper").offset().top - 100 },
      1200
    );
  });

  $("#cancel-create-new-error").on("click", function () {
    $(this).closest("#error-text-fields-create").slideUp(1000);
    $(".device-error-log-container .nothing").show(200);
    $("#new-error-button").show();
  });

  $(createErrorForm).on("submit", async function (e) {
    e.preventDefault();
    $(this).find("input[type='submit']").prop("disabled", true);
    const title = $("#create-error-title").val();
    const description = $("#create-error-description").val();
    const errorDate = $("#error-date").val();
    let createdAt;
    if ($("#error-date-checker").is(":checked")) {
      createdAt = new Date(errorDate).toISOString();
    }
    if (!testErrorFields("submit")) {
      const success = await createError(title, description, createdAt);
      console.log(success);
      if (!success)
        $(this).find("input[type='submit']").prop("disabled", false);
    }
  });
}

$(firstPasswordForm).on("submit", function (e) {
  e.preventDefault();
  const password = $("#first-password").val();
  const passwordConfirm = $("#first-password-confirm").val();
  updatePassword(password, passwordConfirm);
});

$(".go-to-error").on("click", function () {
  const errorId = $(this).data("error-id");
  const errorRow = $("#" + errorId);
  if ($(errorRow).attr("data-expanded") == false) {
    $(errorRow).find(".expand_more").trigger("click");
  } else {
    $("html, body").animate(
      { scrollTop: $(errorRow).offset().top - 100 },
      1200
    );
  }
  $(errorRow).addClass("blinking-row").next().addClass("blinking-row");

  window.setTimeout(() => {
    $(errorRow).removeClass("blinking-row").next().removeClass("blinking-row");
  }, 4000);
});
