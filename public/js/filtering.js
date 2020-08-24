var searching = false;
var checking = false;
var passedSearch, passedCheck;

$("#chromebook-search-input").on("input", function () {
  searching = $(this).val() ? true : false;
  filtering();
});

$(".available-checkbox").change(function () {
  checking = this.checked;
  filtering();
});

const testSearch = (text) => {
  if (searching === false) return true;
  if (text.slice(-1) === ">") text = text.slice(0, -11);
  var input = $("#chromebook-search-input").val();
  return text.toLowerCase().includes(input.toLowerCase());
};

const testCheckAvailable = (el) => {
  if (checking === false) return true;
  var available =
    $(el).find(":nth-child(5)").text() === "Available" ? true : false;
  return available;
};

const filtering = () => {
  var count = 0;
  $(".database-table tbody tr").each(function () {
    text = $(this).text();
    if (testSearch(text) && testCheckAvailable($(this))) {
      $(this).css("display", "table-row");
      count++;
    } else {
      $(this).css("display", "none");
    }
  });
  console.log(count);
};
