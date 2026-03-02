"use strict";

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

var images = {};
var frames = {};
var gift = null;
var framesData;
var localStorageSettings;
var localStorageImages;
var localServices;
var localProducts;
var shippingGlobal = 350;
var uploadInProgres = false;
var currentDelete = "";
var priceObj;
var shipping = 0;
var freeShippingPrice = 3000;
var errorTitle;
var framepriceObj = {};
var defaultFrameSize = "10x15";
var imageSettings = {
  sjajni: "1",
  mat: "0",
  iseciSliku: "1",
  popunitiBelim: "0",
};
var defaultFramePrice = {
  realPrice: 0,
  userPrice: 0,
}; // var choice = undefined;

$(document).ready(function () {
  checkLocalStorageIntegrity();
  var supportsLocalStorage = supports_html5_storage();

  if (supportsLocalStorage) {
    rollbar();

    if (!localStorage.getItem("price")) {
      getPriceData();
    }

    loadGifts();
    checkImages();
    checkIfPrioiritySelected();

    localServices = localStorage.getItem("imgServices");

    if (localServices) {
      localServices = JSON.parse(localServices);
    }

    localProducts = localStorage.getItem("products");

    if (localProducts) {
      localProducts = JSON.parse(localProducts);
    }

    localStorageSettings = localStorage.getItem("imgSettings");
    framesData = localStorage.getItem("frames");
    Testcheckout();
    dropDownCart();
    $(".cart-button").focusout(function (e) {
      //  $('#cart-quantity').attr('class','collapsing');
    });
    $(document).on(
      "click",
      "#upload_photos_btn, #upload_photos_btn_index",
      function () {
        window.location.href = "/posaljite-fotografije";
      }
    );
    $(document).on("click", "#login_p_id", function () {
      var currentPage = window.location.pathname;
      localStorage.setItem("previousUrl", currentPage);
      window.location.href = "/login";
    });
    $(document).on("click", "#cart_dropdown_to_cart_id", function () {
      window.location.href = "/cart";
    });
    $(document).on("click", "#my_account_id", function () {
      window.location.href = "/my_account";
    });
    $(document).on("click", "#checkout_id", function () {
      window.location.href = "/checkout";
    });
    $(document).on("click", "#send_mail_btn_id", function () {
      var form = $("#send_mail_form_id");
      var url = "/send_mail";
      var type = "GET";
      var empty = 0;
      $("#send_mail_form_id")
        .find("input")
        .each(function () {
          if ($(this).val() == "") {
            empty = 1;
          }

          return;
        });
      var email = $("#email_field").val();

      if (email) {
        var re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        email = re.test(String(email).toLowerCase().trim());

        if (!email) {
          showPopUp({
            title: "Greška",
            text: "Unesite validnu email adresu",
            btn1_value: "OK",
            btn1_callback: null,
            btn2_value: null,
            btn2_callback: null,
          });
          return;
        }
      }

      if (empty != 1) {
        $.ajax({
          type: type,
          url: url,
          // or whatever
          data: form.serialize(),
          success: function success(response) {
            if (response) {
              $("#send_mail_form_id").find("input").val("");
              $("#text_area_id").val("");
              showPopUp({
                title: "Obaveštenje",
                text: "Vaš mail je poslat",
                btn1_value: "OK",
                btn1_callback: null,
                btn2_value: null,
                btn2_callback: null,
              });
            } else {
              $("#send_mail_form_id").find("input").val("");
              $("#text_area_id").val("");
              showPopUp({
                title: "Greška",
                text: "Vaš mail nije poslat",
                btn1_value: "OK",
                btn1_callback: null,
                btn2_value: null,
                btn2_callback: null,
              });
            }
          },
        });
      } else {
        showPopUp({
          title: "Greška",
          text: "Unesite sva polja pre slanja poruke",
          btn1_value: "OK",
          btn1_callback: null,
          btn2_value: null,
          btn2_callback: null,
        });
        return false;
      }
    });
    $(document).on("click", "#confirm_order_btn_id", function () {
      var empty = 0;
      var errorTitle = "";
      var dontHaveEmail = 0;
      $("#check_out_format_id").html("");
      var formIsVisible = $("#newAddressId").is(":visible");

      if ($("#save_address_order_btn").is(":visible")) {
        showPopUp({
          title: "Greška",
          text: "Snimite vaše izmene",
          btn1_value: "OK",
          btn1_callback: null,
          btn2_value: null,
          btn2_callback: null,
        });
        return false;
      }

      if (!formIsVisible) {
        // $('#newAddressId').remove();
        $("#newAddressId").attr("onsubmit", "return false;");
        $("#address_div_id")
          .find("input")
          .each(function () {
            if ($(this).val().trim() == "") {
              empty = 1;
              errorTitle = $(this).attr("placeholder");
            }

            if ($(this).attr("name") == "phone") {
              var someVal = $(this)
                .val()
                .replace(/[^0-9\.]+/g, "");

              if (!someVal.startsWith("06")) {
                showPopUp({
                  title: "Greška",
                  text: "Unesite broj mobilnog telefona u formatu 06xxxx...",
                  btn1_value: "OK",
                  btn1_callback: null,
                  btn2_value: null,
                  btn2_callback: null,
                });
                $(this).val("");
                empty = 2;
                return false;
              }
            }

            if ($(this).attr("name") == "email") {
              var email = $(this).val();

              if (email) {
                var re =
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                email = re.test(String(email).toLowerCase().trim());

                if (!email) {
                  dontHaveEmail = 1;
                  showPopUp({
                    title: "Greška",
                    text: "Unesite ispravnu email adresu",
                    btn1_value: "OK",
                    btn1_callback: null,
                    btn2_value: null,
                    btn2_callback: null,
                  });
                  return false;
                }
              } else {
                showPopUp({
                  title: "Unestie email",
                  text: "Vaš email nam je potreban da bismo Vam poslali potvrdu porudžbine",
                  btn1_value: "OK",
                  btn1_callback: null,
                  btn2_value: null,
                  btn2_callback: null,
                });
                return false;
              }
            }

            if (empty == 1 && dontHaveEmail == 0) {
              showPopUp({
                title: "Greška",
                text: errorTitle,
                btn1_value: "OK",
                btn1_callback: null,
                btn2_value: null,
                btn2_callback: null,
              });
              return false;
            }
          }); // $("#final_form_cart").trigger('reset');
      } else {
        $("#newAddressId").attr("onsubmit", "return true;");
        $("#final_form_cart")
          .find("input")
          .each(function () {
            if ($(this).val() == "" && $(this).attr("name") != "email") {
              empty = 1;
              errorTitle = $(this).attr("placeholder");
            }

            if (empty == 1 && dontHaveEmail == 0) {
              showPopUp({
                title: "Greška",
                text: errorTitle,
                btn1_value: "OK",
                btn1_callback: null,
                btn2_value: null,
                btn2_callback: null,
              });
              return false;
            }

            if ($(this).attr("name") == "email") {
              var email = $(this).val();

              if (email) {
                var re =
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                email = re.test(String(email).toLowerCase().trim());

                if (!email) {
                  dontHaveEmail = 1;
                  showPopUp({
                    title: "Greška",
                    text: "Unesite ispravnu email adresu",
                    btn1_value: "OK",
                    btn1_callback: null,
                    btn2_value: null,
                    btn2_callback: null,
                  });
                  return false;
                }
              } else {
                showPopUp({
                  title: "Unestie email",
                  text: "Vaš email nam je potreban da bismo Vam poslali potvrdu porudžbine",
                  btn1_value: "OK",
                  btn1_callback: null,
                  btn2_value: null,
                  btn2_callback: null,
                });
                return false;
              }
            }
          });
      } // if ($('.info-box').is(':visible')) {
      //     $("#address_div_id").find('input').each(function () {
      //         if ($(this).val() == '') {
      //             empty = 1;
      //             errorTitle = $(this).attr('placeholder');
      //         }
      //         if (empty == 1 && dontHaveEmail == 0) {
      //             showPopUp({
      //                 title: "Greška",
      //                 text: errorTitle,
      //                 btn1_value: "OK",
      //                 btn1_callback: null,
      //                 btn2_value: null,
      //                 btn2_callback: null
      //             });
      //         }
      //         return false;
      //     });
      // }

      if (framesData && empty == 0 && dontHaveEmail == 0) {
        framesData = localStorage.getItem("frames");
        frames = JSON.parse(framesData);
        var keys = Object.keys(frames);
        var html = "";
        var sum_img_qunatity = 0;
        var imgsettingPaper = "";
        var imgsettingNonStd = "";
        var total = $("#checkout_total").html();
        var imgsetting = JSON.parse(localStorageSettings);

        for (var i = 0; i < keys.length; i++) {
          sum_img_qunatity += frames[keys[i]].quantity;

          if (frames[keys[i]].quantity > 1) {
            html += " <li>"
              .concat(keys[i], "cm (")
              .concat(frames[keys[i]].quantity, " fotografija)</li>");
          } else {
            html += " <li>"
              .concat(keys[i], "cm (")
              .concat(frames[keys[i]].quantity, " fotografija)</li>");
          }
        } // if (localServices) {
        //     localServices = JSON.parse(localStorage.getItem('imgServices'));
        //     keys = Object.keys(localServices);
        //     var sumServicesQunatity = 0;
        //     for (var i = 0; i < keys.length; i++) {
        //         sumServicesQunatity += parseInt(localServices[keys[i]].quantity);
        //         html += ` <li>${localServices[keys[i]].serviceName} (${sumServicesQunatity} komad(a))</li>`;
        //     }
        // }
        // if (localProducts) {
        //     keys = Object.keys(localProducts);
        //     var sumServicesQunatity = 0;
        //     for (var i = 0; i < keys.length; i++) {
        //         sumServicesQunatity += localProducts[keys[i]].quantity;
        //         html += ` <li>${localProducts[keys[i]].name} (${localProducts[keys[i]].quantity} komada)</li>`;
        //     }
        // }

        if (imgsetting.sjajni == "1") {
          imgsettingPaper = "Sjajni";
        } else {
          imgsettingPaper = "Mat";
        }

        if (imgsetting.iseciSliku == "1") {
          imgsettingNonStd = "Iseći fotografiju";
        } else {
          imgsettingNonStd = "Popuniti belim";
        }

        $("#check_out_format_id").append(html);
        html = "";
        var productsQuantity = 0;

        if (localServices) {
          localServices = JSON.parse(localStorage.getItem("imgServices"));
          keys = Object.keys(localServices);

          for (var i = 0; i < keys.length; i++) {
            var singleQuantity = parseInt(localServices[keys[i]].quantity);
            productsQuantity += singleQuantity;
            html += "<li>"
              .concat(localServices[keys[i]].serviceName, " - ")
              .concat(localServices[keys[i]].serviceSubName, " (")
              .concat(singleQuantity, " komad")
              .concat(singleQuantity > 1 ? "a" : "", ")</li>");
          }
        }

        if (productsQuantity == 0) {
          $("#check_out_product_section").hide();
        } else {
          $("#check_out_service_qunatity").html(productsQuantity);
          $("#check_out_services_list").html(html);
        }

        html = "";

        if (sum_img_qunatity > 0) {
          if (sum_img_qunatity > 1) {
            html += sum_img_qunatity + " " + "fotografija";
          } else {
            html += sum_img_qunatity + " " + "fotografija";
          }
        }

        if (sum_img_qunatity == 0) {
          $("#check_out_images_section").hide();
        }

        $("#check_out_img_qunatity").html(html);
        $("#check_out_total_money").html(total);
        $("#check_out_img_settings").html(imgsettingPaper);
        $("#check_out_img_settings_non_std").html(imgsettingNonStd);
        $("#orderConfirmationModal").modal("show"); // $(document).on('click', '#modal_confirm_btn_id', settings.btn1_callback);
      }
    });
    $(document).on("click", ".standard-delivery", function () {
      setPriorityDelivery(false);
    });
    $(document).on("click", ".priority-delivery", function () {
      setPriorityDelivery(true);
    });
    $(document).on("click", "#confirm_btn_id", function () {
      localStorageImages = localStorage.getItem("img");
      var specialCode = localStorage.getItem("specailCode");

      if (specialCode) {
        var specialCodeHtml = $("<input>")
          .attr("type", "hidden")
          .attr("name", "specialCode")
          .val(specialCode);
        $("#final_form_cart").append(specialCodeHtml);
      }

      if (localServices) {
        var services = $("<input>")
          .attr("type", "hidden")
          .attr("name", "localServices")
          .val(JSON.stringify(localServices));
        $("#final_form_cart").append(services);
      }

      if (localProducts) {
        var products = $("<input>")
          .attr("type", "hidden")
          .attr("name", "localProducts")
          .val(JSON.stringify(localProducts));
        $("#final_form_cart").append(products);
      }

      var images = $("<input>")
        .attr("type", "hidden")
        .attr("name", "cart")
        .val(localStorageImages);
      var imagesOptions = $("<input>")
        .attr("type", "hidden")
        .attr("name", "imagesOptions")
        .val(localStorageSettings);
      $("#final_form_cart").append(images);
      $("#final_form_cart").append(imagesOptions);

      const visitToken = localStorage.getItem("visit_token");

      if (visitToken) {
        var visitTokenEl = $("<input>")
          .attr("type", "hidden")
          .attr("name", "visit_token")
          .val(visitToken);
        $("#final_form_cart").append(visitTokenEl);
      }

      let priorityDelivery =
        localStorage.getItem("priorityDelivery") === "true";
      var priorityDeliveryEl = $("<input>")
        .attr("type", "hidden")
        .attr("name", "priorityDelivery")
        .val(priorityDelivery);
      $("#final_form_cart").append(priorityDeliveryEl);

      var form = $("#final_form_cart").filter(":visible");
      var url = "/place";
      var type = "POST";
      $.ajax({
        type: type,
        url: url,
        // or whatever
        data: form.serialize(),
        success: function success(response) {
          // Notify Facebook Pixel

          var value = JSON.parse(localStorage.getItem("price"));

          fbq(
            "track",
            "Purchase",
            {
              value: ((value.price + value.shipping) / 117.5).toFixed(2),
              currency: "EUR",
              contents: [
                {
                  quantity: value.imgQuantity,
                },
              ],
            },
            {
              eventID: response.trackingId,
              event: "purchase_event",
            }
          );

          // Notify Google Conversion
          gtag("event", "Slanje porudzbine", {
            value: value.price + value.shipping,
            currency: "RSD",
          });

          gtag_report_conversion(null, value.price + value.shipping);

          localStorage.setItem("img", "");
          localStorage.setItem("imgSettings", "");
          localStorage.setItem("price", "");
          localStorage.setItem("frames", "");
          localStorage.setItem("localServices", "");
          localStorage.setItem("imgServices", "");
          localStorage.setItem("products", "");
          localStorage.setItem("priceData", "");
          localStorage.removeItem("specailCode");
          localStorage.setItem("priorityDelivery", false);
          showPopUp({
            title: "Obaveštenje",
            text: "Vaša porudžbina je uspešno primljena. Ukoliko ste uneli validan email, stićiće vam i email sa potvrdom porudžbine. Kontaktiraćemo vas pre slanja vašeg paketa.",
            btn1_value: "OK",
            btn1_callback: function btn1_callback() {
              window.location.href = "/posaljite-fotografije";
            },
            btn2_value: null,
            btn2_callback: null,
          }); // $(document).on('click', '#confirm_btn_id', function () {
          // });
        },
      });
    });
  } else {
    showPopUp({
      title: "Greška",
      text: "Vaš pretraživač ne podržava funkcije koje su potrene za funkiconisanje sajta",
      btn1_value: "OK",
      btn1_callback: null,
      btn2_value: null,
      btn2_callback: null,
    });
  }
});

