"use strict";

var images = {};
var generatePicSizeHtml = ''; // var shipping = 190;

var defaultFrameSize = '10x15';
var imgNum = 0;
var discountPrice = {};
var framepriceObj = {};
var frames = {};
var uploadInProgres = false;
var frame;
var priceObj;
var uploadInProgres = false;
var imageDelete = {}; // var freeShippingPricess = 2500;

var MAX_THREADS = 2;
var FREE_THREADS = MAX_THREADS;
var imageSettings = {
  sjajni: '1',
  mat: '0',
  iseciSliku: '1',
  popunitiBelim: '0'
};
var defaultFramePrice = {
  realPrice: 0,
  userPrice: 0
};
$(document).ready(function () {
  getDiscount();
  var haveSettings = localStorage.getItem('imgSettings');

  if (haveSettings) {
    imageSettings = JSON.parse(haveSettings);
    haveSettingsFunction();
  } else {
    localStorage.setItem("imgSettings", JSON.stringify(imageSettings));
  }

  localStorage.setItem("specialDiscount", JSON.stringify(specialDiscount));
  localStorage.setItem("discount", JSON.stringify(discount));
  $('#calasic_photo_sizes').html('');
  $('#calasic_photo_sizes_mobile').html('');
  $('#calasic_photo_sizes_insta_mob').html('');
  $('#calasic_photo_sizes_insta').html('');

  for (var i = 0; i < imgPrices.length; i++) {
    var splited = imgPrices[i].frameSize.split('x');

    if (splited[0] != splited[1]) {
      var html = "\n            <label class=\"radio-button\">".concat(imgPrices[i].frameSize, "\n                <input type=\"radio\" value=").concat(imgPrices[i].frameSize, " name=\"photo-format\" onclick=\"ResizeImagesRadio(this)\">\n                <span class=\"checkmark\"></span>\n            </label>");
      $('#calasic_photo_sizes').append(html);
      html = "\n            <label class=\"radio-button\">".concat(imgPrices[i].frameSize, "\n                <input type=\"radio\" value=").concat(imgPrices[i].frameSize, " name=\"photo-format-mobile\" onclick=\"ResizeImagesRadio(this)\">\n                <span class=\"checkmark\"></span>\n            </label>");
      $('#calasic_photo_sizes_mobile').append(html);
    } else {
      var html = "\n            <label class=\"radio-button\">".concat(imgPrices[i].frameSize, "\n                <input type=\"radio\" value=\"").concat(imgPrices[i].frameSize, "\" name=\"photo-format\" onclick=\"ResizeImagesRadio(this)\">\n                <span class=\"checkmark\"></span>\n            </label>");
      $('#calasic_photo_sizes_insta').append(html);
      html = "\n            <label class=\"radio-button\">".concat(imgPrices[i].frameSize, "\n                <input type=\"radio\" value=\"").concat(imgPrices[i].frameSize, "\" name=\"photo-format-mobile\" onclick=\"ResizeImagesRadio(this)\">\n                <span class=\"checkmark\"></span>\n            </label>");
      $('#calasic_photo_sizes_insta_mob').append(html);
    }

    if (framepriceObj[imgPrices[i].frameSize]) {} else {
      framepriceObj[imgPrices[i].frameSize] = imgPrices[i].price;
    }
  }

  localStorage.setItem("framepriceObj", JSON.stringify(framepriceObj));

  if (imgPrices) {
    for (var i = 0; i < imgPrices.length; i++) {
      if (defaultFrameSize == imgPrices[i].frameSize) {
        defaultFramePrice.userPrice = imgPrices[i].price;
        defaultFramePrice.realPrice = imgPrices[i].realPrice;
        break;
      }
    }
  }

  for (var z = 0; z < imgPrices.length; z++) {
    generatePicSizeHtml = generatePicSizeHtml + " <option value=\"".concat(imgPrices[z].frameSize, "\">").concat(imgPrices[z].frameSize, "</option> ");
  }

  var localStorageImages = localStorage.getItem('img');

  if (localStorageImages) {
    var imagesArray = JSON.parse(localStorageImages);
    images = imagesArray;

    if (Object.keys(imagesArray).length != 0) {
      imagesFromLocalStorage(imagesArray);
    }
  }

  $(document).on('change', '.img_option_class', function (d) {
    var id = $(this).val();
    var uid = $(this).closest('.image-box').attr('data-id');
    var image = images[uid];

    if (image) {
      image.frameSize = id;
      localStorage.setItem("img", JSON.stringify(images));
      getSmile(uid);
      getDiscount();
    }
  });
  $(document).on("click", '.minus', function (e) {
    var uid = $(this).attr('data-id');
    var quantity = $("#img_quantity_".concat(uid)).val();

    if (quantity > 1) {
      quantity = parseFloat(quantity) - 1;
    }

    $("#img_quantity_".concat(uid)).val(quantity);
    images[uid].quantity = parseFloat(quantity);
    localStorage.setItem("img", JSON.stringify(images));
    getDiscount();
  });
  $(document).on("click", '.delete_everetyng', function (e) {
    showPopUp({
      title: "Obaveštenje",
      text: "Da li želite da obrišete sve forografije?",
      btn1_value: "OK",
      btn1_callback: function btn1_callback() {
        deleteEverything();
      },
      btn2_value: 'Ne',
      btn2_callback: null
    }); // var imageKeys = Object.keys(images);
    // var ids = [];
    // for (var i in imageKeys) {
    //     imageDelete[imageKeys[i]] = true;
    //     if (images[imageKeys[i]].id) {
    //         ids.push(images[imageKeys[i]].id);
    //     }
    // }
    // var idsStrings = ids.join();
    // if (idsStrings) {
    //     $.post('/deleted', { ids: idsStrings });
    // }
    // images = {};
    // localStorage.setItem("img", JSON.stringify(images));
    // var imageBox = document.querySelector('.image-box');
    // document.getElementById('uploaded-photos').innerHTML = '';
    // document.getElementById('deleteAllButton').style.display = 'none';
    // document.getElementById('deleteAllButton_mobile').style.display = 'none';
    // getDiscount();
  });
  $(document).on("click", '.order_now_id', function (e) {
    window.location = '/cart';
  });
  $(document).on("click", '.delete_img_class, .photo-delete-btn', function (e) {
    var image_box = $(this).attr('id');

    if (!images[image_box]) {
      $(this).parent().remove();
      return;
    }

    if (images[image_box].id) {
      $.post('/deleted', {
        ids: images[image_box].id
      });
    }

    var imageBox = document.getElementsByClassName('image-box'); //image_box.remove();

    $("#image_id_".concat(image_box)).remove();
    var id = $(this).closest('.image-box').attr('data-id');
    imageDelete[id] = true;

    if (images[id]) {
      delete images[id];
    }

    localStorage.setItem("img", JSON.stringify(images));
    getDiscount();
  });
  $(document).on("click", '.plus', function (e) {
    var uid = $(this).attr('data-id');
    var quantity = $("#img_quantity_".concat(uid)).val();
    quantity = parseFloat(quantity) + 1;
    $("#img_quantity_".concat(uid)).val(quantity);
    images[uid].quantity = quantity;
    localStorage.setItem("img", JSON.stringify(images));
    getDiscount();
  });
  $(document).on("change", "#add_image", function () {
    uploadImages(this.files);
    fbq('trackCustom', 'Upload Started');
    gtag('event', 'Upload Started');
    $(this).val('');
  });
});

