"use strict";

$(document).ready(function () {
  var supportsLocalStorage = supports_html5_storage();
  $(document).on('click', '#login_p_id', function () {
    var currentPage = window.location.pathname;
    localStorage.setItem('previousUrl', currentPage);
    window.location.href = '/login';
  });
  $(document).on('click', '#upload_photos_btn, #upload_photos_btn_index', function () {
    window.location.href = '/posaljite-fotografije';
  });
});

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}