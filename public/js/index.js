import "@babel/polyfill";
import { newUser, editUser } from "./user";
import { newStudent, editStudent } from "./student";
import { updatePassword } from "./password";
import { addDevice, checkInDevice, checkOutDevice, editDevice } from "./device";

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

if (loginForm) {
  $(loginForm).on("submit", (e) => {
    e.preventDefault();
    const email = $("input#login-email").val();
    const password = $("input#login-password").val();
    login(email, password);
  });
}

if (logOutBtn) $(logOutBtn).on("click", logout);

if (editDeviceForm) {
  $(editDeviceForm).on("submit", (e) => {
    e.preventDefault();
    const name = $("#edit-device-name").val();
    const brand = $("#edit-device-brand").val();
    const model = $("#edit-device-model").val();
    const serialNumber = $("#edit-device-sn").val();
    const macAddress = $("#edit-device-mac").val();
    const status = $("#edit-device-status").find(":selected").val();
    editDevice(name, brand, model, serialNumber, macAddress, status);
  });
}

if (addDeviceForm) {
  $(addDeviceForm).on("submit", (e) => {
    e.preventDefault();
    const name = $("#create-device-name").val();
    const brand = $("#create-device-brand").val();
    const model = $("#create-device-model").val();
    const serialNumber = $("#create-device-sn").val();
    const macAddress = $("#create-device-mac").val();
    const status = $("#create-device-status").find(":selected").val();
    addDevice(name, brand, model, serialNumber, macAddress, status);
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

// Check Out
if ($(checkOutForm)) {
  const gradeSelect = $("#check-out-grade");
  let changeValue;
  $(gradeSelect).change(function () {
    if ($(gradeSelect).val() == -1) {
      $("select.student-list").css("display", "none");
      $('select.student-list[value="-1"]').css("display", "block");
      $(".checking-button").addClass("disabled");
    } else {
      changeValue = $(gradeSelect).val();
      // Hide all Student Lists
      $("select.student-list").css("display", "none");
      // Show Correct Grade List
      $(`select.student-list[value="${changeValue}"]`).css("display", "block");
    }

    if (
      $(gradeSelect).val() == -1 ||
      $(`select.student-list[value="${changeValue}"]`).val() == -1 ||
      $(`select.student-list[value="${changeValue}"]`).val() == undefined
    ) {
      $(".checking-button").addClass("disabled");
    } else {
      $(".checking-button").removeClass("disabled");
    }
  });

  $(".student-list").change(function () {
    changeValue = $(gradeSelect).val();
    if (
      $(gradeSelect).val() == -1 ||
      $(`select.student-list[value="${changeValue}"]`).val() == -1 ||
      $(`select.student-list[value="${changeValue}"]`).val() == undefined
    ) {
      $(".checking-button").addClass("disabled");
    } else {
      $(".checking-button").removeClass("disabled");
    }
  });

  $(checkOutForm).on("submit", (e) => {
    e.preventDefault();
    changeValue = $(gradeSelect).val();
    const studentId = $(`select.student-list[value="${changeValue}"]`).val();
    if (changeValue != -1 && studentId != -1) {
      checkOutDevice(studentId)
    }
  });
}

// Check In
if (checkInForm) {
  $("#checkin-checkbox").change(function () {
    if (this.checked) {
      $(".checking-button").removeClass("disabled");
    } else $(".checking-button").addClass("disabled");
  });

  $(checkInForm).on("submit", function (e) {
    e.preventDefault();
    if ($("#checkin-checkbox").is(":checked")) {
      const deviceId = $(checkInForm).attr("data-device");
      checkInDevice();
    }
  });
}

$(firstPasswordForm).on("submit", function (e) {
  e.preventDefault();
  const password = $("#first-password").val();
  const passwordConfirm = $("#first-password-confirm").val();
  updatePassword(password, passwordConfirm);
});