function imageOption(dd) {
  var value = $(dd).val();
  $(".button-checkbox").find('input[value = "' + value + '"]').each(function () {
    if ($(this).prop("checked") == false) {
      $(this).prop("checked", true);
    }
  });

  switch (value) {
    case "Sjajni":
      imageSettings.sjajni = 1;
      imageSettings.mat = 0;
      break;

    case "Mat":
      imageSettings.sjajni = 0;
      imageSettings.mat = 1;
      break;

    case "Iseći-Sliku":
      imageSettings.iseciSliku = 1;
      imageSettings.popunitiBelim = 0;
      break;

    case "Popuniti-Belim":
      imageSettings.iseciSliku = 0;
      imageSettings.popunitiBelim = 1;
      break;
  }

  var data = JSON.stringify(imageSettings);
  localStorage.setItem("imgSettings", JSON.stringify(imageSettings));
}

function ResizeImagesRadio(dd) {
  var val = {};
  val.frameSize = $(dd).val(); // $(`.radio-button`).find('input[value = "' + val.frameSize + '"]').prop("checked", true);

  $(".radio-button").find('input[value = "' + val.frameSize + '"]').each(function () {
    if ($(this).prop("checked") == false) {
      $(this).prop("checked", true);
    }
  });
  var keys = Object.keys(images);

  for (var i = 0; i < keys.length; i++) {
    images[keys[i]].frameSize = val.frameSize;
    getSmile(keys[i]);
  }

  $(".img_option_class").val(val.frameSize);
  localStorage.setItem("img", JSON.stringify(images));
  getDiscount();
}

