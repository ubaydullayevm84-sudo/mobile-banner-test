"use strict";

var productObj = {};

function editProductFunction(dd) {
  var id = $(dd).attr('data-id');
  var products = JSON.parse(localStorage.getItem('products'));
  var quantity = parseInt($('#product_quantity').val());
  reset();

  if (products[id]) {
    products[id].price = quantity * Productprice;
    products[id].quantity = quantity;
    localStorage.setItem('products', JSON.stringify(products));
    dropDownCart();
  }
}

$(document).on('click', '.quantity-right-plus', function () {
  var quantity = $('#product_quantity').val();
  quantity = parseInt(quantity) + 1;
  $('#product_quantity').val(quantity);
  var sum = Productprice * quantity;
  $('#product_price').html(sum + 'RSD');
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

  $('#product_quantity').val(quantity);
  var sum = Productprice * quantity;
  $('#product_price').html(sum + 'RSD');
}

$(document).on('click', '.quantity-left-minus', function () {
  var quantity = $('#product_quantity').val();

  if (quantity > 1) {
    quantity = parseInt(quantity) - 1;
  }

  $('#product_quantity').val(quantity);
  var sum = Productprice * quantity;
  $('#product_price').html(sum + 'RSD');
});
$(document).on('click', '#product1-tab', function () {
  var id = $('#product1-tab').attr('data-id');
  var html = '';
  $('#product2-tab').attr('class', 'nav-link black-button button');
  $('#product1-tab-content').attr('class', 'tab-pane fade show active');
  $('#product2-tab-content').attr('class', 'tab-pane fade');
  $('#framovi_id').css('display', 'flex');
  $('#albumi_id').css('display', 'none'); // $.get(`/proizvodi/category/${id}`,function(response){
  //     if(response){
  //         $('.products-list').html('');
  //         for(var i =0;i < response.length; i++){
  //             html += drawProduct(response[i]);
  //         }
  //         $('.products-list').append(html);
  //     }
  // });
});
$(document).on('click', '#product2-tab', function () {
  var id = $('#product2-tab').attr('data-id');
  var html = '';
  $('#product1-tab').attr('class', 'nav-link black-button button');
  $('#product1-tab-content').attr('class', 'tab-pane fade');
  $('#product2-tab-content').attr('class', 'tab-pane fade show active');
  $('#framovi_id').css('display', 'none');
  $('#albumi_id').css('display', 'flex'); // $.get(`/proizvodi/category/${id}`, function (response) {
  //     if (response) {
  //         $('.products-list').html('');
  //         for (var i = 0; i < response.length; i++) {
  //             html += drawProduct(response[i]);
  //         }
  //         $('.products-list').append(html);
  //     }
  // });
});

function drawProduct(product) {
  var html = "<div class=\"product-box\">\n                <div class=\"product\">\n                    <div class=\"product-image\">\n                        <img src=\"".concat(product.image, "\">\n                    </div>\n                    <div class=\"product-size\">\n                        <p> ").concat(product.name, " </p>\n                    </div>\n                    <div class=\"product-price\">\n                        <p> ").concat(product.price, " RSD</p>\n                    </div>\n                    <div class=\"add-to-cart\">\n                        <button data-id=\"").concat(product.id, "\" data-price=\"").concat(product.price, "\" data-name = '").concat(product.name, "'\n                            data-quntity=\"1\" onclick=\"addProductToCart(this)\">Add To Cart</button>\n                    </div>\n                    <div class=\"more-details\">\n                        <button onclick=\"window.location.href = '/proizvodi/").concat(product.id, "/zumm'\">More Details</button>\n                    </div>\n                </div>\n            </div>");
  return html;
}

function reset() {
  $('#product_quantity').val('1');
  var quantity = $('#product_quantity').val();
  var sum = Productprice * parseInt(quantity);
  $('#product_price').html(sum + 'RSD');
}

function updateQuantity() {
  var quantity = $('#product_quantity').val();
  var sum = Productprice * parseInt(quantity);
  $('#product_price').html(sum + 'RSD');
}

function addProductToCart(dd, button) {
  var productKeys;
  var products;
  var savedProducts = localStorage.getItem("products");
  var haveKey = false;

  if (savedProducts) {
    savedProducts = JSON.parse(savedProducts);
    productKeys = Object.keys(savedProducts);
    productObj = savedProducts;
    haveKey = true;
  } // let productPrice = localStorage.getItem("productPrice");
  // if (productPrice) {
  //     productPrice = JSON.parse(productPrice);
  // } else {
  //     productPrice = {
  //         products: 0,
  //         price: 0
  //     }
  // }


  var uuid = generateUUID();
  var id = $(dd).attr('data-id');
  ;
  var price;
  var quantity;
  var name;

  if (button) {
    name = $('#product_name_id').html();
    price = Productprice;
    quantity = $('#product_quantity').val();
    reset();
    price = price * parseInt(quantity);
  } else {
    name = $(dd).attr('data-name');
    price = $(dd).attr('data-price');
    quantity = $(dd).attr('data-quntity');
  }

  productObj[uuid] = {
    id: id,
    price: price,
    quantity: quantity,
    name: name
  };

  if (haveKey) {
    for (var i = 0; i < productKeys.length; i++) {
      if (productObj[uuid].name == productObj[productKeys[i]].name) {
        productObj[productKeys[i]].quantity = parseInt(productObj[productKeys[i]].quantity) + parseInt(productObj[uuid].quantity);
        productObj[productKeys[i]].price = productObj[productKeys[i]].quantity * parseInt(productObj[uuid].price);
        delete productObj[uuid];
        break;
      }
    }
  }

  localStorage.setItem("products", JSON.stringify(productObj)); // if (haveKey) {
  //     let sum = 0;
  //     for (var i = 0; i < productKeys.length; i++) {
  //         sum += parseInt(productObj[productKeys[i]].price);
  //     }
  //     productPrice.products = productKeys.length + 1;
  //     productPrice.price += sum;
  // } else {
  //     productPrice.price = 0;
  //     productPrice.products = 1;
  //     productPrice.price += parseInt(price);
  // }
  // localStorage.setItem("productPrice", JSON.stringify(productPrice));

  dropDownCart();
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