function submitOrder() {
  localStorageImages = localStorage.getItem("img");

  if (localServices) {
    var services = $("<input>")
      .attr("type", "hidden")
      .attr("name", "localServices")
      .val(JSON.stringify(localServices));
    $("#final_form_cart").append(services);
  }

  var images = $("<input>")
    .attr("type", "hidden")
    .attr("name", "cart")
    .val(localStorageImages);
  var imagesOptions = $("<input>")
    .attr("type", "hidden")
    .attr("name", "imagesOptions")
    .val(localStorageSettings);
  $("#final_form_cart").append(images);
  $("#final_form_cart").append(imagesOptions);
  var form = $("#final_form_cart").filter(":visible");
  var url = "/place";
  var type = "POST";
  $.ajax({
    type: type,
    url: url,
    // or whatever
    data: form.serialize(),
    success: function success(response) {
      localStorage.setItem("img", "");
      localStorage.setItem("imgSettings", "");
      localStorage.setItem("price", "");
      localStorage.setItem("frames", "");
      localStorage.setItem("localServices", "");
      showPopUp(
        "Obaveštenje",
        "Vaša porudžbina je uspešno primljena. Ukoliko ste uneli validan email, stićiće vam i email sa potvrdom porudžbine. Kontaktiraćemo vas pre slanja vašeg paketa.",
        true
      );
      $(document).on("click", "#confirm_btn_id", function () {
        window.location.href = "/posaljite-fotografije";
      });
    },
  });
}

function supports_html5_storage() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}

