"use strict";

var image = {};
var serviceOrder = {};
var key;
var serviceName;
var uploaded = false;
var overvrite = false;
$(document).ready(function () {
  // serviceName = $(location).attr('pathname');
  // serviceName = 'Majce';
  // var regex = new RegExp('[0-9]/(.+?)"');
  // serviceName = regex.exec(serviceName);
  if (editServiceOrder) {
    serviceOrder[editServiceOrder.imgId2] = {};
    serviceOrder[editServiceOrder.imgId2] = editServiceOrder;
    key = editServiceOrder.imgId2;
    $("#service_option [value = \"".concat(editServiceOrder.variationId, "\"]")).prop('selected', true);
    overvrite = true;
  }

  uploadedServiceImg();
  $(document).on("change", "#add_image", function () {
    if (this.files.length > 1) {
      showPopUp({
        title: "Greška",
        text: "Za ovaj proizvod možete odabrati samo jednu fotografiju.",
        btn1_value: "U redu",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
    } else {
      if (this.files && this.files[0].size) {
        if (this.files[0].size < 150000) {
          showPopUp({
            title: "Greška",
            text: "Fotografija koju ste odabrali nije dovoljno dobrog kvaliteta za izradu na visokom formatu kakav je 20x30 ili 30x40. Odaberite fotografiju boljeg kvaliteta.",
            btn1_value: "U redu",
            btn1_callback: null,
            btn2_value: null,
            btn2_callback: null
          });
          return;
        }
      }

      uploadServiceImage(this.files);
      $(this).val('');
    }
  });
  $(document).on("click", "#service_to_cart", function () {
    if (serviceOrder[key].variationId) {
      confirmService();
      $("#service_price").html("---");
      $('#itemAddedMsgContainer').show();
      setTimeout(function () {
        $('#itemAddedMsgContainer').hide();
      }, 5000);
    } else {
      showPopUp({
        title: "Greška",
        text: "Unesite varijantu za servis",
        btn1_value: "OK",
        btn1_callback: null,
        btn2_value: null,
        btn2_callback: null
      });
    }
  });
  $(document).on("change", "#service_option", function () {
    $('#service_to_cart').attr("class", 'black-button button');
    var variationId = $("#service_option option:selected").val();
    var serviceId = $("#service_option option:selected").attr('data-service');
    var cost = $("#service_option option:selected").attr('data-value');
    var quantity = $("#quantity").val();
    $('#service_price').html(cost * quantity + ".00 RSD");
    $('#quantity_input_service').attr("class", 'input-group');
    serviceOrder[key].serviceId = serviceId;
    serviceOrder[key].variationId = variationId;
    serviceOrder[key].totalPrice = cost * quantity;
  });
  $(document).on("click", "#service_btn_plus", function () {
    var quantity = $("#quantity").val();
    quantity = parseInt(quantity) + 1;
    serviceOrder[key].quantity = quantity;
    $("#quantity").val(quantity);
    var cost = $("#service_option option:selected").attr('data-value');
    $('#service_price').html(cost * quantity + ".00 RSD");
    serviceOrder[key].totalPrice = cost * quantity;
  });
  $(document).on("click", "#service_btn_minus", function () {
    var quantity = parseInt($("#quantity").val());

    if (quantity > 1) {
      quantity = parseInt(quantity) - 1;
      serviceOrder[key].quantity = quantity;
      $("#quantity").val(quantity);
      var cost = $("#service_option option:selected").attr('data-value');
      $('#service_price').html(cost * quantity + ".00 RSD");
      serviceOrder[key].totalPrice = cost * quantity;
    } else {
      $("#quantity").val(1);
    }
  });
});

function quantityUpdate(dd) {
  var quantity;
  quantity = /^\d*$/.test($(dd).val());

  if (quantity) {
    quantity = $(dd).val();
  } else {
    quantity = 1;
  }

  if (quantity < 0 || quantity == 0) {
    $(dd).val(1);
    quantity = 1;
  }

  $(dd).val(quantity);

  if (quantity > 1) {
    quantity = parseInt(quantity);
  }

  var cost = $("#service_option option:selected").attr('data-value');
  $('#service_price').html(cost * quantity + ".00 RSD");
  serviceOrder[key].quantity = quantity;
  serviceOrder[key].totalPrice = cost * quantity;
}

function confirmService() {
  if (!serviceOrder) {
    alert('nista niste odabrali');
    return;
  }

  var tempServiceOrder;
  tempServiceOrder = localStorage.getItem('imgServices');

  if (tempServiceOrder != null && tempServiceOrder != null && overvrite == false && tempServiceOrder != '') {
    tempServiceOrder = JSON.parse(tempServiceOrder);
    var tempkey = Object.keys(serviceOrder);
    tempServiceOrder[tempkey['0']] = serviceOrder[tempkey[0]];
    serviceOrder = tempServiceOrder;
    localStorage.setItem("imgServices", JSON.stringify(serviceOrder));
  } else if (overvrite == true) {
    tempServiceOrder = JSON.parse(tempServiceOrder);
    tempServiceOrder[key] = serviceOrder[key];
    localStorage.setItem("imgServices", JSON.stringify(tempServiceOrder));
    overvrite = false;
  } else {
    localStorage.setItem("imgServices", JSON.stringify(serviceOrder));
  }

  getDiscountCommon();
  $('.image-box').html('');
  key = undefined;
  serviceOrder = {};
  dropDownCart();
  uploadedServiceImg();
}

function uploadedServiceImg() {
  if (key == undefined) {
    $('#service_option').prop('selectedIndex', 0);
    $('#service_option').attr("disabled", true);
    $("#quantity").val(0);
    $('#quantity_input_service').attr("class", 'input-group disabled');
    $('#service_to_cart').attr("class", 'black-button button disabled');
    $('#service_upload_btn').attr("class", 'upload-photo-button');
  } else {
    $('#service_upload_btn').attr("class", 'upload-photo-button disabled'); // $('#quantity_input_service').attr("class", 'input-group');

    $('#service_option').attr("disabled", false);
    $('#service_option').prop('selectedIndex', 1).change(); // $('#service_to_cart').attr("class", 'black-button button');
  }

  if ($("#service_option option:selected").attr('data-service')) {
    $('#service_to_cart').attr("class", 'black-button button');
    $('#quantity_input_service').attr("class", 'input-group');
  }
}

function getServicePrice() {
  var totalMoney = $('#cart_dropdown_total_id').attr('data-value');
  totalMoney = serviceOrder[key].totalPrice;
  $('#cart_dropdown_total_id').attr('data-value', parseFloat(totalMoney).toFixed(2));
  var quantity = $("#quantity").val();
  var html = drawImageServiceCart(quantity);
  $('.cart-products-list').html(html);
}

function drawServiceImg() {
  var html = "\n        <p>Fotografija koju ste poslali:</p>\n        <div class=\"uploaded-photo\">\n            <img id ='service_photo_id' src=\"".concat(serviceOrder[key].imgSrc, "\">\n            <button  data-id = \"").concat(key, "\" type=\"button\" class=\"close\" aria-label=\"Close\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n        </div>\n ");
  $('.image-box').append(html);
  $('#quantity').html(serviceOrder[key].quantity);
}

function service_btn_delete(e) {
  var id = $(e).attr('data-id');
  $('.uploaded-photo').remove();
  $('#detailsUploadedPhotoContainer').hide();
  $('#quantity').val(0);
  delete serviceOrder[id];
  key = undefined;
  uploadedServiceImg();
}

function uploadServiceImage(files) {
  var html = '';
  var uploadedPhotoCloseBtn = "<button onclick= 'service_btn_delete(this)' type=\"button\" class=\"close\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>";

  for (var i = 0; i < files.length; i++) {
    html += "\n            <div class=\"uploaded-photo services-uploaded-photo\">\n                <img id ='service_photo_id' src=\"\" style=\"display: none;\">\n            </div>\n        ";
  }

  $('.image-box').append(html);
  $('#progress_div').css('display', 'flex');
  $("#quantity").val(1);
  $('#percent1').css('display', 'flex');
  $('#itemAddedMsgContainer').hide(); // $('#quantity_input_service').attr("class", 'input-group');
  // $('#service_option').attr("disabled", false);

  $('#service_upload_btn').attr("class", 'upload-photo-button disabled');
  var data = new FormData();
  var uid = generateUUID();
  key = uid;
  data.append('file', files[0]);
  data.append('picuuid', uid);
  $.ajax({
    xhr: function xhr() {
      var xhr = new window.XMLHttpRequest();
      var uidForSingleImage = uid;
      uploaded = false; //Upload progress

      xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          if (!serviceOrder[uidForSingleImage]) {
            serviceOrder[uidForSingleImage] = {};
            serviceOrder[uidForSingleImage].quantity = 1;
            serviceOrder[uidForSingleImage].imgId = "";
            serviceOrder[uidForSingleImage].imgSrc = "";
            serviceOrder[uidForSingleImage].serviceName = "";
          }

          var percentComplete = (evt.loaded / evt.total * 100).toFixed(0);
          $('#percent1').css('width', percentComplete + '%');

          if (percentComplete >= 55) {
            $('#percentageOutput').css({
              "color": "#fff"
            });
          } else {
            $('#percentageOutput').css({
              "color": "#000"
            });
          }

          $('#percentageOutput').text(percentComplete + '%'); //Do something with upload progress
        }
      }, false);
      return xhr;
    },
    url: "/upload",
    type: "POST",
    data: data,
    enctype: 'multipart/form-data',
    processData: false,
    // tell jQuery not to process the data
    contentType: false,
    // tell jQuery not to set contentType
    cache: false,
    success: function success(response) {
      if (response) {
        var isOk = checkImageOrientation(response);

        if (!isOk) {
          $('#progress_div').css('display', 'none');
          $('#percent1').css('display', 'none');
          $('.uploaded-photo').remove();
          $('#service_upload_btn').attr("class", 'upload-photo-button');
          showPopUp({
            title: "Greška",
            text: "Za izradu ovog predmeta potrebna je fotografija " + getServiceOrientationName() + " orijentacije kako ne bi došlo do sečenja bitnih delova fotografije u toku izrade. Molimo vas da odaberete fotografiju " + getServiceOrientationName() + ' orijentacije.',
            btn1_value: "U redu",
            btn1_callback: null,
            btn2_value: null,
            btn2_callback: null
          });
          return;
        }

        image[response.pId] = response;
        serviceOrder[response.pId] = {};
        var quantity = $("#quantity").val();
        serviceOrder[response.pId].quantity = quantity;
        serviceOrder[response.pId].imgId = response.imgId;
        serviceOrder[response.pId].imgId2 = response.pId;
        serviceOrder[response.pId].imgSrc = response.imgSrc;
        serviceOrder[response.pId].serviceName = serviceName;
        serviceOrder[response.pId].serviceSubName = editServiceOrder.sub_name;
        serviceOrder[response.pId].serviceImage = editServiceOrder.image;
        $('#progress_div').css('display', 'none');
        $('#percent1').css('display', 'none');
        $('#service_photo_id').attr('src', response.imgSrc);
        $('#service_photo_id').show();
        $('#detailsUploadedPhotoContainer').show();
        $('.services-uploaded-photo').append(uploadedPhotoCloseBtn);
        $('#quantity').val(serviceOrder[response.pId].quantity); // $('#service_option>option:eq(0)').attr('selected', false);
        // $('#service_option>option:eq(1)').attr('selected', true);

        uploaded = true;
        uploadedServiceImg();
      }
    }
  });
}

function checkImageOrientation(image) {
  if (!editServiceOrder.img_orientation) return true;

  if (image.width > image.height && editServiceOrder.img_orientation != 'horizontal') {
    return false;
  }

  if (image.width < image.height && editServiceOrder.img_orientation != 'vertical') {
    return false;
  }

  return true;
}

function getServiceOrientationName() {
  if (editServiceOrder.img_orientation == 'vertical') {
    return 'vertikalne';
  } else {
    return 'horizontalne';
  }
}

function drawThisImage() {
  var tempServiceOrder;
  tempServiceOrder = localStorage.getItem('imgServices');

  if (tempServiceOrder) {
    tempServiceOrder = JSON.parse(tempServiceOrder);
    serviceOrder = tempServiceOrder;
    key = Object.keys(tempServiceOrder);
    drawServiceImg();
  }
}

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp

  var d2 = performance && performance.now && performance.now() * 1000 || 0; //Time in microseconds since page-load or 0 if unsupported

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16

    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }

    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}