function getFramePrice(image) {
  var price = {
    real: 0,
    userPrice: 0
  };

  for (var i = 0; i < imgPrices.length; i++) {
    if (image.frameSize == imgPrices[i].frameSize) {
      price.userPrice = parseFloat(imgPrices[i].price);
      price.real = parseFloat(imgPrices[i].realPrice);
      return price;
    }
  }
}

function imagesFromLocalStorage(images) {
  var keys = Object.keys(images);

  for (var i = 0; i < keys.length; i++) {
    if (images[keys[i]].height) {
      var img = images[keys[i]];
      img.local = true;
      drawImage(img);
    } else {
      delete images[keys[i]];
      localStorage.setItem("img", JSON.stringify(images));
    }
  }
}

var uploadInterval;
var globalFiles = [];

function getNextImageToUpload() {
  for (var i = 0; i < globalFiles.length; i++) {
    if (!globalFiles[i].sentStarted) return globalFiles[i];
  }

  return null;
}

function checkForImageUpload() {
  if (FREE_THREADS == 0) return;
  var exit = true;

  while (FREE_THREADS > 0) {
    for (var i = 0; i < globalFiles.length; i++) {
      if (globalFiles[i].sentStarted == false) {
        exit = false;
      }
    }

    if (exit) {
      break;
    }

    var file = getNextImageToUpload();

    if (!file) {
      clearInterval(uploadInterval);
      return;
    }

    startFileUpload(file);
    FREE_THREADS--;
  }
}

function startFileUpload(file) {
  file.sentStarted = true; // var fileToSend = file; 

  var data = new FormData();
  var uid = file.uuid;
  data.append('file', file);
  data.append('picuuid', uid); // drawImage(uid);

  $.ajax({
    xhr: function xhr() {
      var xhr = new window.XMLHttpRequest();
      var uidForSingleImage = uid; //Upload progress

      xhr.upload.addEventListener(
        "progress",
        function (evt) {
          if (evt.lengthComputable) {
            if (imageDelete[uidForSingleImage] == true) {
              delete imageDelete[uidForSingleImage];
              FREE_THREADS++;
              xhr.abort();
            }

            var percentComplete = ((evt.loaded / evt.total) * 100).toFixed(0);
            $("#image_smile_id_" + uidForSingleImage).css("display", "none");
            $("#progress_bar_id_" + uidForSingleImage).css("display", "flex");
            $("#bar_id" + uidForSingleImage).css(
              "width",
              percentComplete + "%"
            );
            $("#percent_bar" + uidForSingleImage).html(percentComplete + "%"); //Do something with upload progress
          }
        },
        false
      ); //Download progress

      xhr.addEventListener(
        "progress",
        function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total; //Do something with download progress
          }
        },
        false
      );
      return xhr;
    },
    url: "upload",
    type: "POST",
    data: data,
    enctype: "multipart/form-data",
    processData: false,
    // tell jQuery not to process the data
    contentType: false,
    // tell jQuery not to set contentType
    cache: false,
    success: function success(response) {
      if (response) {
        var tempImg = images[response.pId];

        if (tempImg) {
          images[response.pId] = response;
          images[response.pId].quantity = tempImg.quantity;
          images[response.pId].frameSize = tempImg.frameSize;
          $("#progress_bar_id_" + response.pId).css("display", "none");
          $("#image_id_final" + response.pId).attr("src", response.imgSrc);
          $("#image_smile_id_" + response.pId).css("display", "flex");
          // $("image_id_" + response.pId + " .content").css("display", "block");

          // const contentContainer = imageBox.querySelector(".content");
          localStorage.setItem("img", JSON.stringify(images));
          getSmile(response.pId);
          getDiscount();
          FREE_THREADS++;
        }
      }

      var dd = JSON.parse(localStorage.getItem("img"));
    },
    error: function (xhr, status, errorThrown) {
      console.error("Upload error:", xhr.status, errorThrown);

      // Oslobađamo thread
      FREE_THREADS++;

      // Sklanjamo progress bar
      $("#progress_bar_id_" + uid).css("display", "none");

      // Prikazujemo gresku za sliku
      showImageError(uid);

      // Brišemo iz korpe jer nije uspešno uploadovana
      delete images[uid];
      localStorage.setItem("img", JSON.stringify(images));

      // Prikaz poruke korisniku (možeš prilagoditi)
      // alert("Greška pri obradi slike. Pokušajte ponovo sa drugom slikom.");

      getDiscount();
    },
  });
}