function setPriorityDelivery(value) {
  localStorage.setItem("priorityDelivery", value);
  let pricingInfo = localStorage.getItem("price");
  if (pricingInfo) pricingInfo = JSON.parse(pricingInfo);
  printPrice(pricingInfo);

  if (value) {
    $(".priority_div").show();
  } else {
    $(".priority_div").hide();
  }
}

function checkIfPrioiritySelected() {
  let priorityValue = localStorage.getItem("priorityDelivery");
  if (priorityValue) {
    $(".standard-delivery").removeClass("active");
    $(".priority-delivery").removeClass("active");

    if (priorityValue === "true") {
      $(".priority_div").show();
      $(".priority-delivery input").prop("checked", true);
      $(".priority-delivery").addClass("active");
    } else {
      $(".priority_div").hide();
      $(".standard-delivery input").prop("checked", true);
      $(".standard-delivery").addClass("active");
    }
  }
}

function cartItems() {
  frames = {};
  var localStorageImages = localStorage.getItem("img");

  if (
    localStorageImages != "{}" &&
    localStorageImages != undefined &&
    localStorageImages != ""
  ) {
    var imagesArray = JSON.parse(localStorageImages);
    drawCartCommon(imagesArray);
  } else if (images) {
    drawCartCommon(images);
  }
}

function drawCartCommon(img) {
  var keys = Object.keys(img);

  for (var i = 0; i < keys.length; i++) {
    if (!frames[img[keys[i]].frameSize]) {
      frames[img[keys[i]].frameSize] = {};
      frames[img[keys[i]].frameSize].quantity = 0;
    }

    frames[img[keys[i]].frameSize].quantity += img[keys[i]].quantity;
  }

  localStorage.setItem("frames", JSON.stringify(frames));
  priceObj = JSON.parse(localStorage.getItem("price"));
  dropDownCart();
}

function dropDownCart() {
  if (uploadInProgres == undefined) {
    uploadInProgres = false;
  }

  var html = "";
  var haveimg = false;
  var haveService = false;
  var prozivodiNum = 0;
  framesData = localStorage.getItem("frames");

  if (framesData) {
    frames = JSON.parse(framesData);
  }

  var keys = Object.keys(frames);

  for (var i = 0; i < keys.length; i++) {
    html += drawImageCart(keys[i]);
  }

  prozivodiNum += keys.length;
  var priceData = localStorage.getItem("price");
  $(".cart-product").remove();
  var tempServiceOrder = localStorage.getItem("imgServices");

  if (
    tempServiceOrder != "{}" &&
    tempServiceOrder != null &&
    tempServiceOrder != ""
  ) {
    tempServiceOrder = JSON.parse(tempServiceOrder);
    haveService = true;
    prozivodiNum += Object.keys(tempServiceOrder).length;
  }

  var product = localStorage.getItem("products");
  var productPrice;

  if (product != "{}" && product != null && product != "") {
    // productPrice = JSON.parse(localStorage.getItem('productPrice'));
    product = JSON.parse(product); // productPrice = productPrice.price;

    prozivodiNum += Object.keys(product).length;
  }

  if (priceData || haveService || product != {}) {
    if (priceData) {
      priceObj = JSON.parse(priceData);

      if (priceObj.picNum == 0) {
        haveimg = false;
        $(".box-body2").css("display", "flex");
        $(".order-now-btn").removeClass("order-btn-radius");
        $("#empty_cart_id").html("Prazna");
        $("#cart-quantity-mobile").hide().text("");
        $(".total_money_id").html(0);
        $("#cart_buttons_id").css("display", "none");
        $("#cart_prazno_id").css("display", "flex");
        $(".subtotal").css("display", "none");
      } else if (uploadInProgres == false) {
        haveimg = true;
        $("#cart_dropdown_to_cart_id").css("display", "flex");
        $("#checkout_id").css("display", "flex");
        $(".cart-products-list").html(html);
        var total = priceObj.price + parseInt(priceObj.shipping);
        $("#cart_dropdown_total_id").html(
          '<span>Ukpuno: </span id = "total_cart_id">' +
            parseFloat(total).toFixed(2) +
            " RSD"
        );
        $("#cart_dropdown_total_id").attr(
          "data-value",
          parseFloat(total).toFixed(2)
        );
        $("#total_money_id").html(total);

        if (prozivodiNum > 1) {
          $("#empty_cart_id").html("".concat(prozivodiNum, " Proizvoda"));
        } else {
          $("#empty_cart_id").html("".concat(prozivodiNum, " Proizvod"));
        } // $('#empty_cart_id').html('');

        $(".box-body2").css("display", "none");
        $(".order-now-btn").addClass("order-btn-radius");
        $(".subtotal").css("display", "flex");
        $("#cart_buttons_id").css("display", "flex");
        $("#cart_prazno_id").css("display", "none");
      }
    }

    if (haveService) {
      var priceData = localStorage.getItem("priceData");

      if (priceData) {
        priceData = JSON.parse(priceData);
        getServicePriceCommon(tempServiceOrder, priceData, haveimg);
      }

      $("#cart_dropdown_to_cart_id").css("display", "flex");
      $("#checkout_id").css("display", "flex");
      $("#cart-quantity-mobile").show().text("".concat(prozivodiNum));

      if (prozivodiNum > 1) {
        $("#empty_cart_id").html("".concat(prozivodiNum, " Proizvoda"));
      } else {
        $("#empty_cart_id").html("".concat(prozivodiNum, " Proizvod"));
      }

      $(".subtotal").css("display", "flex");
      $("#cart_buttons_id").css("display", "flex");
      $("#cart_prazno_id").css("display", "none");
    }

    if (product != "{}" && product != null && product != "") {
      var priceData = localStorage.getItem("priceData");

      if (priceData) {
        priceData = JSON.parse(priceData);
        getServicePriceCommon(product, priceData, haveimg, true, productPrice);
      }

      $("#cart_dropdown_to_cart_id").css("display", "flex");
      $("#checkout_id").css("display", "flex");
      $("#cart-quantity-mobile").show().text("".concat(prozivodiNum));

      if (prozivodiNum > 1) {
        $("#empty_cart_id").html("".concat(prozivodiNum, " Proizvoda"));
      } else {
        $("#empty_cart_id").html("".concat(prozivodiNum, " Proizvod"));
      }

      $(".subtotal").css("display", "flex");
      $("#cart_buttons_id").css("display", "flex");
      $("#cart_prazno_id").css("display", "none");
    }
  } else {
    haveimg = false;
    $(".box-body2").css("display", "flex");
    $("#empty_cart_id").html("Prazna");
    $(".total_money_id").html(0);
    $("#cart_buttons_id").css("display", "none");
    $("#cart_prazno_id").css("display", "flex");
    $(".subtotal").css("display", "none");
    $("#cart-quantity-mobile").hide().text("");
  }

  if ($("#empty_cart_id").html() == "Prazna" || uploadInProgres == true) {
    var priceData = localStorage.getItem("price");

    if (priceData) {
      priceObj = JSON.parse(priceData);
      var total = priceObj.price + parseInt(priceObj.shipping);
      $("#cart_dropdown_total_id").html(
        '<span>Ukpuno: </span id = "total_cart_id">' +
          parseFloat(total).toFixed(2) +
          " RSD"
      );
      $("#cart_dropdown_total_id").attr(
        "data-value",
        parseFloat(total).toFixed(2)
      );
    }

    $(".order_now_id").attr("disabled", true);
    $("#cart_buttons_id").css("display", "none");
    $("#cart-quantity-mobile").hide().text("");
  } else {
    if (priceObj == undefined) {
      $(".box-body2").css("display", "flex");
      $("#empty_cart_id").html("Prazna");
      $(".total_money_id").html(0);
      $("#cart_buttons_id").css("display", "none");
      $("#cart_prazno_id").css("display", "flex");
      $(".subtotal").css("display", "none");
      $("#cart-quantity-mobile").hide().text("");
    } else {
      $(".order_now_id").attr("disabled", false);
      $("#cart_buttons_id").css("display", "flex");
    }

    haveSpecialCode(); // FIX ME
  }
}

function deleteFromCartUniversal(e) {
  currentDelete = e.dataset.id_button;

  if (uploadInProgres == true) {
    showPopUp({
      title: "Greška",
      text: "Nije moguce brisanje dok je slika u uploadu",
      btn1_value: "OK",
      btn1_callback: null,
      btn2_value: null,
      btn2_callback: null,
    });
    return false;
  }

  showPopUp({
    title: "Potvrdite brisanje",
    text: "Da li želite da obrišete ove fotografije iz korpe?",
    btn1_value: "Da",
    btn1_callback: function btn1_callback() {
      deleteFromCart(e);
    },
    btn2_value: "Ne",
    btn2_callback: null,
  });
}

