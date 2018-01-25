$(function () {

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
      zoom: 16,
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
        myMap.geoObjects
          .add(new ymaps.Placemark(point.coordinates.split(','), {
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
          }));
      }
    }

    setPoints([
      {
        coordinates: '55.96197851085319, 37.544585690887615',
        title: 'Грузчик',
        hint: 'Burger King',
        salary: '20 000',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-burger.svg',
        link: '#',
        name: 'Лента'
      },
      {
        coordinates: '55.96097851085319, 37.534585690887615',
        title: 'Грузчик',
        hint: 'Hoff',
        salary: '8 500',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-hoff.svg',
        link: '#',
        name: 'Лента'
      },
      {
        coordinates: '55.96297851085319, 37.535585690887615',
        title: 'Грузчик',
        hint: 'KFC',
        salary: '8 500',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-kfc.svg',
        link: '#',
        name: 'Лента'
      },
      {
        coordinates: '55.96297851085319, 37.555585690887615',
        title: 'Грузчик',
        hint: 'Lenta',
        salary: '8 500',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-lenta.svg',
        link: '#',
        name: 'Лента'
      },
      {
        coordinates: '55.95897851085319, 37.545585690887615',
        title: 'Грузчик',
        hint: 'Starbucks',
        salary: '20 000',
        logo: 'img/landing/logo-mac@2x.png',
        placemarkImage: 'img/landing/map-logo-starbucks.svg',
        link: '#',
        name: 'Лента'
      }

    ]);

  };
});