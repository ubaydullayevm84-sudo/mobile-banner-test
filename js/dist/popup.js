"use strict";

$(document).ready(function () {});

function showPopUp(title, text) {
  $('#modal_title_id').html(title);
  $('#modal_text_id').html(text);
  $('#exampleModal').modal('show');
}