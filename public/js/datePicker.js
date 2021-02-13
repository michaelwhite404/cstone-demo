$(".date-wrapper input[type='checkbox']").on("change", function (evt) {
  const checkbox = $(evt.target);
  const dateHolder = $(checkbox).closest(".date-wrapper").find(".date-holder");
  if ($(checkbox).is(":checked")) {
    $(dateHolder).show();
    return;
  }
  $(dateHolder).hide();
});

$(".fakebox").on("click", function () {
  $(this).next().trigger("click");
});

$(".date-wrapper input[type='text']").on("change", function () {
  const dateStr = $(this).val();
  const date = new Date(dateStr).toLocaleString();
  const dateText = $(this).prev().find(".date-text");
  $(dateText).text(date);
  if ($(this).data("invalid") === "future")
    if (new Date(dateStr).getTime() > new Date(Date.now()).getTime())
      $(this).prev().css("color", "red");
    else $(this).prev().css("color", "cornflowerblue");
  if ($(this).data("invalid") === "past")
    if (new Date(dateStr).getTime() < new Date(Date.now()).getTime())
      $(this).prev().css("color", "red");
    else $(this).prev().css("color", "cornflowerblue");
});
