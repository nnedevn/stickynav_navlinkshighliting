'use strict';

/*global
$, window, document
*/

// Adds the sticky nav class
function stickyNav() {

  var scrollToTop = $(window).scrollTop();
  // if navOffset exists and scrollToTop is greater, add .fixedNav
  if (navOffset && scrollToTop > navOffset.top) {
    $('.secondaryNav')
        .addClass('fixedNav');
  } else {
    $('.secondaryNav')
        .removeClass('fixedNav');
  }
}

//Dynamically resizes the nav to math the width of a tag(h4 in this case);
function navResize() {
  var divWidth = ($('h4').width());
  $('.secondaryNav').width(divWidth);

}

// Cache selectors
var lastId,
    topMenu = $('.secondaryNav'),
    topMenuHeight = topMenu.outerHeight() + 0,
    // All list items
    menuItems = topMenu.find('a'),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function () {
      var item = $($(this).attr('href'));

      if (item.length) {
        return item;
      }
    });

// declare a var that will be undefined if .secondaryNav does not exist.
var navOffset = $('.secondaryNav').offset();

//resize the nav if there is a nav
if (navOffset) {
  $(window).resize(function () {
    navResize();
  });

}

// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function (e) {
  var href = $(this).attr('href'),
      offsetTop = href === '#' ? 0 : $(href).offset().top - topMenuHeight + 1;
  //TODO: Add animate to the CSS class
  $('html, body').stop().animate({
    scrollTop: offsetTop
  }, 300);
  e.preventDefault();
});

// Bind to scroll
$(window).scroll(function () {
  navResize();
  stickyNav();
  // Get container scroll position
  var fromTop = $(this).scrollTop() + topMenuHeight + 200;
  // Get id of current scroll item

  var cur = scrollItems.map(function () {
    if ($(this).offset().top < fromTop){
      return this;
    }
  });
  // Get the id of the current element
  cur = cur[cur.length - 1];

  var id = cur && cur.length ? cur[0].id : '';

  if (lastId !== id && id !== '') {
    menuItems.filter("[href='#" + lastId + "']").parent().removeClass("current");
    lastId = id;
    menuItems.filter("[href='#" + id + "']").parent().addClass("current");
  }
});

//check if there is an # in the URL and add the highlighting accordingly(Avoid double highlighting if the URL contains an ID)
$(window).on('DOMContentLoaded load', function () {

  var idInUrlIndex = document.location.href;

  if (idInUrlIndex.indexOf('#') > -1) {
    //set the nav to the appropriate size.
    navResize();
    var idInUrlId = document.location.href.slice(idInUrlIndex.indexOf('#'));
    menuItems.filter("[href='" + idInUrlId + "']").parent().siblings().removeClass("current");
  }
});
