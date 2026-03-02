"use strict";

var currentHtmlAddress;
var currentFormHtml;
var errorTitle;
var email;
var input = 0;
$(document).ready(function () {
  $(document).on('click', '#promo_code_btn_id', function () {
    var code = $('#promo_code_id').val();
    $('#promo_code_id').val('');

    if (code) {
      $.post('/promo-code', {
        code: code
      }, function (response) {
        if (!response.err) {
          haveSpecialCode(response);
        } else {
          promoCodeError(response.err);
        }
      });
    }
  });
  var price = localStorage.getItem('price');

  if (!price) {
    window.location.href = '/';
  }

  var formIsVisible = $('#address_div_id').is(':visible');

  if (formIsVisible) {
    input = 0;
    $('#newAddressId').css('display', 'none');
    $("#address_div_id").find('input').each(function () {
      if ($(this).val() == '') {
        input = 1;
      }

      return false;
    });

    if (input == 1) {
      $('#newAddressId').remove();
    } // ovde se brisalo newAddressId

  }

  $(document).on('click', '#Change_address_order_btn', function () {
    $('#newAddressId').css('display', 'block');
    $('#address_div_id').css('display', 'none');
  });
  $(document).on('click', '#Undo_address_order_btn', function () {
    $('#newAddressId').css('display', 'none');
    $('#address_div_id').css('display', 'block');
  });
  $(document).on('click', '#delete_promo_code_id', function () {
    localStorage.removeItem('specailCode');
    clearPromoCode();
    getDiscountCommon();
  });
  $(document).on('click', '#save_address_order_btn', function () {
    var url = '/address/edit';
    var form = $('#final_form_cart').filter(":visible");
    var empty = 0;
    var errorTitle = '';
    var dontHaveEmail = 0;
    $(form).find('input').each(function () {
      input = $(this).val();

      if ($(this).val() == '' && $(this).attr('name') != 'email') {
        if ($(this).attr('placeholder') != 'Unesite promo kod') {
          empty = 1;
          errorTitle = $(this).attr('placeholder');
        }
      }

      if ($(this).attr('name') == 'phone') {
        var someVal = $(this).val().replace(/[^0-9\.]+/g, '');

        if (!someVal.startsWith('06')) {
          showPopUp({
            title: "Greška",
            text: 'Unesite broj mobilnog telefona u formatu 06xxxx...',
            btn1_value: "OK",
            btn1_callback: null,
            btn2_value: null,
            btn2_callback: null
          });
          $(this).val('');
          empty = 2;
          return false;
        }
      }

      if ($(this).attr('name') == 'email') {
        var email = $(this).val();

        if (email) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          email = re.test(String(email).toLowerCase().trim());

          if (!email) {
            dontHaveEmail = 1;
            showPopUp({
              title: "Greška",
              text: "Unesite ispravnu email adresu",
              btn1_value: "OK",
              btn1_callback: null,
              btn2_value: null,
              btn2_callback: null
            });
            return false;
          }
        }
      }
    });

    if (empty == 1 && dontHaveEmail == 0 && errorTitle != 'Unesite promo kod') {
      showPopUp({
        title: "Greška",
        text: errorTitle,
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return false;
    }

    if (empty == 0 && dontHaveEmail == 0) {
      $.ajax({
        type: 'GET',
        url: url,
        // or whatever
        data: form.serialize(),
        success: function success(response) {
          $('#newAddressId').css('display', 'none');
          $('#address_div_id').css('display', 'block');
          updateAddres(response);
        }
      });
    }
  });
});

function updateAddres(response) {
  var html = "\n            <p>Ime: ".concat(response.firstName, " </p>\n            <p>Prezime: ").concat(response.lastName, " </p>\n            <p>Grad: ").concat(response.city, " </p>\n            <p>Ulica: ").concat(response.address, "</p>\n            <p>Po\u0161tanski broj: ").concat(response.postalCode, " </p>\n            <p>Email: ").concat(response.email, " </p>\n            <p>Telefon: ").concat(response.phone, " </p>\n            \n            <button id=\"Change_address_order_btn\" class=\"black-button button\" type=\"button\">\n                <img src=\"images/icons/plus-icon.png\" alt=\"Icon\">\n                <p>Promenite adresu za dostavu</p>\n            </button>\n        ");
  $('#address_div_id').html(html);
}

function realoadCheckout() {
  var priceObj = localStorage.getItem('price');
  priceObj = JSON.parse(priceObj);

  if (priceObj.price == 0 || !priceObj) {
    window.location.href = '/';
  }

  priceObj = JSON.parse(localStorage.getItem('price'));
  $('#checkout_subtotal').html(parseFloat(priceObj.price).toFixed(2) + ' RSD');
  $('#checkout_shipping').html(parseFloat(priceObj.shipping).toFixed(2) + ' RSD');

  if (priceObj.price + priceObj.finalDiscountPrice == 0) {
    window.location.href = '/';
  } else if (priceObj.finalPrice) {
    $('#checkout_total').html(parseFloat(priceObj.finalPrice).toFixed(2) + ' RSD');
    $('#checkout_subtotal').html(parseFloat(priceObj.pricepriceObj.finalPrice - priceObj.shipping).toFixed(2) + ' RSD');
  } else {
    $('#checkout_total').html(parseFloat(priceObj.price + priceObj.shipping).toFixed(2) + ' RSD');
  }
}