function uploadImages(files) {
  // crtanje slika kontejnera u htmlu
  // usput dok crtamo dodeli im uuid
  if (globalFiles.length > 0) {
    i = globalFiles.length;

    while (i--) {
      if (globalFiles[i].sentStarted == true) {
        globalFiles.splice(i, 1);
      }
    }

    for (var i = 0; i < files.length; i++) {
      globalFiles.push(new File([files[i]], files[i].name));
    } //   for (var j = 0; j < globalFiles.length; j++){
    //       if (globalFiles[i].sentStarted == true){
    //       }
    //   }

  } else {
    globalFiles = [];

    for (var i = 0; i < files.length; i++) {
      globalFiles.push(new File([files[i]], files[i].name));
    }
  } //   for (var i = 0; i < files.length; i++) {
  //     // globalFiles.push({
  //     //   name: files[i].name,
  //     //   size: files[i].size,
  //     //   type: files[i].type
  //     // });
  //     globalFiles.push(new File([files[i]], files[i].name));
  //   }


  drawImagePlaceholders(globalFiles);
  uploadInterval = setInterval(function () {
    checkForImageUpload();
  }, 1000); // setInterval(checkForImageUpload, 1000, files);
}

function drawImagePlaceholders(files) {
  for (var i = 0; i < files.length; i++) {
    if (!files[i].drawed) {
      var uid = generateUUID();
      files[i].uuid = uid;
      files[i].sentStarted = false;
      files[i].drawed = true;
      images[uid] = {};
      images[uid].quantity = 1;
      images[uid].frameSize = '10x15';
      imageDelete[uid] = false;
      getDiscount();
      drawImage(uid);
    }
  }
}

