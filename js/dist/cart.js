"use strict";

var images = {};
var frames = {};
$(document).ready(function () {
  fbq("track", "InitiateCheckout");
  gtag("event", "InitiateCheckout");
  reload();
});

function reload() {
  $(".item").remove();
  var localStorageImages = localStorage.getItem("img");
  var tempServiceOrder = localStorage.getItem("imgServices");
  var products = localStorage.getItem("products");
  priceObj = JSON.parse(localStorage.getItem("price")); // $('#cart_subtotal_id').html(parseFloat(priceObj.price).toFixed(2) + ' RSD');
  // $('#cart_shipping_id').html(priceObj.shipping + ' RSD');
  // if (priceObj.price + priceObj.finalDiscountPrice == 0) {
  //     window.location.href = '/';
  // }
  // } else if (priceObj.finalPrice) {
  //     $('#cart_total_id').html(priceObj.finalPrice + ' RSD');
  //     $('#cart_subtotal_id').html(parseFloat(priceObj.finalPrice - priceObj.shipping).toFixed(2) + ' RSD');
  // }
  // else {
  //     $('#cart_total_id').html(priceObj.price + priceObj.shipping + ' RSD');
  // }

  if (localStorageImages) {
    // var imagesArray = JSON.parse(localStorageImages);
    // var keys = Object.keys(imagesArray)
    // for (var i = 0; i < keys.length; i++) {
    //     if (!frames[imagesArray[keys[i]].frameSize]) {
    //         frames[imagesArray[keys[i]].frameSize] = {};
    //         frames[imagesArray[keys[i]].frameSize].quantity = 0;
    //     }
    //     frames[imagesArray[keys[i]].frameSize].quantity += imagesArray[keys[i]].quantity;
    // }
    frames = JSON.parse(localStorage.getItem("frames"));
    priceObj = JSON.parse(localStorage.getItem("price")); // $('#cart_subtotal_id').html(parseFloat(priceObj.price).toFixed(2) + ' RSD');
    // $('#cart_shipping_id').html(priceObj.shipping + ' RSD');

    if (
      priceObj.price +
        priceObj.finalDiscountPrice +
        priceObj.localServicesPrice ==
      0
    ) {
      window.location.href = "/";
    } // } else if (priceObj.finalPrice){
    //     $('#cart_total_id').html(priceObj.finalPrice + ' RSD');
    //     $('#cart_subtotal_id').html(parseFloat(priceObj.finalPrice - priceObj.shipping).toFixed(2) + ' RSD');
    // }
    // else {
    //     $('#cart_total_id').html(priceObj.price  + priceObj.shipping + ' RSD');
    // }

    if (frames) {
      if (Object.keys(frames).length != 0) {
        imagesFromLocalStorageCart();
      }
    }
  }

  if (tempServiceOrder) {
    var serviceOrder = JSON.parse(tempServiceOrder);
    var keys = Object.keys(serviceOrder);

    for (var i = 0; i < keys.length; i++) {
      drawService(serviceOrder[keys[i]]);
    }
  }

  if (products) {
    products = JSON.parse(products);
    var keysz = Object.keys(products);

    for (var i = 0; i < keysz.length; i++) {
      drawProduct(products[keysz[i]], keysz[i]);
    }
  } // var itemNum = $('.item');
  // if (itemNum.length == 0) {
  //     window.location.href = '/';
  // }
}

function imagesFromLocalStorageCart() {
  var keys = Object.keys(frames);

  for (var i = 0; i < keys.length; i++) {
    drawImage(keys[i]);
  }
}

function drawProduct(key, key2) {
  var html = '  \n        <tr class="item" id="cart_id_'
    .concat(
      key2,
      '">\n            <td>\n                <div onclick="deleteFromProductCartUniversal(this)" data-id_button=\''
    )
    .concat(
      key2,
      '\' class="close">x</div>\n                <div class="edit"><i class="fas fa-pencil-alt" onclick = \'editProduct(this)\' data-edit-btn= \''
    )
    .concat(
      key2,
      '\'></i></div>\n                <img src="images/side-image.jpg">\n                <h5>'
    )
    .concat(
      key.name,
      '</h5>\n            </td>\n            <td>\xA329.99</td>\n            <td class = \'disabled hidden\'>\n                <span><i onclick="quantityMinus(event)" class="fas fa-minus"></i></span>\n                <input type="number" autocomplete="off" value="'
    )
    .concat(
      key.quantity,
      '" name="product-quantity">\n                <span><i onclick="quantityPlus(event)" class="fas fa-plus"></i></span>\n            </td>\n            <td>\xA329.99</td>\n        </tr>'
    );
  $("#cart_table_id").append(html);
}

{
  /* <tr class="item" id="cart_id_${key2}">
     <td>
         <div onclick="deleteFromProductCartUniversal(this)" data-id_button='${key2}' class="close">x</div>
         <div class="edit"><i class="fas fa-pencil-alt" onclick='editProduct(this)' data-edit-btn='${key2}'></i></div>
         <img src="images/side-image.jpg">
             <h5>${key.name}</h5>
             </td>
         <td>£29.99</td>
         <td class='disabled'>
             <span><i onclick="quantityMinus(event)" class="fas fa-minus"></i></span>
             <input type="number" autocomplete="off" value="${key.quantity}" name="product-quantity">
                 <span><i onclick="quantityPlus(event)" class="fas fa-plus"></i></span>
             </td>
             <td>£29.99</td>
         </tr>` */
}

function drawService(key) {
  var html = '  \n        <tr class="item" id="cart_id_'
    .concat(
      key.imgId2,
      '">\n            <td>\n                <div onclick="deleteFromServiceCartUniversal(this)" data-id_button=\''
    )
    .concat(
      key.imgId2,
      '\' class="close">x</div>\n                <div class="edit" style="display: none;"><i class="fas fa-pencil-alt" onclick = \'editService(this)\' data-edit-btn= \''
    )
    .concat(
      key.imgId2,
      "'></i></div>\n                <img src=\"images/services/"
    )
    .concat(key.serviceImage, '">\n                <h5>')
    .concat(key.serviceName, " - ")
    .concat(
      key.serviceSubName,
      '</h5>\n            </td>\n            <td></td>\n            <td class = \'disabled hidden\'>\n                <span><i onclick="quantityMinus(event)" class="fas fa-minus"></i></span>\n                <input type="number" autocomplete="off" value="'
    )
    .concat(
      key.quantity,
      '" name="product-quantity">\n                <span><i onclick="quantityPlus(event)" class="fas fa-plus"></i></span>\n            </td>\n            <td></td>\n        </tr>'
    );
  $("#cart_table_id").append(html);
}

function drawImage(key) {
  var html = '  \n        <tr class="item" id="cart_id_'
    .concat(
      key,
      '">\n            <td>\n                <div onclick="deleteFromCartUniversal(this)" data-id_button=\''
    )
    .concat(
      key,
      '\' class="close">x</div>\n                <img src="images/side-image.jpg">\n                <h5> Fotografije formata '
    )
    .concat(
      key,
      '</h5>\n            </td>\n            <td></td>\n            <td class = \'disabled hidden\'>\n                <span><i onclick="quantityMinus(event)" class="fas fa-minus"></i></span>\n                <input type="number" autocomplete="off" value="'
    )
    .concat(
      frames[key].quantity,
      '" name="product-quantity">\n                <span><i onclick="quantityPlus(event)" class="fas fa-plus"></i></span>\n            </td>\n            <td></td>\n        </tr>'
    );
  $("#cart_table_id").append(html);
}
