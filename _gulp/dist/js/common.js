'use strict'

// Document ready
$(document).on('ready', function(){

  // SVG Fallback
  if(!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
      return $(this).attr("src").replace(".svg", ".png");
    });
  };

  // Magnific popup gallery
  $('.gallery').each(function() {
    $(this).magnificPopup({
      delegate: '.gallery-item',
      type: 'image',
      gallery:{
        enabled:true
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  });

  // Magnific popup one image
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
    	verticalFit: true
    }
  });

  // Magnific popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  $('.open-popup-link').magnificPopup({
    type: 'inline',
    midClick: true,
    showCloseBtn: false,
    closeOnBgClick: false,
    callbacks: {
      beforeOpen: function(){
        $('select.select').selectric();
      }
    }
  });

  $('.open-popup-menu').magnificPopup({
    type: 'inline',
    midClick: true,
    showCloseBtn: false,
    closeOnBgClick: false,
    callbacks: {
      beforeOpen: function(){
        catalogMenuPopup();

        // Catalog navigation
        catalogNavigation();
      },
      afterClose: function(){
        $('#popup__menu').find('#catalog__menu').remove();
      }
    }
  });

  $('.popup__close').on('click', function(){
    $.magnificPopup.close();
  });

  // Header search
  $('.header__search__input').on('keypress', function(e){
    // e.preventDefault();
    e.stopPropagation();
    $('.header__search').addClass('is-search');
    // console.log(e);
  });
  $('.header__search__input').on('click', function(e){
    e.stopPropagation();

    setTimeout(function(){
      $('#btn-mobile').removeClass('is-active');
      $('.header__menu').removeClass('is-active');
    }, 500);
  });
  $('.header__search__cap').on('click', function(e){
    e.stopPropagation();
    $('.header__search').addClass('is-tablet');
  });
  $('.header__search__btn').on('click', function(e){
    e.stopPropagation();
  });

  // Seo text
  seoText();

  // Main banner carousel
  $('.main-carousel').slick({
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false,
    customPaging: function(slider, i) {
      return $('<span>').text(i + 1);
    }
  });

  // Img banner carousel
  $('.img-carousel').slick({
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false,
    customPaging: function(slider, i) {
      return $('<span>').text(i + 1);
    }
  });

  // Mobile menu
  $('#btn-mobile').on('click', function(e){
    e.stopPropagation();
    $(this).toggleClass('is-active');
    $('.header__menu').toggleClass('is-active');
  });

  // Document click remove
  $(document).on('click', function(){
    setTimeout(function(){
      $('.header__search').removeClass('is-search');
      $('#btn-mobile').removeClass('is-active');
      $('.header__menu').removeClass('is-active');
      $('.header__search').removeClass('is-tablet');
    }, 500);
  });

  // Manufacturer carousel
  var swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    slidesPerColumn: 2,
    spaceBetween: 0,
    nextButton: '.manufacturer__next',
    prevButton: '.manufacturer__prev',
    // autoplay: 3500,
    loop: true,
    breakpoints: {
      991: {
        slidesPerView: 3,
        slidesPerColumn: 2,
      },
      767: {
        slidesPerView: 2,
        slidesPerColumn: 2,
      },
      479: {
        slidesPerView: 1,
        slidesPerColumn: 2,
      }
    }
  });

  // Catalog navigation
  catalogNavigation();

  // Custom select
  $('select.select').selectric();

  // Chrome Smooth Scroll
  try {
    $.browserSelector();
    if($("html").hasClass("chrome")) {
        $.smoothScroll();
    }
  } catch(err) {

  };

  // simpleForm version 2015-09-23 14:30 GMT +2
  simpleForm('form.form-callback');
});

$(window).on('load', function() {
  // $(".loader_inner").fadeOut();
  $(".loader").delay(400).fadeOut("slow");
});

$(window).on('resize', function(){
  var width = $(window).width();

  // Seo text
  seoText();

  // Search header block in tablet
  if (width < 768 && $('.header__search').hasClass('is-tablet') || width > 991 && $('.header__search').hasClass('is-tablet')) {
    $('.header__search').removeClass('is-tablet');
  }

});

/*
version 2015-09-23 14:30 GMT +2
*/
function simpleForm(form, callback) {
  $(document).on('submit', form, function(e){
    e.preventDefault();

    var formData = {};

    var hasFile = false;

    if ($(this).find('[type=file]').length < 1) {
      formData = $(this).serialize();
    }
    else {
      formData = new FormData();
      $(this).find('[name]').each(function(){

        switch($(this).prop('type')) {

          case 'file':
            if ($(this)[0]['files'].length > 0) {
              formData.append($(this).prop('name'), $(this)[0]['files'][0]);
              hasFile = true;
            }
            break;

          case 'radio':
          case 'checkbox':
            if (!$(this).prop('checked')) {
              break;
            }
            formData.append($(this).prop('name'), $(this).val().toString());
            break;

          default:
            formData.append($(this).prop('name'), $(this).val().toString());
            break;
        }
      });
    }

    $.ajax({
      url: $(this).prop('action'),
      data: formData,
      type: 'POST',
      contentType : hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
      cache       : false,
      processData : false,
      success: function(response) {
        $(form).removeClass('ajax-waiting');
        $(form).html($(response).find(form).html());

        if (typeof callback === 'function') {
          callback(response);
        }
      }
    });

    $(form).addClass('ajax-waiting');

    return false;
  });
}

// Seo text slide in mobile
function seoText(){
  var width = $(window).width();

  if (width < 767) {
    $('.footer__seo__text').readmore({
      collapsedHeight: 115,
      moreLink: '<a href="#!">Развернуть</a>',
      lessLink: '<a href="#!">Свернуть</a>'
    });
  } else {
      $('.footer__seo__text').readmore('destroy');
  }
}

// Slide catalog navigation
function catalogNavigation(){
  var menu = $('.catalog__navigation');
  var li = $('.has-folder');
  var a = $('.has-folder > a');
  var ul = $('.ul-folder');

  a.on('click', function(e){
    e.preventDefault();
    $(this).next(ul).slideToggle();
    $(this).parent().toggleClass('active')
  })
}

// Clone catalog menu in popup
function catalogMenuPopup(){
  $('#catalog__menu').clone().appendTo('#popup__menu');
}
