"use strict";

/********** For Pricing Slider **********/
var swiper = new Swiper('.swiper-container', {
  effect: 'coverflow',
  initialSlide: 1,
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: true
  }
});
/*############# ON SCROLL ADD FIXED HEADER ############*/

$(window).ready(function () {
  var scrollTop;
  $(window).scroll(function () {
    scrollTop = $(window).scrollTop();

    if (scrollTop >= 80) {
      $('.navbar').addClass('fixed-nav');
      $('.c').addClass('page-scrolled');
      $('.home-banner').addClass('page-scrolled');
    } else if (scrollTop < 80) {
      $('.navbar').removeClass('fixed-nav');
      $('.sub-pages-banner').removeClass('page-scrolled');
      $('.home-banner').removeClass('page-scrolled');
    }
  });
});
/*########## QUANTITY INCREMENT & DECREMENT ##########*/

$(document).ready(function () {
  var quantitiy = 0;
  $('.quantity-right-plus').click(function (e) {
    // Stop acting like a button
    e.preventDefault(); // Get the field name

    var quantity = parseInt($('#quantity').val()); // If is not undefined

    $('#quantity').val(quantity + 1); // Increment
  });
  $('.quantity-left-minus').click(function (e) {
    // Stop acting like a button
    e.preventDefault(); // Get the field name

    var quantity = parseInt($('#quantity').val()); // If is not undefined
    // Increment

    if (quantity > 0) {
      $('#quantity').val(quantity - 1);
    }
  });
}); // Activate the tooltip 

$(function () {
  $("[rel='tooltip']").tooltip();
});
/*######## ON SCROLL PRODUCT TABS #########*/

$(window).scroll(function () {
  var scrollTop = $(window).scrollTop();
  var productContentHeight = $('.products-section .tab-content').outerHeight();
  var productHeaderHeight = $('.product-page-banner').outerHeight();
  var navHeight = $('header .fixed-nav').outerHeight();
  var productTabsHeight = $('.product-tabs').outerHeight();
  var productHeightTotal = productContentHeight + productHeaderHeight - navHeight - productTabsHeight;

  if (scrollTop >= productHeightTotal + 20) {
    $('.product-tabs').addClass('stick-tabs');
    $('.product-tabs').removeClass('fixed-tabs');
  } else if (scrollTop <= productHeightTotal + 20) {
    $('.product-tabs').removeClass('stick-tabs');
    $('.product-tabs').addClass('fixed-tabs');
  }

  if (scrollTop >= productHeaderHeight - 20) {
    $('.product-tabs').addClass('fixed-tabs');
    /*-- SETTING WIDTH OF FIXED TABS --*/

    var tabsWidth = $('.products-section .nav-pills').width();
    document.querySelector('.fixed-tabs').style.width = tabsWidth + "px";
  } else if (scrollTop < productHeaderHeight - 20) {
    $('.product-tabs').removeClass('fixed-tabs');
  }
});