function editService(e) {
  var serviceId = $(e).attr("data-edit-btn");
  var allServices = JSON.parse(localStorage.getItem("imgServices"));
  var data = allServices[serviceId];
  var form = $("<form action='/foto-pokloni/edit' method ='GET'></form>");
  var services = $("<input>")
    .attr("type", "hidden")
    .attr("name", "localServices")
    .val(JSON.stringify(data));
  $(form[0]).append(services[0]);
  $(form[0]).appendTo("body").submit(); // $(form[0]).submit();
}

function editProduct(e) {
  var serviceId = $(e).attr("data-edit-btn");
  var allServices = JSON.parse(localStorage.getItem("products"));
  var data = allServices[serviceId];
  var form = $("<form action='/proizvodi/edit' method ='GET'></form>");
  var product = $("<input>")
    .attr("type", "hidden")
    .attr("name", "localProducts")
    .val(JSON.stringify(data));
  var productId = $("<input>")
    .attr("type", "hidden")
    .attr("name", "localProductsID")
    .val(serviceId);
  $(form[0]).append(productId[0]);
  $(form[0]).append(product[0]);
  $(form[0]).appendTo("body").submit(); // $(form[0]).submit();
}

function deleteFromServiceCartUniversal(e) {
  if (uploadInProgres == true) {
    showPopUp({
      title: "Greška",
      text: "Nije moguce brisanje dok je slika u uploadu",
      btn1_value: "OK",
      btn1_callback: null,
      btn2_value: null,
      btn2_callback: null,
    });
    return false;
  }

  showPopUp({
    title: "Potvrda brisanja",
    text: "Da li želite da obrišete ovaj proizvod iz korpe?",
    btn1_value: "Obriši",
    btn1_callback: function btn1_callback() {
      deleteFromServiceCart(e);
    },
    btn2_value: "Odustani",
    btn2_callback: null,
  });
}

function deleteFromServiceCart(e) {
  var tempServiceOrder = localStorage.getItem("imgServices");
  var imgServices = JSON.parse(tempServiceOrder); // var key = Object.keys(imgServices);

  var key = $(e).attr("data-id");

  if (!key) {
    key = $(e).attr("data-id_button");
  }

  if (imgServices[key]) {
    var totalServicePrice = imgServices[key].totalPrice;
    var priceObj = localStorage.getItem("price");

    if (priceObj) {
      priceObj = JSON.parse(priceObj);
      priceObj.finalPrice -= totalServicePrice;
      priceObj.serviceNum = key.length; // localStorage.setItem("price", JSON.stringify(priceObj));

      var sum = $("#cart_dropdown_total_id").attr("data-value");
      sum -= totalServicePrice;
      $("#cart_dropdown_total_id").html(
        '<span>Ukpuno: </span id = "total_cart_id">' +
          parseFloat(sum).toFixed(2) +
          " RSD"
      );
      $("#cart_dropdown_total_id").attr(
        "data-value",
        parseFloat(sum).toFixed(2)
      );
      $("#total_money_id").html(parseFloat(sum).toFixed(2));
    }

    delete imgServices[key];
    var objLength = Object.keys(imgServices);

    if (objLength.length == 0) {
      localStorage.setItem("imgServices", "");
    }

    localStorage.setItem("imgServices", JSON.stringify(imgServices));
    $(".cart-product[data-id=".concat(key, "]")).remove();
    $("#cart_id_".concat(key)).remove();
    var priceData = localStorage.getItem("price");
    key = Object.keys(imgServices);

    if (priceData == null && key.length == 0) {
      $(".box-body2").css("display", "flex");
      $("#empty_cart_id").html("Prazna");
      $(".total_money_id").html(0);
      $(".subtotal").css("display", "none");
      $("#cart_buttons_id").css("display", "none");
      $("#cart_prazno_id").css("display", "flex");
    }

    getDiscountCommon();
    dropDownCart();
    var url = window.location.pathname;

    if (url == "/cart") {
      reload();
    } else if (url == "/checkout") {
      // realoadCheckout();
    } else if (url == "/foto-pokloni/edit") {
      service_btn_delete(e);
    }
  }
}

function deleteFromProductCartUniversal(e) {
  currentDelete = e.dataset.id_button;

  if (uploadInProgres == true) {
    showPopUp({
      title: "Greška",
      text: "Nije moguce brisanje dok je slika u uploadu",
      btn1_value: "OK",
      btn1_callback: null,
      btn2_value: null,
      btn2_callback: null,
    });
    return false;
  }

  showPopUp({
    title: "Greška",
    text: "Da li želite da obrišete ove proizvode iz korpe",
    btn1_value: "OK",
    btn1_callback: function btn1_callback() {
      deleteFromProductCart(e);
    },
    btn2_value: "Cancel",
    btn2_callback: null,
  });
}

function deleteFromProductCart(e) {
  if (e.dataset.id_button == currentDelete) {
    var product = localStorage.getItem("products");
    var imgServices = JSON.parse(product); // var key = Object.keys(imgServices);

    var key = $(e).attr("data-id");

    if (!key) {
      key = $(e).attr("data-id_button");
    }

    if (imgServices[key]) {
      var totalServicePrice = parseFloat(imgServices[key].price);
      var priceObj = localStorage.getItem("price");

      if (priceObj) {
        priceObj = JSON.parse(priceObj);
        priceObj.finalPrice -= totalServicePrice;
        priceObj.serviceNum = key.length; // localStorage.setItem("price", JSON.stringify(priceObj));

        var sum = $("#cart_dropdown_total_id").attr("data-value");
        sum -= totalServicePrice; // $('#cart_dropdown_total_id').html('<span>Ukpuno: </span id = "total_cart_id">' + parseFloat(sum).toFixed(2) + ' RSD');
        // $('#cart_dropdown_total_id').attr('data-value', parseFloat(sum).toFixed(2));
        // $('#total_money_id').html(parseFloat(sum).toFixed(2));
      }

      delete imgServices[key];
      var objLength = Object.keys(imgServices);

      if (objLength.length == 0) {
        localStorage.setItem("products", "");
      }

      localStorage.setItem("products", JSON.stringify(imgServices));
      $(".cart-product[data-id=".concat(key, "]")).remove();
      $("#cart_id_".concat(key)).remove();
      var priceData = localStorage.getItem("price");
      key = Object.keys(imgServices);

      if (priceData == null && key.length == 0) {
        $(".box-body2").css("display", "flex");
        $("#empty_cart_id").html("Prazna");
        $(".total_money_id").html(0);
        $(".subtotal").css("display", "none");
        $("#cart_buttons_id").css("display", "none");
        $("#cart_prazno_id").css("display", "flex");
      }

      dropDownCart();
      var url = window.location.pathname;

      if (url == "/cart") {
        reload();
      } else if (url == "/checkout") {
        // realoadCheckout();
      } else if (url == "/foto-pokloni/edit") {
        service_btn_delete(e);
      }
    }
  }
}

function getServicePriceCommon(
  serviceOrder,
  priceData,
  haveimg,
  product,
  productPrice
) {
  var totalMoney = priceData.price;
  var shiping = priceData.shipping;

  if (!haveimg) {
    shiping = shippingGlobal;
  }

  var quantity;
  var serviceName;
  var html = "";
  var totalMoneyWshipping = 0;
  var key = Object.keys(serviceOrder);

  if (!product) {
    for (var i = 0; i < key.length; i++) {
      var serviceDetails = serviceOrder[key[i]];
      html += drawImageServiceCart(serviceDetails, key[i]);
    }
  } else {
    for (var i = 0; i < key.length; i++) {
      quantity = serviceOrder[key[i]].quantity;
      serviceName = serviceOrder[key[i]].name;
      html += drawImageProductCart(serviceName, quantity, key[i]); //totalMoney = parseFloat(totalMoney) + parseFloat(serviceOrder[key[i]].price);
      //totalMoneyWshipping += parseFloat(serviceOrder[key[i]].price);
    }
  } //totalMoney += parseInt(shiping);
  //$('#cart_dropdown_total_id').attr('data-value', parseFloat(totalMoney).toFixed(2));
  //$('#cart_dropdown_total_id').html('<span>Ukpuno: </span id = "total_cart_id">' + parseFloat(totalMoney).toFixed(2) + ' RSD');
  //$('.total_money_id').html(parseFloat(totalMoney).toFixed(2));

  $(".cart-products-list").append(html); // if (haveimg) {
  //     var priceObj = JSON.parse(localStorage.getItem('price'));
  //     // priceObj.price += totalMoneyWshipping; // FIX ME
  //     priceObj.serviceNum = key.length;
  //     priceObj.finalPrice = totalMoney;
  //    // localStorage.setItem("price", JSON.stringify(priceObj));
  // } else {
  //     var priceObj = {};
  //     priceObj.price = totalMoneyWshipping;
  //     priceObj.finalDiscountPrice = 0;
  //     priceObj.serviceNum = key.length;
  //     priceObj.picNum = 0;
  //     priceObj.imgQuantity = 0;
  //     priceObj.shipping = shiping;
  //    // localStorage.setItem("price", JSON.stringify(priceObj));
  // }
}

