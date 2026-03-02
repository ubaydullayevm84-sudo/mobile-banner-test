"use strict";

$(document).ready(function () {
  $(document).on('keypress', function (e) {
    if (e.which == 13) {
      Login();
    }
  });
  $(document).on('click', '#login_btn_id', function () {
    Login();
  });
  $(document).on('click', '#new_password_id', function () {
    var form = $('#new_password_form_id');
    var password = $('#new_password').val();
    var confPassword = $('#confirm_new_password').val();

    if (password != confPassword || password.length < 1) {
      showPopUp({
        title: "Greška",
        text: "Vaše lozinke se ne poklapaju",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return;
    } else if (password.length < 5) {
      showPopUp({
        title: "Greška",
        text: "Vaša lozinka mora biti duža od pet karaktera",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return;
    }

    var user_uuid = $("<input>").attr("type", "hidden").attr("name", "uuid").val(uuid);
    form.append(user_uuid);
    $.ajax({
      type: 'POST',
      url: '/change_user_password',
      data: form.serialize(),
      success: function success(response) {
        if (response) {
          showPopUp({
            title: "Obaveštenje",
            text: "lozinka je promenjena",
            btn1_value: "OK",
            btn1_callback: function btn1_callback() {
              window.location.href = '/login';
            },
            btn2_value: null,
            btn2_callback: null
          });
          $(document).on('click', '#confirm_btn_id', function () {
            window.location.href = '/';
          });
        } else {
          showPopUp({
            title: "Greška",
            text: "lozinka nije promenjena",
            btn1_value: "OK",
            btn1_callback: function btn1_callback() {
              window.location.href = '/login';
            },
            btn2_value: null,
            btn2_callback: null
          });
          $(document).on('click', '#confirm_btn_id', function () {
            window.location.href = '/';
          });
        }
      }
    });
  });
  $(document).on('click', '#forgot_password_mail_btn', function () {
    var form = $('#forget_password_form');
    var email = $('#email').val();

    if (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      email = re.test(String(email).toLowerCase().trim());

      if (!email) {
        showPopUp({
          title: "Greška",
          text: "Unesite validnu email adresu",
          btn1_value: "OK",
          btn1_callback: null,
          btn2_value: null,
          btn2_callback: null
        });
        return;
      }
    }

    $.ajax({
      type: 'POST',
      url: '/forgot/password',
      data: form.serialize(),
      success: function success(response) {
        if (response) {
          showPopUp({
            title: "Obaveštenje",
            text: "Email sa zahtevom ze promenu lozinke je poslat na vašu email adresu",
            btn1_value: "OK",
            btn1_callback: function btn1_callback() {
              window.location.href = '/login';
            },
            btn2_value: null,
            btn2_callback: null
          });
          $(document).on('click', '#confirm_btn_id', function () {
            window.location.href = '/login';
          });
        } else {
          showPopUp({
            title: "Greška",
            text: "Email koji ste uneli nije validan",
            btn1_value: "OK",
            btn1_callback: null,
            btn2_value: null,
            btn2_callback: null
          });
        }
      }
    });
  });
  $(document).on('click', '#register_btn_id', function () {
    var form = $('#register_form_id');
    var input;
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

    var email = $('#email').val();

    if (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      email = re.test(String(email).toLowerCase().trim());

      if (!email) {
        showPopUp({
          title: "Greška",
          text: "Unesite validnu email adresu",
          btn1_value: "OK",
          btn1_callback: null,
          btn2_value: null,
          btn2_callback: null
        });
        return;
      }
    }

    var password = $('#password').val();
    var confPassword = $('#confirm-password').val();

    if (password != confPassword) {
      showPopUp({
        title: "Greška",
        text: "Lozinke se ne poklapaju",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return false;
    } else if (password.length < 5) {
      showPopUp({
        title: "Greška",
        text: "Lozinka mora biti veca od 5 karaktera",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
      return false;
    }

    $.ajax({
      type: 'POST',
      url: '/register/user',
      data: form.serialize(),
      success: function success(response) {
        if (!response.errorCode) {
          showPopUp({
            title: "Obaveštenje",
            text: "Uspešno ste se registovali",
            btn1_value: "OK",
            btn1_callback: function btn1_callback() {
              window.location.href = '/login';
            },
            btn2_value: null,
            btn2_callback: null
          });
        } else {
          showPopUp({
            title: "Greška",
            text: "Korisnik sa tim E-mailom već postoji",
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

function Login() {
  var password = $('#password').val();
  var email = $('#email').val();

  if (!password) {
    showPopUp({
      title: "Greška",
      text: "Unesite korisničko ime i lozinku",
      btn1_value: "OK",
      btn1_callback: null,
      btn2_value: null,
      btn2_callback: null
    });
    return false;
  } else if (!email) {
    showPopUp({
      title: "Greška",
      text: "Unesite lozinku",
      btn1_value: "OK",
      btn1_callback: null,
      btn2_value: null,
      btn2_callback: null
    });
    return false;
  }

  var currentPage = localStorage.getItem('previousUrl');
  $.post('/loginUser', {
    password: password,
    email: email
  }, function (response) {
    if (response) {
      var img = localStorage.getItem('img');
      var ids = [];

      if (img) {
        img = JSON.parse(img);
        var keys = Object.keys(img);

        for (var i in keys) {
          ids.push(img[keys[i]].id);
        }

        $.post('/updateUserId', {
          ids: ids.join()
        }, function (response) {});
      }

      window.location.href = currentPage;
    } else {
      showPopUp({
        title: "Greška",
        text: "Pogrešno korisničko ime ili lozinka",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
    }
  });
}