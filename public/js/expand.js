const open = (el) => {
  $(el).closest("tr").next().find("td").animate({padding: 25}, 250);
  $(el).next().find(".more-error-info").delay(250).animate({opacity: 1}, 500);
  $(el).next().find(".more-error-info").slideDown({ duration: 750, queue: false });
  $('html, body').animate({ scrollTop: $(el).offset().top - 100 }, 1200);
  $(el).attr("data-expanded", 1);
}

const close = (el) => {
  $(el).next().find(".more-error-info").animate({opacity: 0}, { duration: 250, queue: false });
  $(el).next().find(".more-error-info").slideUp({ duration: 750, queue: false });
  $(el).closest("tr").next().find("td").delay(250).animate({padding: 0}, 500);
  $(el).attr("data-expanded", 0);
}

$(".expand_more").on("click", function() {
  const $tr = $(this).closest("tr");
  if ($tr.attr("data-expanded") == 1) {
    close($tr);
    $(this).css({'transform' : 'rotate(0deg)'});
  } else {
    open($tr);
    $(this).css({'transform' : 'rotate(-180deg)'});
  }
});