function getDiscount(fromCart) {
  var price = 0;
  var finalDiscountPrice = 0;
  discountPrice = {};
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
        quantity: 0
      };
    }

    discountPrice[images[keys[i]].frameSize].quantity += images[keys[i]].quantity;
    imgQuantity += images[keys[i]].quantity;
  } // if (imgQuantity && imgQuantity >= 300) {
  //     $(".poklon-poster").show();
  //   } else {
  //     $(".poklon-poster").hide();
  // }


  var frameKeys = Object.keys(discountPrice);

  for (var i = 0; i < frameKeys.length; i++) {
    var specialPrice = getSpecailOffer(frameKeys[i], fromCart);

    if (specialPrice) {
      haveSpecial = true;
      price += parseInt(specialPrice);
      finalDiscountPrice += discountPrice[frameKeys[i]].quantity * framepriceObj[frameKeys[i]] - parseFloat(specialPrice);
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
            price += discountPrice[frameKeys[i]].quantity * framepriceObj[frameKeys[i]];
          } else {
            finalDiscountPrice += discountPrice[frameKeys[i]].quantity * framepriceObj[frameKeys[i]] * discount[j].discount / 100;
            price += discountPrice[frameKeys[i]].quantity * framepriceObj[frameKeys[i]] - discountPrice[frameKeys[i]].quantity * framepriceObj[frameKeys[i]] * discount[j].discount / 100;
          }

          break;
        }
      }
    }
  }

  canCheckOut(keys);
  var priceData = {}; // var haveCode = haveSpecialCode('',true);
  // haveSpecial = false;
  // if (haveCode){
  //     if (haveCode >= freeShippingPricess && haveSpecial == false) {
  //         shipping = 0;
  //     } else if (haveSpecial == false) {
  //         shipping = mainShippingdd;
  //     }
  //     if (haveCode == 0) {
  //         shipping = 0;
  //     }
  // } else {
  // }

  var localServicesPrice = 0;
  var localServiceQuantity = 0;
  var localServices = localStorage.getItem('imgServices');

  if (localServices) {
    localServices = JSON.parse(localServices);
    var localServicesKeys = Object.keys(localServices);

    for (var i in localServicesKeys) {
      localServicesPrice += localServices[localServicesKeys[i]].totalPrice;
      localServiceQuantity += parseInt(localServices[localServicesKeys[i]].quantity);
    }
  }

  // if (imgQuantity >= 100 && localServicesPrice > 0) {
  //   localServicesPrice -= 300;
  // }
  // var gratisCalendars = Math.floor(localServiceQuantity / 4);
  // if (localServiceQuantity >= 4) {
  //   localServicesPrice -= (gratisCalendars * 350);
  // }


  var specailPrice = smallFunction(price);
  haveSpecial = false;

  if (price + localServicesPrice >= freeShippingPricess && haveSpecial == false && specailPrice + localServicesPrice >= freeShippingPricess) {
    shipping = 0;
  } else if (haveSpecial == false) {
    shipping = mainShippingdd;
  }

  if (price == 0 && localServicesPrice == 0) {
    shipping = 0;
  }

  priceData.finalDiscountPrice = finalDiscountPrice;
  priceData.price = price;
  priceData.shipping = shipping;
  localStorage.setItem('priceData', JSON.stringify(priceData));
  genereteFinalPrice({
    price: price,
    finalDiscountPrice: finalDiscountPrice,
    picNum: keys.length,
    imgQuantity: imgQuantity,
    localServicesPrice: localServicesPrice
  });
}

function canCheckOut(keys) {
  var show = true;
  var imgServices = localStorage.getItem('imgServices');
  var haveImgServices = null;

  if (imgServices != '{}' && imgServices != '') {
    haveImgServices = JSON.parse(imgServices);
  }

  if (!keys.length == 0 && keys != null && keys != '') {
    for (var i = 0; i < keys.length; i++) {
      if (!images[keys[i]].imgSrc) {
        show = false;
        uploadInProgres = true;
        $('#deleteAllButton').css('display', 'flex');
        $('#deleteAllButton_mobile').css('display', 'flex');
        $('.order_now_id').attr("disabled", true);
        $('#cart_buttons_id').css('display', 'none');
        break;
      }
    }

    if (show == true) {
      uploadInProgres = false;
      $('#checkout_id').css('display', 'flex');
      $('#cart_dropdown_to_cart_id').css('display', 'flex');
      $('#deleteAllButton').css('display', 'flex');
      $('#deleteAllButton_mobile').css('display', 'flex');
    }
  } else if (haveImgServices) {
    $('#deleteAllButton').css('display', 'none');
    $('#deleteAllButton_mobile').css('display', 'none');
  } else {
    $('.cart-products-list').html('');
    $('#deleteAllButton').css('display', 'none');
    $('#deleteAllButton_mobile').css('display', 'none');
    $('#empty_cart_id').html('Prazna');
    $('.box-body2').css('display', 'flex');
    $('.total_money_id').html(0);
    $('#cart_buttons_id').css('display', 'none');
    $('#cart_prazno_id').css('display', 'flex');
    $('.subtotal').css('display', 'none');
  }

  if ($('#empty_cart_id').html() == 'Prazna') {
    $('.box-body2').css('display', 'flex');
    $('.order_now_id').attr("disabled", true);
    $('#cart_buttons_id').css('display', 'none');
  } else if (uploadInProgres == false) {
    $('.order_now_id').attr("disabled", false);
    $('#cart_buttons_id').css('display', 'flex');
  }
}

