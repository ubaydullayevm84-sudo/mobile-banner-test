"use strict";

$(document).ready(function () {

  sendVisitData();

  $('#inputButton').on('click', function () {
    var email = $('#inputEmail').val().trim();
    var email2 = email;
    $('#inputEmail').val('');
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email = re.test(String(email).toLowerCase().trim());

    if (!email) {
      showPopUp({
        title: "Greška",
        text: "Unesite validnu email adresu na koju želite da vam pošaljemo promo kod",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return;
    } else {
      var pathname = window.location.pathname;
      $.post('/sendCodeEmail', {
        email2: email2,
        pathname: pathname
      }, function (response) {
        var title = 'Kod je poslat';

        if (response && response.startsWith('Ovaj')) {
          title = 'Greška';
        }

        if (response) {
          showPopUp({
            title: title,
            text: response,
            btn1_value: "OK",
            btn1_callback: null,
            btn2_value: null,
            btn2_callback: null
          });
        }
      });
    }
  });
});