function drawImageServiceCart(service, key) {
  var html = '\n        <div class="cart-product" data-id ="'
    .concat(
      key,
      '">\n            <div class="cart-product-image">\n                <img src="/images/services/'
    )
    .concat(
      service.serviceImage,
      '" alt="product-image">\n                        </div>\n                <div class="cart-product-text product-service-text">\n                    <p>'
    )
    .concat(service.serviceName, "</p>\n                    <p>")
    .concat(service.serviceSubName, "</p>\n                    <p>Za izradu: ")
    .concat(
      service.quantity,
      "</p>\n                </div>\n                <button onclick='deleteFromServiceCartUniversal(this)' data-id_button='"
    )
    .concat(
      key,
      '\' type="button" class="close" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <button class="cart-collapse-edit" style="display: none;" onclick=\'editService(this)\' data-edit-btn = \''
    )
    .concat(
      key,
      '\' >\n                    <i class="fas fa-pen"></i>\n                </button>\n            </div>\n        </div>'
    );
  return html;
}

function drawImageProductCart(name, quantity, key) {
  var html = '\n        <div class="cart-product" data-id ="'
    .concat(
      key,
      '">\n            <div class="cart-product-image">\n                <img src="/images/side-image.jpg" alt="product-image">\n                        </div>\n                <div class="cart-product-text">\n                    <p>'
    )
    .concat(name, "</p>\n                    <p>Broj proizvoda ")
    .concat(
      quantity,
      "</p>\n                </div>\n                <button onclick='deleteFromProductCartUniversal(this)' data-id_button='"
    )
    .concat(
      key,
      '\' type="button" class="close" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <button class="cart-collapse-edit" onclick=\'editProduct(this)\' data-edit-btn = \''
    )
    .concat(
      key,
      '\' >\n                    <i class="fas fa-pen"></i>\n                </button>\n            </div>\n        </div>'
    );
  return html;
}

function drawImageCart(img) {
  var html =
    '\n        <div class="cart-product">\n            <div class="cart-product-image">\n                <img src="/images/side-image.jpg" alt="product-image">\n                        </div>\n                <div class="cart-product-text">\n                    <p>'
      .concat(img, "</p>\n                    <p>Broj fotografija: ")
      .concat(
        frames[img].quantity,
        "</p>\n                </div>\n                <button onclick='deleteFromCartUniversal(this)' data-id_button='"
      )
      .concat(
        img,
        '\' type="button" class="close" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n\n            </div>\n        </div>'
      );
  return html;
}

function deleteFromCart(e, badImage) {
  if (e.dataset.id_button == currentDelete) {
    var frame = $(e).attr("data-id_button");
    var localStorageImages = localStorage.getItem("img");
    var images = JSON.parse(localStorageImages);
    var keys = Object.keys(images);
    var ids = [];

    for (var i = 0; i < keys.length; i++) {
      if (images[keys[i]].frameSize == frame) {
        if (images[keys[i]].id) {
          ids.push(images[keys[i]].id);
        }

        delete images[keys[i]];
        $("#image_id_" + keys[i]).remove();
        $("#cart_id_" + frame).remove();
      }
    }

    var idsStrings = ids.join();

    if (idsStrings) {
      $.post("/deleted", {
        ids: idsStrings,
      });
    }

    localStorage.setItem("img", JSON.stringify(images));
    getDiscountCommon();
    var url = window.location.pathname;

    if (url == "/cart") {
      // reload();
    } else if (url == "/checkout") {
      //realoadCheckout();
    }
  }
}

function getDiscountCommon() {
  var localStorageImages = localStorage.getItem("img");

  if (localStorageImages) {
    images = JSON.parse(localStorageImages);
  } else {
    images = {};
  }

  var discount = JSON.parse(localStorage.getItem("discount"));
  var framepriceObj = JSON.parse(localStorage.getItem("framepriceObj"));
  var price = 0;
  var finalDiscountPrice = 0;
  var discountPrice = {};
  var imgQuantity = 0;
  var keys = Object.keys(images);

  if (keys.length == 0) {
    shipping = 0;
  }

  var haveSpecial = false;
  var have0shipping = false;

  for (var i = 0; i < keys.length; i++) {
    if (!discountPrice[images[keys[i]].frameSize]) {
      discountPrice[images[keys[i]].frameSize] = {
        quantity: 0,
      };
    }

    discountPrice[images[keys[i]].frameSize].quantity +=
      images[keys[i]].quantity;
    imgQuantity += images[keys[i]].quantity;
  }

  var frameKeys = Object.keys(discountPrice);

  for (var i = 0; i < frameKeys.length; i++) {
    var specialPrice = getSpecailOfferCommon(frameKeys[i], discountPrice);

    if (specialPrice) {
      haveSpecial = true;
      price += parseFloat(specialPrice);
      finalDiscountPrice +=
        discountPrice[frameKeys[i]].quantity * framepriceObj[frameKeys[i]] -
        parseFloat(specialPrice);
    } else {
      for (var j = discount.length - 1; j >= 0; j--) {
        if (discountPrice[frameKeys[i]].quantity >= discount[j].count) {
          if (!haveSpecial && !have0shipping) {
            shipping = discount[j].shipping;

            if (shipping == 0) {
              have0shipping = true;
            }
          }

          if (discount[j].discount == 0) {
            price +=
              discountPrice[frameKeys[i]].quantity *
              framepriceObj[frameKeys[i]];
          } else {
            finalDiscountPrice +=
              (discountPrice[frameKeys[i]].quantity *
                framepriceObj[frameKeys[i]] *
                discount[j].discount) /
              100;
            price +=
              discountPrice[frameKeys[i]].quantity *
                framepriceObj[frameKeys[i]] -
              (discountPrice[frameKeys[i]].quantity *
                framepriceObj[frameKeys[i]] *
                discount[j].discount) /
                100;
          }

          break;
        }
      }
    }
  }

  canCheckOutCommon(keys);
  var priceData = {}; // var haveCode = haveSpecialCode('', true);
  // haveSpecial = false;
  // if (haveCode) {
  //     if (haveCode >= freeShippingPrice && haveSpecial == false) {
  //         shipping = 0;
  //     } else if (haveSpecial == false) {
  //               var localShipping = localStorage.getItem('price');
  //   if(localShipping){
  //      var mainShipping = JSON.parse(localShipping);
  //       mainShipping = mainShipping.shipping;
  //   }
  //     shipping = mainShipping;
  //     }
  //     if (haveCode == 0) {
  //         shipping = 0;
  //     }
  // } else {
  //     if (price >= freeShippingPrice && haveSpecial == false) {
  //         shipping = 0;
  //     } else if (haveSpecial == false) {
  //               var localShipping = localStorage.getItem('price');
  //   if(localShipping){
  //      var mainShipping = JSON.parse(localShipping);
  //       mainShipping = mainShipping.mainShippingdd;
  //   }
  //     shipping = mainShipping;
  //     }
  //     if (price == 0) {
  //         shipping = 0;
  //     }
  // }

  var localServicesPrice = 0;
  var localServiceQuantity = 0;
  var localServices = localStorage.getItem("imgServices");

  if (localServices) {
    localServices = JSON.parse(localServices);
    var localServicesKeys = Object.keys(localServices);

    for (var i in localServicesKeys) {
      localServicesPrice += localServices[localServicesKeys[i]].totalPrice;
      localServiceQuantity += parseInt(
        localServices[localServicesKeys[i]].quantity
      );
    }
  }

  // if (imgQuantity >= 100 && localServicesPrice > 0) {
  //     localServicesPrice -= 300;
  // }
  var gratisCalendars = Math.floor(localServiceQuantity / 4);
  if (localServiceQuantity >= 4) {
    localServicesPrice -= gratisCalendars * 350;
  }

  var specailPrice = smallFunction(price);
  haveSpecial = false;

  if (
    price + localServicesPrice >= freeShippingPrice &&
    haveSpecial == false &&
    specailPrice + localServicesPrice >= freeShippingPrice
  ) {
    shipping = 0;
  } else if (haveSpecial == false) {
    var localShipping = localStorage.getItem("price");

    if (localShipping) {
      var mainShipping = JSON.parse(localShipping);
      localShipping = mainShipping;
    }

    shipping = localShipping.mainShippingdd;
    if (!shipping) shipping = 350;
  }

  if (price == 0 && localServicesPrice == 0) {
    shipping = 0;
  }

  priceData.finalDiscountPrice = finalDiscountPrice;
  priceData.price = price;
  priceData.shipping = shipping;
  localStorage.setItem("priceData", JSON.stringify(priceData));
  genereteFinalPriceCommon({
    price: price,
    finalDiscountPrice: finalDiscountPrice,
    picNum: keys.length,
    imgQuantity: imgQuantity,
    freeShippingPrice: freeShippingPrice,
    localServicesPrice: localServicesPrice,
  });
}