function getSpecailOffer(frameKey, fromCart) {
  var specailPrice = 0;

  if (fromCart) {
    specialDiscount = JSON.parse(localStorage.getItem('specialDiscount'));
    discountPrice = JSON.parse(localStorage.getItem('discountPrice'));
  }

  for (var j = specialDiscount.length - 1; j >= 0; j--) {
    if (frameKey == specialDiscount[j].frameSize && discountPrice[frameKey].quantity >= specialDiscount[j].printCount) {
      specailPrice += discountPrice[frameKey].quantity * specialDiscount[j].printCost;
      shipping = specialDiscount[j].shippingCost;
      return specailPrice.toFixed(2);
    }
  }
}

function genereteFinalPrice(price) {
  var finalPrice = price.price;
  $('.photos-quantity').html(price.picNum);
  $('.to-create-quantity').html(price.imgQuantity);
  $('.regular_price_id').html(parseFloat(finalPrice + price.finalDiscountPrice).toFixed(2) + 'RSD');
  $('.qunatity_discount_id').html(parseFloat(price.finalDiscountPrice).toFixed(2) + 'RSD');
  $('.delivery_id').html(shipping + 'RSD');
  $('.total_money_id').html(parseFloat(finalPrice + parseInt(shipping)).toFixed(2));
  price.shipping = parseInt(shipping);
  price.freeShippingPrice = freeShippingPricess;
  price.mainShippingdd = mainShippingdd;
  localStorage.setItem("price", JSON.stringify(price));
  cartItems2(); // smallFunction(price.price);

  haveSpecialCode();
}

function getSelectedHtml(pId) {
  var html = '';

  for (var z = 0; z < imgPrices.length; z++) {
    if (images[pId].frameSize == imgPrices[z].frameSize) {
      html = html + "<option value=\"".concat(imgPrices[z].frameSize, "\" selected>").concat(imgPrices[z].frameSize, "</option>");
    } else {
      html = html + "<option value=\"".concat(imgPrices[z].frameSize, "\">").concat(imgPrices[z].frameSize, "</option>");
    }
  }

  return html;
}

;

function getFrameOptions() {
  var html = '';

  for (var z = 0; z < imgPrices.length; z++) {
    if (imgPrices[z].frameSize == defaultFrameSize) {
      html = html + "<option value=\"".concat(imgPrices[z].frameSize, "\" selected>").concat(imgPrices[z].frameSize, "</option>");
    } else {
      html = html + "<option value=\"".concat(imgPrices[z].frameSize, "\">").concat(imgPrices[z].frameSize, "</option>");
    }
  }

  return html;
}

function getSmile(uid) {
  if (images[uid].frameSize) {
    frame = images[uid].frameSize;
    var arr = frame.split('x');
    var fheight = parseFloat(arr[0]);
    var fwidth = parseFloat(arr[1]);

    if (images[uid].height >= 120 * fheight && images[uid].width >= 120 * fwidth || images[uid].width >= 120 * fheight && images[uid].height >= 120 * fwidth) {
      var imgHtml = 'images/icons/in-love.png';
      $("#image_smile_id_".concat(uid)).attr('src', imgHtml);
      return;
    } else if (images[uid].height >= 80 * fheight && images[uid].width >= 80 * fwidth || images[uid].width >= 80 * fheight && images[uid].height >= 80 * fwidth) {
      imgHtml = 'images/icons/happy.png';
      $("#image_smile_id_".concat(uid)).attr('src', imgHtml);
      return;
    } else {
      imgHtml = 'images/icons/angry.png';
      $("#image_smile_id_".concat(uid)).attr('src', imgHtml);
      return;
    }
  } else {}

  return;
}

function showImageError(uid) {
  const imageBox = document.querySelector(`#image_id_${uid}`);
  if (!imageBox) return;

 const deleteButton = imageBox.querySelector(".delete_img_class");
 if (deleteButton) {
   deleteButton.style.display = "flex"; // ili 'block' u zavisnosti od dizajna
 }

  const imageContainer = imageBox.querySelector(".image");
  const contentContainer = imageBox.querySelector(".content");

  // Skloni progress bar i sliku
  if (imageContainer) {
    imageContainer.style.setProperty("width", "100%", "important");
    imageContainer.innerHTML = `
      <div class="image-error-block">
        <img src="images/icons/angry.png" alt="Sad Emoji" class="image-error-icon">
        <p class="image-error-text">Greška pri slanju fotografije na server</p>
      </div>
    `;
  }

  // Sakrij kontrole
  if (contentContainer) {
    contentContainer.style.display = "none";
  }
}



