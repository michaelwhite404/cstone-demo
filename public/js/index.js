import "@babel/polyfill";
import { login, logout } from "./login";
import { newUser, editUser } from "./user";
import { newStudent, editStudent } from "./student";
import { updatePassword } from "./password";
import { addDevice, checkInDevice, checkOutDevice, createError, editDevice, updateError } from "./device";

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

$("form").on("submit", function() {
  const spinner = "<div class='spinner'><div class='inner one'></div><div class='inner two'></div><div class='inner three'></div></div>";
  const currentButton = $(this).find('input[type=submit]')
  $(currentButton).replaceWith(spinner);
  currentButton.prop("disabled", true);
  window.setInterval(() => {
    $(".spinner").replaceWith(currentButton)
  }, 2500)
});

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
  /**
   * Returns if submit button should be disabled
   */
  const testErrorFields = () => {
    let disable = false;
    const $button = $("#checkin-button");
    $("#error-text-fields-checkin .form-text-field").each(function() {
      if($(this).val().length < 1) {disable = true; return;}
    });
    disable ? $button.addClass("disabled") :  $button.removeClass("disabled");
    return disable;
  }

  // Show Character Count
  $("#checkin-error-description").on("input", function() {
    $(this).next().find("span").text($(this).val().length);
  });

  // Error Pop Into View
  $("input[name='Check In Status']").on("change", function() {
    let $errorFields = $("#error-text-fields-checkin");
    // If error, show errror box
    if ($("input[name='Check In Status']:checked").val() == "Error") {
      $errorFields.slideDown(750);
      testErrorFields();
    } else {
      $errorFields.slideUp(750);
      $(".checking-button").removeClass("disabled");
    } 
  });

  $("#error-text-fields-checkin .form-text-field").on("input", function() {
    if ($("input[name='Check In Status']:checked").val() == "Error") {
      testErrorFields();
    }
  }); 

  $(checkInForm).on("submit", function (e) {
    e.preventDefault();
    const status = $("input[name='Check In Status']:checked").val()
    if (status) {
      if (status === "Error") {
        if(!testErrorFields()) {
          const title = $("#checkin-error-title").val();
          const description = $("#checkin-error-description").val();
          checkInDevice(true, title, description)
        }
      } else checkInDevice(false);
    }
  });
}

if (updateErrorForm) {
  const testFields = () => {
    const $button = $("#update-error-button");
    const $statusCheck = $("input[name='Update Status']").is(":checked");
    const $descCheck = $("#update-error-description").val().length > 0;
    const $idCheck = $('#select-current-error').val();
    if ($statusCheck && $descCheck && $idCheck) {
      $button.removeClass("disabled");
      return true;
    }
    $button.addClass("disabled");
    return false;
  }

  // On Status Change
  $("input[name='Update Status']").on("change", function() {
    $("input[name='Update Status']").each(function() {
      if ($(this).is(":checked")) {
        $(this).closest(".chip").addClass("selected");
        if ($(this).val() === "Fixed" || $(this).val() === "Unfixable") {
          const message = '*Updating this error to "' + $(this).val() + '" will finalize the error';
          $(".pop-text").empty();
          $(".pop-text").append(message);
        } else $(".pop-text").empty();
      }
      else $(this).closest(".chip").removeClass("selected");
    });
    testFields();
  });

  // On description Change
  $("#update-error-description").on("input", function() {
    // Show Character Count
    $(this).next().find("span").text($(this).val().length);
    testFields();
  });

  $(updateErrorForm).on("submit", function(e) {
    e.preventDefault();
    const errorId = $('#select-current-error').val();
    const status = $("input[name='Update Status']:checked").val();
    const description = $("#update-error-description").val();
    if (testFields()) updateError(errorId, status , description)
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
    const scale = Math.max(elementHeight, elementWidth) / Math.min(elementHeight, elementWidth) * 1.53;
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
    [].slice.call($element.getElementsByClassName("waves-ripple")).forEach(function ($wave) {

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


  document.addEventListener("mousedown", onMouseDown, {passive: true});
  document.addEventListener("mouseup", onMouseUp, {passive: true});
  document.addEventListener("mouseout", onMouseUp); 
}

if (createErrorForm) {
  const testErrorFields = () => {
    let disable = false;
    const $button = $("#create-error-button");
    $("#error-text-fields-create .form-text-field").each(function() {
      if($(this).val().length < 1) {disable = true; return;}
    });
    disable ? $button.addClass("disabled") :  $button.removeClass("disabled");
    return disable;
  }

  // Show Character Count
  $("#create-error-description").on("input", function() {
    $(this).next().find("span").text($(this).val().length);
  });

  $("#error-text-fields-create .form-text-field").on("input", testErrorFields); 

  $("#new-error-button").on("click", function() {
    $(this).hide();
    $("#error-text-fields-create").fadeIn(250);
    $(this).siblings(".nothing").hide();
    $('html, body').animate({ scrollTop: $(".create-error-form-wrapper").offset().top - 100 }, 1200);
  });

  $("#cancel-create-new-error").on("click", function() {
    $(this).closest("#error-text-fields-create").slideUp(1000);
    $(".device-error-log-container .nothing").show(200);
    $("#new-error-button").show();
  });

  $(createErrorForm).on("submit", function (e) {
    e.preventDefault();
    const title = $("#create-error-title").val();
    const description = $("#create-error-description").val();
    if(!testErrorFields()) createError(title, description)
  });
}

$(firstPasswordForm).on("submit", function (e) {
  e.preventDefault();
  const password = $("#first-password").val();
  const passwordConfirm = $("#first-password-confirm").val();
  updatePassword(password, passwordConfirm);
});

$(".go-to-error").on("click", function() {
  const errorId = $(this).data("error-id");
  const errorRow = $("#" + errorId);
  if ($(errorRow).attr("data-expanded") == false) {
    $(errorRow).find(".expand_more").trigger("click");
  } else {
    $('html, body').animate({ scrollTop: $(errorRow).offset().top - 100 }, 1200);
  }
  $(errorRow).addClass("blinking-row").next().addClass("blinking-row");

  window.setTimeout(() => {
    $(errorRow).removeClass("blinking-row").next().removeClass("blinking-row");
  }, 4000);
});