function canCheckOutCommon(keys) {
  var show = true;

  if (!keys.length == 0) {
    for (var i = 0; i < keys.length; i++) {
      if (!images[keys[i]].imgSrc) {
        show = false;
        $("#deleteAllButton").css("display", "none");
        $("#deleteAllButton_mobile").css("display", "none");
      }
    }

    if (show == true) {
      $("#checkout_id").css("display", "flex");
      $("#cart_dropdown_to_cart_id").css("display", "flex");
      $("#deleteAllButton").css("display", "flex");
      $("#deleteAllButton_mobile").css("display", "flex");
    }
  } else {
    var url = window.location.pathname;

    if (url == "/checkout") {
      // window.location.href = '/';
    }

    $("#deleteAllButton").css("display", "none");
    $("#deleteAllButton_mobile").css("display", "none");
  }
}

function getSpecailOfferCommon(frameKey, discountPrice) {
  var specailPrice = 0;
  var specialDiscount = JSON.parse(localStorage.getItem("specialDiscount"));

  for (var j = specialDiscount.length - 1; j >= 0; j--) {
    if (
      frameKey == specialDiscount[j].frameSize &&
      discountPrice[frameKey].quantity >= specialDiscount[j].printCount
    ) {
      specailPrice +=
        discountPrice[frameKey].quantity * specialDiscount[j].printCost;
      shipping = specialDiscount[j].shippingCost;
      return specailPrice.toFixed(2);
    }
  }
}

function genereteFinalPriceCommon(price) {
  price.shipping = parseInt(shipping);
  price.serviceNum = 0; //ERROR MAYBE

  price.shipping = parseInt(shipping);
  localStorage.setItem("price", JSON.stringify(price));
  cartItems();
  haveSpecialCode();
}

function Testcheckout(price) {
  var localStorageImages = localStorage.getItem("img");

  if (localStorageImages) {
    images = JSON.parse(localStorageImages);
  }

  var keys = Object.keys(images);
  canCheckOutCommon(keys);
}

function loadGifts() {
  $.get("/get_active_gift?gift_id=1", function (data) {
    gift = data;
    checkImages();
  });
}

function checkImages() {
  var tempImages = localStorage.getItem("img");

  if (tempImages) {
    tempImages = JSON.parse(tempImages);
    var keys = Object.keys(tempImages);

    for (var i in keys) {
      if (!tempImages[keys[i]].width) {
        delete tempImages[keys[i]];
      }
    }

    localStorage.setItem("img", JSON.stringify(tempImages));
    getDiscountCommon();
  }
}

function printPrice(priceObj) {
  var url = window.location.pathname;

  if (priceObj) {
    if (priceObj.price == 0) {
      priceObj.shipping = 0;

      if (url == "/cart") {
        window.location.href = "/";
      } else if (url == "/checkout") {
        window.location.href = "/";
      }
    }

    if (!priceObj.shipping && priceObj.shipping !== 0) {
      priceObj.shipping = shippingGlobal;
    }

    let priorityDelivery = 0;
    let storedPD = localStorage.getItem("priorityDelivery");
    if (storedPD) {
      if (storedPD === "true") {
        priorityDelivery = 350;
        $("#checkout_priority").html(
          parseFloat(priorityDelivery).toFixed(2) + " RSD"
        );
        $("#priority_delivery_label").show();
      } else {
        $("#priority_delivery_label").hide();
      }
    }

    $("#checkout_total").html(
      parseFloat(priceObj.price + priceObj.shipping + priorityDelivery).toFixed(
        2
      ) + " RSD"
    );
    $("#checkout_shipping").html(
      parseFloat(priceObj.shipping).toFixed(2) + " RSD"
    );
    $("#checkout_subtotal").html(
      parseFloat(priceObj.price).toFixed(2) + " RSD"
    );
    $("#cart_dropdown_total_id").html(
      '<span>Ukpuno: </span id = "total_cart_id">' +
        parseFloat(
          priceObj.price + priceObj.shipping + priorityDelivery
        ).toFixed(2) +
        " RSD"
    );
    $("#cart_dropdown_total_id").attr(
      "data-value",
      parseFloat(priceObj.price + priceObj.shipping + priorityDelivery).toFixed(
        2
      )
    );
    console.log(
      parseFloat(priceObj.price + priceObj.shipping + priorityDelivery).toFixed(
        2
      )
    );

    $("#checkout_subtotal").html(
      parseFloat(priceObj.price).toFixed(2) + " RSD"
    );
    $("#cart_subtotal_id").html(parseFloat(priceObj.price).toFixed(2) + " RSD");
    $("#cart_shipping_id").html(
      parseFloat(priceObj.shipping).toFixed(2) + " RSD"
    );
    $("#cart_total_id").html(
      parseFloat(priceObj.shipping + priceObj.price + priorityDelivery).toFixed(
        2
      ) + " RSD"
    );
    $(".total_money_id").html(
      parseFloat(priceObj.shipping + priceObj.price + priorityDelivery).toFixed(
        2
      )
    );
    $(".delivery_id").html(parseFloat(priceObj.shipping).toFixed(2) + " RSD");
    $(".regular_price_id").html(parseFloat(priceObj.price).toFixed(2) + " RSD");
  }
}

function haveSpecialCode(response, vrati) {
  var code = response;
  var date = new Date().getTime();
  var currentCode = localStorage.getItem("specailCode");
  var price = localStorage.getItem("price");

  if (!code && currentCode) {
    currentCode = JSON.parse(currentCode);
    code = currentCode;
  }

  if (price) {
    price = JSON.parse(price);
  }

  if (code) {
    if (code.err) {
      promoCodeError(code.err);
      return false;
    }

    if (date < code.valid_until) {
      var price = JSON.parse(localStorage.getItem("price"));
      var codeProducts = code.product.split(","); // if (price.shipping == 0) {
      //     price.price = price.price - price.finalDiscountPrice;
      //     price.price -= (price.price * code.discount) / 100;
      //     if (price.price >= price.freeShippingPrice) {
      //         //price.shipping = 0;
      //     } else {
      //        // price.shipping = price.mainShippingdd;
      //     }
      // } else {
      //     price.price -= (price.price * code.discount) / 100;
      // }

      for (var i = 0; i < codeProducts.length; i++) {
        if (codeProducts[i] == "img") {
          price.price = (price.price * (100 - code.discount)) / 100;
        } else if (codeProducts[i] == "service") {
          if (price.localServicesPrice) {
            price.localServicesPrice -=
              (price.localServicesPrice * code.discount) / 100; // price.price += price.localServicesPrice;
          }
        } else if (codeProducts[i] == "product") {
          if (price.localProductPrice) {
            price.localProductPrice -=
              (price.localProductPrice * code.discount) / 100; //price.price += price.localProductPrice;
          }
        }
      }

      localStorage.setItem("specailCode", JSON.stringify(code));

      if (price.price >= price.freeShippingPrice) {
        price.shipping = 0;
      } else {
        price.shipping = price.mainShippingdd;
      }

      if (vrati) {
        return price.price;
      }

      $("#promo_code_div_id").css("display", "none");
      $("#promo_code_div_veryfied_id").html(
        "Kod sa imenom <b>"
          .concat(code.code, "</b> je aktiviran. Uračunat je popust od ")
          .concat(code.discount_text, "%") +
          '<a id="delete_promo_code_id" href="javascript:" style="color: red; display: block;">Poni\u0161tite kod</a>'
      );
      $("#promo_code_div_veryfied_id").css("display", "block");
    } else {
      promoCodeError("Uneti promo kod je istekao");
      localStorage.removeItem("specailCode");
    }
  } else {
    $("#promo_code_div_id").css("display", "block");
    $("#promo_code_div_veryfied_id").css("display", "none");
  }

  if (price) {
    if (price.localServicesPrice) {
      price.price += price.localServicesPrice;
    }

    if (price.localProductPrice) {
      price.price += price.localProductPrice;
    }

    price.price = smallFunction(price);
  }

  printPrice(price);
}
function applyPromoCode(promo_code) {
  if (!promo_code) {
    //  localStorage.removeItem('specailCode');
    //  getDiscountCommon();
    return;
  }

  $.post(
    "/promo-code",
    {
      code: promo_code.code,
    },
    function (response) {
      if (!response.err) {
        haveSpecialCode(response);
      } else {
        clearPromoCode();
        promoCodeError(response.err);
      }
    }
  );
}