function drawImage(udi) {
  var imageBox = '';
  var temp = '';

  if (udi.local) {
    temp = udi;
    udi = '';
    udi = temp.pId;
  }
  /*-- For Image --*/


  var imageSrc = "";
  var uploaded_photo_block = document.getElementById('uploaded-photos');
  imageBox += imageBox += "<div class='image-box' data-id=\"".concat(udi, "\" id =\"image_id_").concat(udi, "\">");
  imageBox += "<div id = '".concat(udi, "' class='delete delete_img_class'><i class='fas fa-times'></i></div>");
  imageBox += "<div class='image'>";
  imageBox += "<div class='progress' id='progress_bar_id_".concat(udi, "' style = 'display:flex'>");
  imageBox += "<div class='bar' id='bar_id".concat(udi, "' style=\"width: 0%;\"></div>");
  imageBox += "<div class='percent' id='percent_bar".concat(udi, "'>0%</div>");
  imageBox += "</div>";
  imageBox += "<img id =\"image_id_final".concat(udi, "\" src='' alt='uploaded Image'>");
  // imageBox += "<div class='image-quality'>";
  // imageBox += "<img id='image_smile_id_".concat(udi, "' src='images/icons/in-love.png' alt='Emoji' style='display: none' >");
  // imageBox += "<div class='tooltip'>";
  // imageBox += "<div class='list'>";
  // imageBox += "<img src='images/icons/in-love.png' alt='Emoji'>";
  // imageBox += "<p>Odličan kvalitet (> = 120 dpi)</p>";
  // imageBox += "</div>";
  // imageBox += "<div class='list'>";
  // imageBox += "<img src='images/icons/happy.png' alt='Emoji'>";
  // imageBox += "<p>Dobar kvalitet (> = 80 dpi)</p>";
  // imageBox += "</div>";
  // imageBox += "<div class='list'>";
  // imageBox += "<img src='images/icons/angry.png' alt='Emoji'>";
  // imageBox += "<p>Loš kvalitet (< 80 dpi)</p>";
  // imageBox += "</div>";
  // imageBox += "</div>";
  // imageBox += "</div>";
  imageBox += "</div>";
  imageBox += "<div class='content'>";
  imageBox += "<select id='img_option_id_".concat(udi, "' class='img_option_class' name='Photo-sizesFormats'>");
  imageBox += "<option value='9x13'>9x13</option>";
  imageBox += "<option selected='selected' value='10x15'>10x15</option>";
  imageBox += "<option value='15x15'>15x15</option>";
  imageBox += "<option value='13x13'>13x13</option>";
  imageBox += "<option value='13x18'>13x18</option>";
  imageBox += "<option value='15x23'>15x23</option>";
  imageBox += "<option value='20x20'>20x20</option>";
  imageBox += "<option value='20x30'>20x30</option>";
  imageBox += "<option value='30x30'>30x30</option>";
  imageBox += "<option value='30x40'>30x40</option>";
  imageBox += "</select>";
  imageBox += "<div id='".concat(udi, "' class=\"photo-delete-btn js-delete-photo\"><span class=\"ico-trash\"></span></div>");
  imageBox += "<div class='input-group'>";
  imageBox += "<span class='input-group-btn'>";
  imageBox += "<button type='button' data-id = '".concat(udi, "' class=' btn btn-number minus'  data-type='minus' data-field=''>");
  imageBox += "<i class='fas fa-minus minus_button'></i>";
  imageBox += "</button>";
  imageBox += "</span>";
  imageBox += "<input type='text' id='img_quantity_".concat(udi, "' name='quantity' autocomplete=\"off\" oninput='quantityUpdate(this)' class='form-control input-number' value = '1' >");
  imageBox += "<span class='input-group-btn'>";
  imageBox += "<button type='button' data-id = '".concat(udi, "' class=' btn btn-number plus' data-type='plus' data-field=''>");
  imageBox += "<i class='fas fa-plus plus_button'></i>";
  imageBox += "</button>";
  imageBox += "</span>";
  imageBox += "</div>";
  imageBox += "</div>";
  imageBox += "</div>";
  $('#uploaded-photos').append(imageBox);
  document.getElementById('deleteAllButton').style.display = 'flex';
  document.getElementById('deleteAllButton_mobile').style.display = 'flex';
  var optionHtml = getFrameOptions();
  $("#img_option_id_".concat(udi)).html(optionHtml);

  if (temp.local) {
    $('#progress_bar_id_' + temp.pId).css('display', 'none');
    $('#image_id_final' + temp.pId).attr('src', temp.imgSrc); // $('#image_id_final' + temp.pId).css('display', 'flex');

    var selectedOption = getSelectedHtml(temp.pId);
    $("#img_option_id_".concat(temp.pId)).html(selectedOption);
    $("#img_quantity_".concat(temp.pId)).val(temp.quantity);
    getSmile(udi);
    $('#image_smile_id_' + udi).css('display', 'flex');
    getDiscount();
  }
}

