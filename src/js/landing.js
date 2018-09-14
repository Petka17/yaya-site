$(function () {

	var startTimeoutFunction = false;
	var asideVacancyFormTimeout;

	var hostName = 'https://my.' + document.location.host;

	if (document.querySelector('#sign_in')) {
		document.querySelector('#sign_in').href = hostName + '/login';
	}

	if (document.querySelector('#sign_up')) {
		document.querySelector('#sign_up').href = hostName + '/registration';
	}

	if (document.querySelector('.promo__btn')) {
		document.querySelector('.promo__btn').href = hostName + '/registration';
	}

	if (document.querySelector('.interview__btn')) {
		document.querySelector('.interview__btn').href = hostName + '/registration';
	}

	if ($('.employers__count').length > 0) {
		$('.employers__count').attr('href', hostName + '/registration');
	}

	$('.js-slider').slick({
		nextArrow: '<button class="ic-slider-arrow-next">',
		prevArrow: '<button class="ic-slider-arrow-prev">',
		dots: true
	});

	$('.js-mask-phone').inputmask("+7 (999) 999-99-99");



	var loadMap = setInterval(function () {
		if (typeof(ymaps) === 'object' && typeof(ymaps.Map) === 'function' && document.querySelector('#map')) {
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


		var createMarkerTemplate = ymaps.templateLayoutFactory.createClass(
			'<div class="mark">' +
			'<div class="mark__vacancy">' +
			'<h3 class="mark__title">{{ properties.vacancies[0].title }}</h3>' +
			'<p class="mark__salary">{{properties.vacancies[0].salary}} ₽</p>' +
			'<div class="mark__bonus">+ {{properties.vacancies[0].bonus}} ₽</div>' +
			'</div>' +
			'{% if properties.vacancies.length > 1 %}' +
			'<div class="mark__more-btn">Всего вакансий: {{properties.vacancies.length}}</div>' +
			'{% endif %}' +
			'</div>'
		);


		var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
			'<div class="map__balloon"></div>' , {
				closeButton: false
			}
		);

		var clusterer = new ymaps.Clusterer({

				groupByCoordinates: false,

				clusterDisableClickZoom: false,
				clusterHideIconOnBalloonOpen: false,
				geoObjectHideIconOnBalloonOpen: false,
				clusterIconLayout: ymaps.templateLayoutFactory.createClass('<div class="clusterIcon">{{ properties.geoObjects.length }}</div>'),
				clusterIconShape: {
					type: 'Circle',
					coordinates: [25, 25],
					radius: 25
				}
			});

		var getPointData = function (index) {
			return {
				balloonContentHeader: '<font size=3><b><a target="_blank" href="https://yandex.ru">Здесь может быть ваша ссылка</a></b></font>',
				balloonContentBody: '<p>Ваше имя: <input name="login"></p><p>Телефон в формате 2xxx-xxx:  <input></p><p><input type="submit" value="Отправить"></p>',
				balloonContentFooter: '<font size=1>Информация предоставлена: </font> балуном <strong>метки ' + index + '</strong>',
				clusterCaption: 'метка <strong>' + index + '</strong>'
			};
		};

		var getPointOptions = function () {
			return {
				preset: 'islands#violetIcon'
			};
		};

		var geoObjects = [];

		function setPoints(points) {
			var coords = [];

			for (var i = 0; i < points.length; i++) {
				var point = points[i];
				var myPlacemark = new ymaps.Placemark(point.coordinates.split(','), {
					hintContent: point.hint,
					title: point.title,
					salary: point.salary,
					name: point.name,
					logo: point.logo,
					link: point.link,
					bonus: point.bonus,
					interviewDate: point.interviewDate,
					vacancyHref: point.vacancyHref,
					vacancies: point.vacancies
				}, {

					iconLayout: 'default#imageWithContent',
					iconContentLayout: createMarkerTemplate,
					iconImageHref: "",
					iconImageSize: [100, 100],
					iconImageOffset: [-25, -25]
					,

					// iconShape: {
					// 	type: 'Circle',
					// 	coordinates: [0,0],
					// 	radius: 20
					// }
				});
				myPlacemark.events.add('click', function (e) {
					// var props = e.originalEvent.target.properties._data;
					var props = e.originalEvent.target.properties._data.vacancies;
					var overlayContainer = $('.map__overlay');
					var balloonOverlay = $('<div>').addClass('balloon');
					var popupContainer = $('<div>').addClass('popup-container');
					var svg = '<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">' +
					'<path d="M6 0L4.2 3.6L0 4.2L3 7L2.3 11L6 9.1L9.7 11L9 7L12 4.2L7.8 3.6L6 0Z" fill="#BDC5DF"/>' +
					'</svg>';
					var videoContainer = $('.video-container');



					for (var i = 0; i < props.length; i++) {
						var balloonVacancy = $('<div>').addClass('balloon__vacancy');
						var balloonTitle = $('<h3>').addClass('balloon__title').text(props[i].title);
						var balloonSalary = $('<p>').addClass('balloon__salary').text(props[i].salary + ' ₽');
						var balloonBonus = $('<div>').addClass('balloon__bonus').text(props[i].bonus + ' ₽');
						var balloonVideoLink = $('<a>').addClass('balloon__video-link').attr('href', '#' + props[i].videoID);
						var balloonVideoImg = $('<img>').addClass('balloon__video-img').attr('src', props[i].videoLinkImg);

						var balloonLine = $('<div>').addClass('balloon__line');
						var balloonPhoto = $('<div>').addClass('balloon__photo');
						var balloonImg = $('<img>').addClass('balloon__img').attr('src', props[i].logo);

						var balloonEmployer = $('<span>').addClass('balloon__employer').text(props[i].name);
						var balloonAddToFavourites = $('<button>').addClass('balloon__add').attr('type', 'button').html(svg + '<span class="visually-hidden">Добавить в избранное</span>');



						if (props[i].interviewDate !== null && props[i].interviewDate !== undefined) {
							var interviewDate = props[i].interviewDate.replace( /\./g, "-" );
							interviewDateArr = interviewDate.split(' ');
							interviewDate = interviewDateArr[0];
							var interviewTime = interviewDateArr[1];

							var interviewDate = new Date(interviewDate);
							var now = new Date();
							var daysLag = Math.ceil(Math.abs(interviewDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
							if (daysLag == 0) {
								interviewDate  = 'сегодня в ' + interviewTime;
							} else if (daysLag === 1) {
								interviewDate  = 'завтра в ' + interviewTime;
							} else if (daysLag === 2) {
								interviewDate  = 'послезавтра в ' + interviewTime;
							} else {
								interviewDate = interviewDate.toLocaleDateString() + ' в ' + interviewTime;
							}
							var balloonInterview = $('<div>').addClass('balloon__interview');
							var balloonInterviewText = $('<p>').addClass('balloon__interview-text').text('Ближайшее собеседование:');
							var balloonInterviewDate = $('<p>').addClass('balloon__interview-date').text(interviewDate);
							balloonInterview.append(balloonInterviewText);
							balloonInterview.append(balloonInterviewDate);
						}


						var balloonMoreBtn = $('<a>').addClass('balloon__btn-more').attr('href', props[i].vacancyHref).text('Подробнее');

						overlayContainer.empty();
						balloonVacancy.append(balloonTitle);
						balloonVacancy.append(balloonSalary);
						balloonVacancy.append(balloonBonus);

						balloonVideoLink.append(balloonVideoImg);

						balloonVacancy.append(balloonVideoLink);

						balloonPhoto.append(balloonImg);
						balloonLine.append(balloonPhoto);
						balloonLine.append(balloonEmployer);
						balloonLine.append(balloonAddToFavourites);

						balloonVacancy.append(balloonLine);

						if (balloonInterview) {
							balloonVacancy.append(balloonInterview);
						}

						balloonVacancy.append(balloonMoreBtn);

						balloonOverlay.append(balloonVacancy);

						// add video
						var popupWrapper = $('<div>').addClass('balloon__popup-wrapper mfp-hide').attr('id', props[i].videoID); // обертка отдельного попапа
						var balloonVideoWrapper = $('<div>').addClass('balloon__video-wrapper');
						var balloonVideo = $('<video>').addClass('balloon__video').attr({
							'src': props[i].videoSrc,
							'controls': true
						});

						balloonVideoWrapper.append(balloonVideo);


						var popupLine = $('<div>').addClass('balloon__popup-line');

						var popupText = $('<div>').addClass('balloon__popup-text');
						var popupTitle = $('<p>').addClass('balloon__popup-title').text('Видеоприветствие по вакансии');
						var popupDetails = $('<p>').addClass('balloon__popup-details').html(props[i].title + ' в ' + props[i].name);
						popupText.append(popupTitle);
						popupText.append(popupDetails);

						var popupAddToFavourites = $('<button>').addClass('balloon__popup-add').attr('type', 'button').html(svg + '<span class="visually-hidden">Добавить в избранное</span>');
						var popupMoreBtn = $('<a>').addClass('balloon__popup-more').attr('href', props[i].vacancyHref).text('Подробнее');

						popupLine.append(popupAddToFavourites);
						popupLine.append(popupText);
						popupLine.append(popupMoreBtn);

						popupWrapper.append(balloonVideoWrapper);
						popupWrapper.append(popupLine);

						popupContainer.append(popupWrapper);

						videoContainer.empty();
					}

					overlayContainer.append(balloonOverlay);
					videoContainer.append(popupContainer);


					setTimeout(function() {
						if ($('.balloon').height() > 450) { // ie fix
							$('.balloon').jScrollPane();
						}
						// $('.balloon').animate({'opacity': 1}, {speed: 'fast'});
						$('.balloon').css('opacity', 1);
						$('.balloon__video-link').magnificPopup({
							mainClass: 'video-popup'
						});

						$('.balloon__video').mediaelementplayer({
							alwaysShowControls: true,
							videoVolume: 'vertical',
							features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen']
						});

					},0);
				});

				geoObjects
					.push(myPlacemark);
			}

			clusterer.options.set({
				gridSize: 100
			});

			clusterer.add(geoObjects);
			myMap.geoObjects.add(clusterer);

		}

		setPoints([
			{
				coordinates: '55.729618, 37.618243',
				hint: '',
				placemarkImage: 'img/landing/map-logo-burger.svg',
				vacancies: [
					{
						title: 'Специалист по взысканию задолженности',
						salary: 'до 45 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'ВТБ',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.20 09:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v1'
					}
				]
			},
			{
				coordinates: '55.734267, 37.623007',
				placemarkImage: 'img/landing/map-logo-hoff.svg',
				vacancies: [
					{
						title: 'Кассир',
						salary: 'до 60 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'Магнит',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.09 09:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v2'
					}
				]
			},
			{
				coordinates: '55.730102, 37.627770',
				logo: 'img/landing/logo-mac@2x.png',
				placemarkImage: 'img/landing/map-logo-kfc.svg',
				vacancies: [
					{
						title: 'Специалист по взысканию задолженности',
						salary: 'до 45 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'Лента',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.15 10:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v3'
					},
					{
						title: 'Кассир',
						salary: 'до 45 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'Ашан',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.18 10:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v4'
					},
					{
						title: 'Грузчик',
						salary: 'до 50 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'Леруа Мерлен',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.20 10:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v5'
					},
					{
						title: 'Торговый представитель',
						salary: 'до 45 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'Лента',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.20 10:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v6'
					}
				]
			},
			{
				coordinates: '55.734655, 37.637898',
				placemarkImage: 'img/landing/map-logo-lenta.svg',
				vacancies: [
					{
						title: 'Повар',
						salary: 'до 45 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'Лента',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.18 10:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v7'
					}
				]
			},
			{
				coordinates: '55.730514, 37.641460',
				placemarkImage: 'img/landing/map-logo-starbucks.svg',
				vacancies: [
					{
						title: 'Грузчик',
						salary: '20 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'Лента',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.07 12:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v8'
					}
				]
			},
			{
				coordinates: '55.731620, 37.642475',
				title: 'Охранник',
				placemarkImage: 'img/landing/map-logo-starbucks.svg',
				vacancies: [
					{
						title: 'Охранник',
						salary: '20 000',
						logo: 'img/landing/logo-mac@2x.png',
						name: 'Лента',
						bonus: '500',
						videoLinkImg: 'img/landing/balloon-video-link.png',
						interviewDate: '2018.09.07 12:00',
						vacancyHref: '#',
						videoSrc: 'img/landing/video_placeholder.mp4',
						videoID: 'v9'
					}
				]
			}

		]);

	};

	// toggleCityPopup();

	$('body').on('click', function(e) {
		$(e.target).closest('.balloon__add').toggleClass('active');
		$(e.target).closest('.balloon__popup-add').toggleClass('active');
		$(e.target).closest('.popup-video__add').toggleClass('active');
	});

	if ($('[data-popup-info]').length > 0) {
		$('[data-popup-info]').magnificPopup({
			mainClass: 'popup-one-screen',
			callbacks: {
				open: function() {
					$(".popup-informer__wrap").mCustomScrollbar({
						axis:"y",
						autoHideScrollbar: true
					});
				}
			}
		});
	}

	if ($('[data-popup]').length > 0) {
		$('[data-popup]').magnificPopup({
			mainClass: 'popup-content-type'
		});
	}

	if ($('[data-popup-video]').length > 0) {
		$('[data-popup-video]').magnificPopup({
			mainClass: 'video-popup'
		});

		$('.popup-video__video').mediaelementplayer({
			alwaysShowControls: true,
			videoVolume: 'vertical',
			features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen']
		});
	}

	if ($('[data-phone-tooltip]').length > 0) {

	}

	makeHeaderSticky();

	var copyBtns = document.querySelectorAll('.js-copy');
	if (copyBtns.length > 0) {
		var clipboard = new ClipboardJS(copyBtns);
	}

	checkVacancyAsideForm();

	if ($('.vacancy-aside__stage2').length > 0) {
		$('.vacancy-aside__stage2').hide();
	}

	if ($('#callback').length > 0) {
		validateCallbackInput($('#callback'));
	}


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

function makeHeaderSticky() {
	var anchor = $('.header__anchor');
	var headerContent = $('.header__wrapper');
	function makeSticky() {
		var docTop = $(document).scrollTop(),
			anchorTop = $(anchor).offset().top;
		if (docTop > anchorTop) {
			headerContent.addClass('header-fixed');
			headerContent.css('width', $('.header').width());
			headerContent.css('left', $('.header').offset().left);
			anchor.height(headerContent.outerHeight());
		} else {
			headerContent.removeClass('header-fixed');
			headerContent.css('left', 0);
			anchor.height(0);
		}
	}
	if (anchor.length > 0 && headerContent.length > 0) {
		$(window).on('load', function() {
			makeSticky();
		});

		$(window).on('scroll', function() {
			makeSticky();
		});
	}
}

function checkVacancyAsideForm() {
	var form = $('.vacancy-aside__form');
	var saveBtn = form.find('.js-save-phone');
	var phoneNumContainer = form.find('.vacancy-aside__phone');
	var phoneInput = form.find('[name="phone"]');
	var codeInput = form.find('[name="code"]');
	var timeContainer = form.find('.vacancy-aside__repeat-time');
	var repeatTextContainer = form.find('.vacancy-aside__repeat-text');
	var resendBtn = form.find('.vacancy-aside__resend');
	var timeToExpire = 10;
	var stage1 = form.find('.vacancy-aside__stage1');
	var stage2 = form.find('.vacancy-aside__stage2');
	var changePhoneBtn = form.find('.vacancy-aside__change-phone');
	var regCode = /^\d{4}$/;

	if (form.length === 0 || saveBtn.length === 0) {
		return;
	}

	resendBtn.hide();

	saveBtn.on('click', function(e) {
		e.preventDefault();
		var phoneWrittenByUser = phoneInput.inputmask('unmaskedvalue');
		var userLoginToShow;
		var userLogin;
		if (phoneWrittenByUser.length !== 10) {
			phoneInput.parent().next().addClass('isError');
		} else {
			phoneInput.parent().next().removeClass('isError');
			userLoginToShow = phoneInput.val();
			userLogin = userLoginToShow.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
			userLogin = userLogin.replace(/\s/g, '');
			stage1.fadeOut();
			phoneNumContainer.text(userLoginToShow);
			timeContainer.text(timeToExpire);
			stage2.fadeIn();
			setTimeout(function() {
				return timer(timeContainer, repeatTextContainer, resendBtn, changePhoneBtn);
			}, 1000);
		}
	});

	resendBtn.on('click', function(e) {
		e.preventDefault();
		resendCode($(this), repeatTextContainer, timeContainer, timeToExpire);
	});

	changePhoneBtn.on('click', function() {
		clearTimeout(asideVacancyFormTimeout);
		changePhone(phoneNumContainer, phoneInput, stage2, stage1, repeatTextContainer, timeContainer, resendBtn)
	});

	form.on('submit', function(e) {
		e.preventDefault();
		if (phoneNumContainer.text().length === 0) {
			saveBtn.trigger('click');
		} else {
			if (!codeInput.val().match(regCode)) {
				codeInput.parent().next().addClass('isError');
			} else {
				clearTimeout(asideVacancyFormTimeout);
				codeInput.parent().next().removeClass('isError');
				console.log('submit');
			}
		}
	});
}

function changePhone(phoneNumContainer, phoneInput, containerToHide, containerToShow, repeatTextContainer, timeContainer, resendBtn) {
	phoneNumContainer.text('');
	phoneInput.val('');
	containerToHide.fadeOut();
	containerToShow.fadeIn();
	repeatTextContainer.show();
	timeContainer.show();
	resendBtn.hide();
}

function timer(selector, text, resend, changeBtn) {
	var time = +selector.text();
	time--;
	selector.text(time);
	if (time === 0) {
		selector.hide();
		text.hide();
		resend.show();
	} else {
		asideVacancyFormTimeout = setTimeout(function() {
			return timer(selector, text, resend, changeBtn)
		}, 1000);
	}
}

function resendCode(resendBtn, textContainer, timeContainer, time) {
	resendBtn.hide();
	timeContainer.text(time);
	textContainer.show();
	timeContainer.show();
	setTimeout(function() {
		return timer(timeContainer, textContainer, resendBtn);
	}, 1000);
}

function validateCallbackInput(selector) {
	var btn = selector.find('.button');
	var phoneInput = selector.find('[name="phone"]');

	btn.on('click', function(e) {
		var phoneWrittenByUser = phoneInput.inputmask('unmaskedvalue');
		e.preventDefault();
		if (phoneWrittenByUser.length !== 10) {
			phoneInput.parent().next().addClass('isError');
		} else {
			phoneInput.parent().next().removeClass('isError');
		}
	})
}