function clearPromoCode() {
  $.get("/remove-promo-code");
}

function promoCodeError(err) {
  showPopUp({
    title: "Greška",
    text: err,
    btn1_value: "OK",
    btn1_callback: null,
    btn2_value: null,
    btn2_callback: null,
  });
  localStorage.removeItem("specailCode");
  $("#promo_code_id").val("");
  return;
}

function smallFunction(price) {
  var price2;

  if (price) {
    if (price.price == 0 || price.price) {
      price2 = price.price;
    } else {
      price2 = price;
    }

    if (price2 != 0) {
      var have20x30Free = false;
      var tenx13frame = JSON.parse(localStorage.getItem("frames"));
      var tenx13keys = Object.keys(tenx13frame); // for (var i = 0; i < tenx13keys.length; i++) {
      //     if (tenx13keys[i] == '13x18' && tenx13frame[tenx13keys[i]].quantity >= 100) {
      //         have20x30Free = true;
      //     }
      // }

      if (gift && gift.active == 1 && price2 >= gift.min_value) {
        have20x30Free = true;
        $(".poklon-poster").show();
      } else {
        have20x30Free = false;
        $(".poklon-poster").hide();
      }

      for (var i = 0; i < tenx13keys.length; i++) {
        if (tenx13keys[i] == "20x30" && have20x30Free) {
          var framepriceObj = JSON.parse(localStorage.getItem("framepriceObj"));

          var codeFromStorage = localStorage.getItem("specailCode");
          var currentCode = codeFromStorage
            ? JSON.parse(codeFromStorage)
            : null;

          var discount = currentCode ? currentCode.discount : 0;
          price2 -= parseFloat(
            (framepriceObj["20x30"] * (100 - discount)) / 100
          );
          have20x30Free = false;
          return price2;
        }
      }

      return price2;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getPriceData() {
  $.get("/getData", function (response) {
    var imgPrices = response.imgPrices;
    var discount = response.discount;
    var specialDiscount = response.specialDiscount;
    var mainShippingdd = response.shipping;
    var freeShippingPricess = response.freeShippingPrice;
    var haveSettings = localStorage.getItem("imgSettings");

    if (!haveSettings) {
      localStorage.setItem("imgSettings", JSON.stringify(imageSettings));
    }

    localStorage.setItem("specialDiscount", JSON.stringify(specialDiscount));
    localStorage.setItem("discount", JSON.stringify(discount));

    for (var i = 0; i < imgPrices.length; i++) {
      if (framepriceObj[imgPrices[i].frameSize]) {
      } else {
        framepriceObj[imgPrices[i].frameSize] = imgPrices[i].price;
      }
    } // genereteFinalPriceCommon({
    //     price: price,
    //     finalDiscountPrice: finalDiscountPrice,
    //     picNum: keys.length,
    //     imgQuantity: imgQuantity,
    //     freeShippingPrice: freeShippingPrice,
    //     mainShippingdd: localShipping.mainShippingdd
    // });

    localStorage.setItem("framepriceObj", JSON.stringify(framepriceObj));
    localStorage.setItem(
      "price",
      JSON.stringify({
        finalDiscountPrice: 0,
        freeShippingPrice: freeShippingPricess,
        imgQuantity: 0,
        localServicesPrice: 0,
        picNum: 0,
        price: 0,
        serviceNum: 0,
        mainShippingdd: mainShippingdd,
        shipping: 0,
        priorityDelivery: false,
      })
    );
  });
}

function checkLocalStorageIntegrity() {
  if (!localStorage.getItem("frames")) {
    localStorage.setItem("frames", "{}");
  }

  if (!localStorage.getItem("imgServices")) {
    localStorage.setItem("imgServices", "{}");
  }
}

function sendVisitData() {
  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get("utm_source");
  const utm_medium = urlParams.get("utm_medium");
  const utm_campaign = urlParams.get("utm_campaign") || "nocampaign";

  // Samo ako postoji neka kampanja, pokrećemo sve
  if (utm_source || utm_medium || utm_campaign !== "nocampaign") {
    let visitToken = localStorage.getItem("visit_token");
    if (!visitToken) {
      const uuid = window.crypto?.randomUUID
        ? crypto.randomUUID()
        : generateUUID();
      visitToken = `${uuid}-${utm_campaign}`;
      localStorage.setItem("visit_token", visitToken);
    }

    if (window.fetch) {
      fetch("/ad-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit_token: visitToken,
          utm_source,
          utm_medium,
          utm_campaign,
          user_agent: navigator.userAgent,
        }),
      }).catch((err) => {
        console.warn("Greška u slanju ad-click podataka:", err);
      });
    }
  }
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function logError(data) {
  $.ajax({
    type: "post",
    url: "log_error",
    // or whatever
    data: data,
    success: function success(response) {
      console.log(response);
    },
  });
}

function rollbar() {
  var _rollbarConfig = {
    accessToken: "db71c2f64fe64d138f0f3743d47d003d",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: "production",
    },
  }; // Rollbar Snippet

  !(function (r) {
    var e = {};

    function o(n) {
      if (e[n]) return e[n].exports;
      var t = (e[n] = {
        i: n,
        l: !1,
        exports: {},
      });
      return r[n].call(t.exports, t, t.exports, o), (t.l = !0), t.exports;
    }

    (o.m = r),
      (o.c = e),
      (o.d = function (r, e, n) {
        o.o(r, e) ||
          Object.defineProperty(r, e, {
            enumerable: !0,
            get: n,
          });
      }),
      (o.r = function (r) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(r, Symbol.toStringTag, {
            value: "Module",
          }),
          Object.defineProperty(r, "__esModule", {
            value: !0,
          });
      }),
      (o.t = function (r, e) {
        if ((1 & e && (r = o(r)), 8 & e)) return r;
        if (4 & e && "object" == _typeof(r) && r && r.__esModule) return r;
        var n = Object.create(null);
        if (
          (o.r(n),
          Object.defineProperty(n, "default", {
            enumerable: !0,
            value: r,
          }),
          2 & e && "string" != typeof r)
        )
          for (var t in r) {
            o.d(
              n,
              t,
              function (e) {
                return r[e];
              }.bind(null, t)
            );
          }
        return n;
      }),
      (o.n = function (r) {
        var e =
          r && r.__esModule
            ? function () {
                return r["default"];
              }
            : function () {
                return r;
              };
        return o.d(e, "a", e), e;
      }),
      (o.o = function (r, e) {
        return Object.prototype.hasOwnProperty.call(r, e);
      }),
      (o.p = ""),
      o((o.s = 0));
  })([
    function (r, e, o) {
      var n = o(1),
        t = o(4);
      (_rollbarConfig = _rollbarConfig || {}),
        (_rollbarConfig.rollbarJsUrl =
          _rollbarConfig.rollbarJsUrl ||
          "https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.14.4/rollbar.min.js"),
        (_rollbarConfig.async =
          void 0 === _rollbarConfig.async || _rollbarConfig.async);
      var a = n.setupShim(window, _rollbarConfig),
        l = t(_rollbarConfig);
      (window.rollbar = n.Rollbar),
        a.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, l);
    },
    function (r, e, o) {
      var n = o(2);

      function t(r) {
        return function () {
          try {
            return r.apply(this, arguments);
          } catch (r) {
            try {
              console.error("[Rollbar]: Internal error", r);
            } catch (r) {}
          }
        };
      }

      var a = 0;

      function l(r, e) {
        (this.options = r), (this._rollbarOldOnError = null);
        var o = a++;
        (this.shimId = function () {
          return o;
        }),
          "undefined" != typeof window &&
            window._rollbarShims &&
            (window._rollbarShims[o] = {
              handler: e,
              messages: [],
            });
      }

      var i = o(3),
        s = function s(r, e) {
          return new l(r, e);
        },
        d = function d(r) {
          return new i(s, r);
        };

      function c(r) {
        return t(function () {
          var e = Array.prototype.slice.call(arguments, 0),
            o = {
              shim: this,
              method: r,
              args: e,
              ts: new Date(),
            };

          window._rollbarShims[this.shimId()].messages.push(o);
        });
      }

      (l.prototype.loadFull = function (r, e, o, n, a) {
        var l = !1,
          i = e.createElement("script"),
          s = e.getElementsByTagName("script")[0],
          d = s.parentNode;
        (i.crossOrigin = ""),
          (i.src = n.rollbarJsUrl),
          o || (i.async = !0),
          (i.onload = i.onreadystatechange =
            t(function () {
              if (
                !(
                  l ||
                  (this.readyState &&
                    "loaded" !== this.readyState &&
                    "complete" !== this.readyState)
                )
              ) {
                i.onload = i.onreadystatechange = null;

                try {
                  d.removeChild(i);
                } catch (r) {}

                (l = !0),
                  (function () {
                    var e;

                    if (void 0 === r._rollbarDidLoad) {
                      e = new Error("rollbar.js did not load");

                      for (
                        var o, n, t, l, i = 0;
                        (o = r._rollbarShims[i++]);

                      ) {
                        for (o = o.messages || []; (n = o.shift()); ) {
                          for (t = n.args || [], i = 0; i < t.length; ++i) {
                            if ("function" == typeof (l = t[i])) {
                              l(e);
                              break;
                            }
                          }
                        }
                      }
                    }

                    "function" == typeof a && a(e);
                  })();
              }
            })),
          d.insertBefore(i, s);
      }),
        (l.prototype.wrap = function (r, e, o) {
          try {
            var n;
            if (
              ((n =
                "function" == typeof e
                  ? e
                  : function () {
                      return e || {};
                    }),
              "function" != typeof r)
            )
              return r;
            if (r._isWrap) return r;
            if (
              !r._rollbar_wrapped &&
              ((r._rollbar_wrapped = function () {
                o && "function" == typeof o && o.apply(this, arguments);

                try {
                  return r.apply(this, arguments);
                } catch (o) {
                  var e = o;
                  throw (
                    (e &&
                      ("string" == typeof e && (e = new String(e)),
                      (e._rollbarContext = n() || {}),
                      (e._rollbarContext._wrappedSource = r.toString()),
                      (window._rollbarWrappedError = e)),
                    e)
                  );
                }
              }),
              (r._rollbar_wrapped._isWrap = !0),
              r.hasOwnProperty)
            )
              for (var t in r) {
                r.hasOwnProperty(t) && (r._rollbar_wrapped[t] = r[t]);
              }
            return r._rollbar_wrapped;
          } catch (e) {
            return r;
          }
        });

      for (
        var p =
            "log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleAnonymousErrors,handleUnhandledRejection,captureEvent,captureDomContentLoaded,captureLoad".split(
              ","
            ),
          u = 0;
        u < p.length;
        ++u
      ) {
        l.prototype[p[u]] = c(p[u]);
      }

      r.exports = {
        setupShim: function setupShim(r, e) {
          if (r) {
            var o = e.globalAlias || "Rollbar";
            if ("object" == _typeof(r[o])) return r[o];
            (r._rollbarShims = {}), (r._rollbarWrappedError = null);
            var a = new d(e);
            return t(function () {
              e.captureUncaught &&
                ((a._rollbarOldOnError = r.onerror),
                n.captureUncaughtExceptions(r, a, !0),
                e.wrapGlobalEventHandlers && n.wrapGlobals(r, a, !0)),
                e.captureUnhandledRejections &&
                  n.captureUnhandledRejections(r, a, !0);
              var t = e.autoInstrument;
              return (
                !1 !== e.enabled &&
                  (void 0 === t ||
                    !0 === t ||
                    ("object" == _typeof(t) && t.network)) &&
                  r.addEventListener &&
                  (r.addEventListener("load", a.captureLoad.bind(a)),
                  r.addEventListener(
                    "DOMContentLoaded",
                    a.captureDomContentLoaded.bind(a)
                  )),
                (r[o] = a),
                a
              );
            })();
          }
        },
        Rollbar: d,
      };
    },
    function (r, e) {
      function o(r, e, o) {
        if (e.hasOwnProperty && e.hasOwnProperty("addEventListener")) {
          for (
            var n = e.addEventListener;
            n._rollbarOldAdd && n.belongsToShim;

          ) {
            n = n._rollbarOldAdd;
          }

          var t = function t(e, o, _t) {
            n.call(this, e, r.wrap(o), _t);
          };

          (t._rollbarOldAdd = n),
            (t.belongsToShim = o),
            (e.addEventListener = t);

          for (
            var a = e.removeEventListener;
            a._rollbarOldRemove && a.belongsToShim;

          ) {
            a = a._rollbarOldRemove;
          }

          var l = function l(r, e, o) {
            a.call(this, r, (e && e._rollbar_wrapped) || e, o);
          };

          (l._rollbarOldRemove = a),
            (l.belongsToShim = o),
            (e.removeEventListener = l);
        }
      }

      r.exports = {
        captureUncaughtExceptions: function captureUncaughtExceptions(r, e, o) {
          if (r) {
            var n;
            if ("function" == typeof e._rollbarOldOnError)
              n = e._rollbarOldOnError;
            else if (r.onerror) {
              for (n = r.onerror; n._rollbarOldOnError; ) {
                n = n._rollbarOldOnError;
              }

              e._rollbarOldOnError = n;
            }
            e.handleAnonymousErrors();

            var t = function t() {
              var o = Array.prototype.slice.call(arguments, 0);
              !(function (r, e, o, n) {
                r._rollbarWrappedError &&
                  (n[4] || (n[4] = r._rollbarWrappedError),
                  n[5] || (n[5] = r._rollbarWrappedError._rollbarContext),
                  (r._rollbarWrappedError = null));
                var t = e.handleUncaughtException.apply(e, n);
                o && o.apply(r, n),
                  "anonymous" === t && (e.anonymousErrorsPending += 1);
              })(r, e, n, o);
            };

            o && (t._rollbarOldOnError = n), (r.onerror = t);
          }
        },
        captureUnhandledRejections: function captureUnhandledRejections(
          r,
          e,
          o
        ) {
          if (r) {
            "function" == typeof r._rollbarURH &&
              r._rollbarURH.belongsToShim &&
              r.removeEventListener("unhandledrejection", r._rollbarURH);

            var n = function n(r) {
              var o, n, t;

              try {
                o = r.reason;
              } catch (r) {
                o = void 0;
              }

              try {
                n = r.promise;
              } catch (r) {
                n = "[unhandledrejection] error getting `promise` from event";
              }

              try {
                (t = r.detail), !o && t && ((o = t.reason), (n = t.promise));
              } catch (r) {}

              o ||
                (o = "[unhandledrejection] error getting `reason` from event"),
                e &&
                  e.handleUnhandledRejection &&
                  e.handleUnhandledRejection(o, n);
            };

            (n.belongsToShim = o),
              (r._rollbarURH = n),
              r.addEventListener("unhandledrejection", n);
          }
        },
        wrapGlobals: function wrapGlobals(r, e, n) {
          if (r) {
            var t,
              a,
              l =
                "EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(
                  ","
                );

            for (t = 0; t < l.length; ++t) {
              r[(a = l[t])] && r[a].prototype && o(e, r[a].prototype, n);
            }
          }
        },
      };
    },
    function (r, e) {
      function o(r, e) {
        (this.impl = r(e, this)),
          (this.options = e),
          (function (r) {
            for (
              var e = function e(r) {
                  return function () {
                    var e = Array.prototype.slice.call(arguments, 0);
                    if (this.impl[r]) return this.impl[r].apply(this.impl, e);
                  };
                },
                o =
                  "log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleAnonymousErrors,handleUnhandledRejection,_createItem,wrap,loadFull,shimId,captureEvent,captureDomContentLoaded,captureLoad".split(
                    ","
                  ),
                n = 0;
              n < o.length;
              n++
            ) {
              r[o[n]] = e(o[n]);
            }
          })(o.prototype);
      }

      (o.prototype._swapAndProcessMessages = function (r, e) {
        var o, n, t;

        for (this.impl = r(this.options); (o = e.shift()); ) {
          (n = o.method),
            (t = o.args),
            this[n] &&
              "function" == typeof this[n] &&
              ("captureDomContentLoaded" === n || "captureLoad" === n
                ? this[n].apply(this, [t[0], o.ts])
                : this[n].apply(this, t));
        }

        return this;
      }),
        (r.exports = o);
    },
    function (r, e) {
      r.exports = function (r) {
        return function (e) {
          if (!e && !window._rollbarInitialized) {
            for (
              var o,
                n,
                t = (r = r || {}).globalAlias || "Rollbar",
                a = window.rollbar,
                l = function l(r) {
                  return new a(r);
                },
                i = 0;
              (o = window._rollbarShims[i++]);

            ) {
              n || (n = o.handler),
                o.handler._swapAndProcessMessages(l, o.messages);
            }

            (window[t] = n), (window._rollbarInitialized = !0);
          }
        };
      };
    },
  ]); // End Rollbar Snippet
}