function checkOut(dd) {
  window.location = '/checkout';
}

function quantityUpdate(dd) {
  var uid = $(dd).closest('.image-box').attr('data-id');
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
    quantity = parseFloat(quantity);
  }

  images[uid].quantity = parseFloat(quantity);
  localStorage.setItem("img", JSON.stringify(images));
  getDiscount();
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

function cartItems2() {
  frames = {};
  var localStorageImages = localStorage.getItem('img');
  var hasKeys = Object.keys(images);

  if (localStorageImages != "{}" && localStorageImages != undefined && localStorageImages != '') {
    var imagesArray = JSON.parse(localStorageImages);
    drawCart(imagesArray);
  } else if (hasKeys.length > 0) {
    drawCart(images);
  } else {
    localStorage.setItem("frames", JSON.stringify(frames));
    dropDownCart();
  }
}

function drawCart(img) {
  var keys = Object.keys(img);

  for (var i = 0; i < keys.length; i++) {
    if (!frames[img[keys[i]].frameSize]) {
      frames[img[keys[i]].frameSize] = {};
      frames[img[keys[i]].frameSize].quantity = 0;
    }

    frames[img[keys[i]].frameSize].quantity += img[keys[i]].quantity;
  }

  localStorage.setItem("frames", JSON.stringify(frames));
  priceObj = JSON.parse(localStorage.getItem('price'));
  dropDownCart();
}

function haveSettingsFunction() {
  if (imageSettings.sjajni == 1) {
    $(":radio[value=Sjajni]").attr('checked', true);
  } else {
    $(":radio[value=Mat]").attr('checked', true);
  }

  if (imageSettings.iseciSliku == 1) {
    $(":radio[value=Iseći-Sliku]").attr('checked', true);
  } else {
    $(":radio[value=Popuniti-Belim]").attr('checked', true);
  }
} // Open photo format on mobile


var formatSection = document.querySelector('.mobile-format-slider');
var openFormatBtn = document.querySelector('.js-open-format');
var closeFormatBtn = document.querySelector('.js-format-close');
openFormatBtn.addEventListener('click', function () {
  formatSection.classList.add('show');
});
closeFormatBtn.addEventListener('click', function () {
  formatSection.classList.remove('show');
});

function deleteEverything() {
  var imageKeys = Object.keys(images);
  var ids = [];

  for (var i in imageKeys) {
    imageDelete[imageKeys[i]] = true;

    if (images[imageKeys[i]].id) {
      ids.push(images[imageKeys[i]].id);
    }
  }

  var idsStrings = ids.join();

  if (idsStrings) {
    $.post('/deleted', {
      ids: idsStrings
    });
  }

  images = {};
  localStorage.setItem("img", JSON.stringify(images));
  var imageBox = document.querySelector('.image-box');
  document.getElementById('uploaded-photos').innerHTML = '';
  document.getElementById('deleteAllButton').style.display = 'none';
  document.getElementById('deleteAllButton_mobile').style.display = 'none';
  getDiscount();
}