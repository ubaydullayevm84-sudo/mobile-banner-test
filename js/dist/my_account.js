"use strict";

var statusTranslations = {
  "ORDERED": "PORUČENO",
  "TO DOWNLOAD": "SPREMNO ZA IZRADU",
  "READY TO PRINT": "SPREMNO ZA IZRADU",
  "PRINTED": "ODŠTAMPANO",
  "SHIPPED": "POSLATO",
  "COMPLETED": "DOSTAVLJENO",
  "ORDER PROBLEM": "SPREMNO ZA IZRADU"
};
$(document).ready(function () {
  $(document).on('click', '#order_my_account_id', function () {
    var html = '';
    $.get('/get_orders', function (response) {
      if (response) {
        $('.order_elements').remove('');

        for (var i = 0; i < response.length; i++) {
          var date = new Date(response[i].orderDate);
          var num;

          if (response[i].noOfPrints > 1) {
            num = 'proizvoda';
          } else {
            num = 'proizvod';
          }

          html += "\n                            <tr class='order_elements'>\n                                <td>#".concat(response[i].id, "</td> \n                                <td>").concat(response[i].trackingId, "</td> \n                                <td>").concat(date.toLocaleDateString("en") + " - " + date.toLocaleTimeString("en"), "</td>  \n                                <td>").concat(statusTranslations[response[i].orderStatus], "</td> \n                                <td><span>").concat(response[i].finalCost, " RSD za ").concat(response[i].noOfPrints, " ").concat(num, "  </span></td>\n                                \n                            </tr>\n                    "); // <td class="table-buttons">
          //     <button class="transparent-button">
          //         <p>View</p>
          //     </button>
          //     <button class="black-button">
          //         <p>Print</p>
          //     </button>
          // </td>
        }

        $('#orders_table_id').append(html);
      }
    });
  });
  $(document).on('click', '#addresses-tab', function () {
    var show = false;
    $.get('/address', function (response) {
      if (response) {
        var html = "\n\n                    <h1>Shipping Address <a data-toggle=\"tab\" href=\"#edit-address\" role=\"tab\"\n                        aria-controls=\"edit-address\"> Izmenite adresu </a></h1>\n                    <p >Ime: ".concat(response.firstName, "</p>\n                    <p >Prezime: ").concat(response.lastName, "</p>\n                    <p >Grad: ").concat(response.city, "</p>\n                    <p >Ulica: ").concat(response.address, "</p>\n                    <p >Po\u0161tanski broj: ").concat(response.postalCode, "</p>\n                    <p >Telefon: ").concat(response.phone, "</p>\n                ");
        $('#addresses').html('');
        $('#addresses').append(html);
      } else {
        show = true;
      }

      if (show == false) {
        $('#addresses').attr('class', 'tab-pane fade active show');
        $('#edit-address').attr('class', 'tab-pane fade');
      } else {
        $('#addresses').html('');
        $('#edit-address').attr('class', 'tab-pane fade active show');
      }

      $('#address_form').attr({
        action: '/address/edit',
        method: 'GET'
      });
    });
  });
  $(document).on('click', '#log_out_my_account_id', function () {
    $.post('/logout', function (response) {
      if (response) {
        window.location.href = '/';
      }
    });
  });
  $(document).on('click', '#change_password_button_id', function () {
    var input;
    var form = $('#change_password_id');
    $(form).find('input').each(function () {
      input = $(this).val();

      if (!input) {
        return false;
      }
    });

    if (!input) {
      showPopUp({
        title: "Greška",
        text: "Popunite sva polja",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return false;
    }

    var newPassword = $('#new-password').val();
    $('#new-password').val('');
    var confirmNewPassword = $('#confirm-new-password').val();
    $('#confirm-new-password').val('');
    var currentPassword = $('#current-password').val();
    $('#current-password').val('');

    if (newPassword != confirmNewPassword) {
      showPopUp({
        title: "Greška",
        text: "Lozinke se ne poklapaju",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return false;
    }

    $.post('/change_password', {
      currentPassword: currentPassword,
      newPassword: newPassword
    }, function (response) {
      if (response != 'error') {
        showPopUp({
          title: "Obavestenja",
          text: "Lozinka je promenjena",
          btn1_value: "OK",
          btn1_callback: null,
          btn2_value: null,
          btn2_callback: null
        });
      } else {
        showPopUp({
          title: "Greška",
          text: "Lozinka se nije promenila",
          btn1_value: "OK",
          btn1_callback: null,
          btn2_value: null,
          btn2_callback: null
        });
      }
    });
  });
  $(document).on('click', '#address_button_id', function () {
    var form = $('#address_form');
    var url = form.attr('action');
    var type = form.attr('method');
    var label = '';
    var input;
    $(form).find('input').each(function () {
      input = $(this).val();

      if (!input) {
        label = $('label[for="' + $(this).attr('id') + '"]').html();
        return false;
      }
    });

    if (!input) {
      showPopUp({
        title: "Greška",
        text: "Popunite polje " + label,
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return false;
    }

    $.ajax({
      type: type,
      url: url,
      // or whatever
      data: form.serialize(),
      success: function success(response) {
        window.location.href = '/my_account';
      }
    });
  });
  $(document).on('click', '#account-details-tab', function () {
    $.post('/getUserData', function (response) {
      if (response) {
        $('#email').val(response.email);
        $('#last_name_change_details').val(response.lastName);
        $('#first_name_change_details').val(response.firstName);
      }
    });
  });
  $(document).on('click', '#my_account_add_adress', function () {
    $('#edit-address').find('h1').html('Add new addres');
    $('#address_form').attr({
      action: '/address/create',
      method: 'POST'
    });
    $('#addresses').attr('class', 'tab-pane fade');
    $('#edit-address').attr('class', 'tab-pane active show');
  });
  $(document).on('click', '#change_details_button_id', function () {
    var form = $('#editUserDetails');
    var input; // $(form).find('input').each(function () {
    //    input = $(this).val();
    //     if (!input) {
    //         return false;
    //     }
    // });
    // if (!input) {
    //     showPopUp({
    //         title: "Greška",
    //         text: "Popunite sva polja",
    //         btn1_value: "OK",
    //         btn1_callback: null,
    //         btn2_value: null,
    //         btn2_callback: null
    //     });
    //     return false;
    // }
    // var first_name = $('#first_name_change_details').val();
    // var last_name = $('#last_name_change_details').val();
    // var email = $('#email').val();
    // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // email = re.test(String(email).toLowerCase().trim());
    // if(!email) {
    //     showPopUp({
    //         title: "Greška",
    //         text: "Unesite validnu email adresu",
    //         btn1_value: "OK",
    //         btn1_callback: null,
    //         btn2_value: null,
    //         btn2_callback: null
    //     });
    //     return false;
    // } 

    $.ajax({
      type: 'POST',
      url: 'changeUserDetails',
      // or whatever
      data: form.serialize(),
      success: function success(response) {
        if (response == true) {
          showPopUp({
            title: "Obavestenje",
            text: "Nalog je uspesno osvezen",
            btn1_value: "OK",
            btn1_callback: function btn1_callback() {
              window.location.href = '/my_account';
            },
            btn2_value: null,
            btn2_callback: null
          });
        } else if (response = 'usedEmail') {
          showPopUp({
            title: "Greška",
            text: "Neko već poseduje ovaj email",
            btn1_value: "OK",
            btn1_callback: null,
            btn2_value: null,
            btn2_callback: null
          });
        }
      }
    });
  });
});