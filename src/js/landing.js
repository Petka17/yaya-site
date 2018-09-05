$(function () {

  var hostName = 'http://my.' + document.location.host;

  document.querySelector('#sign_in').href = hostName + '/sign_in';

  document.querySelector('#sign_up').href = hostName + '/sign_up';

  $('.js-slider').slick({
    nextArrow: '<button class="ic-slider-arrow-next">',
    prevArrow: '<button class="ic-slider-arrow-prev">',
    dots: true
  });

  $('.js-mask-phone').inputmask("+7 (999) 999-99-99");



  var loadMap = setInterval(function () {
    if (typeof(ymaps) === 'object' && typeof(ymaps.Map) === 'function') {
      ymaps.ready(init('map'));
      clearInterval(loadMap);
    }
  },100);

  var init = function (box) {
    var caneterCoords = $('#' + box).data('center').split(',');

    var myMap = new ymaps.Map(box, {
      center: caneterCoords,
      zoom: 15,
      controls: []
    });


    var ZoomLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="map__zoom-box">' +
      '<button type="button" class="map__zoom-icon map__zoom-in ic-plus"></button>' +
      '<button type="button" class="map__zoom-icon map__zoom-out ic-minus"></button>' +
      '</div>', {
          build: function () {
            ZoomLayout.superclass.build.call(this);
            this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
            this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);
            $('#' + box).find('.map__zoom-in').bind('click touchend', this.zoomInCallback);
            $('#' + box).find('.map__zoom-out').bind('click touchend', this.zoomOutCallback);
          },
          clear: function () {
            $('#' + box).find('.map__zoom-in').unbind('click touchend', this.zoomInCallback);
            $('#' + box).find('.map__zoom-out').unbind('click touchend', this.zoomOutCallback);
            ZoomLayout.superclass.clear.call(this);
          },
          zoomIn: function () {
            var map = this.getData().control.getMap();
            map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
          },
          zoomOut: function () {
            var map = this.getData().control.getMap();
            map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
          }
        }),
      zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout, position: {top: 315, right: 30}}});
    myMap.controls.add(zoomControl);
    myMap.behaviors.disable('scrollZoom');


    var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="map__balloon">' +
      '<div class="map__balloon-title">{{properties.title}}</div>' +
      '<a class="map__balloon-link ic-arrow-right-b" href="{{properties.link}}"></a>' +
      '<div class="map__balloon-salary">{{properties.salary}} &#8381;</div>' +

      '<div class="map__balloon-shop">' +
        '<img class="map__balloon-logo" src="{{properties.logo}}" alt="">' +
        '<div class="map__balloon-name">{{properties.name}}</div>' +
      '</div></div>' , {
        closeButton: false
      }
    );

    function setPoints(points) {
      for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var myPlacemark = new ymaps.Placemark(point.coordinates.split(','), {
					hintContent: point.hint,
					title: point.title,
					salary: point.salary,
					name: point.name,
					logo: point.logo,
					link: point.link
				}, {
					balloonContentLayout: BalloonContentLayout,
					balloonCloseButton: false,
					balloonPanelMaxMapArea: 0,
					iconLayout: 'default#image',
					iconImageHref: point.placemarkImage,
					iconImageSize: [50, 50],
					iconImageOffset: [-25, -25]
					,
					iconShape: {
						type: 'Circle',
						coordinates: [0,0],
						radius: 20
					}
				});
        myMap.geoObjects
          .add(myPlacemark);
				myPlacemark.balloon.open();
      }
    }

    setPoints([
      {
        coordinates: '55.729618, 37.618243',
        title: 'Грузчик',
        hint: '',
        salary: '20 000',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-burger.svg',
        link: '#',
        name: 'Лента'
      },
      {
        coordinates: '55.734267, 37.623007',
        title: 'Грузчик',
        hint: '',
        salary: '8 500',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-hoff.svg',
        link: '#',
        name: 'Лента'
      },
      {
        coordinates: '55.730102, 37.627770',
        title: 'Грузчик',
        hint: '',
        salary: '8 500',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-kfc.svg',
        link: '#',
        name: 'Лента'
      },
      {
        coordinates: '55.734655, 37.637898',
        title: 'Грузчик',
        hint: '',
        salary: '8 500',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-lenta.svg',
        link: '#',
        name: 'Лента'
      },
      {
        coordinates: '55.730514, 37.641460',
        title: 'Грузчик',
        hint: '',
        salary: '20 000',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-starbucks.svg',
        link: '#',
        name: 'Лента'
      }

    ]);

  };

	toggleCityPopup();
});

function toggleCityPopup() {
  var popupLink = $('.my-city__value');
  var cityPopup = $('.city-popup');
  var closeBtn = $('.city-popup__close');
  if (popupLink.length === 0 || cityPopup.length === 0 || closeBtn.length === 0) {
    return;
  }

	cityPopup.hide();
	popupLink.on('click', function(e) {
    e.preventDefault();
		cityPopup.fadeIn(200);
  });
	closeBtn.on('click', function(e) {
	  e.preventDefault();
	  $(this).closest('.city-popup').fadeOut(200);
  });

	$(document).on('mouseup', function(e) {
    if(!cityPopup.is(e.target) && cityPopup.has(e.target).length === 0) {
			cityPopup.fadeOut(200);
    }
  });
}