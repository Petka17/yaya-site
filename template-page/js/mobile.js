$(function() {

	if ($('.js-video-preview').length > 0) {
		playVideo($('.js-video-preview'));
	}

	if ($('.intro__link-wrapper').length > 0) {
		fixButton($('.intro__link-wrapper'));
	}

	if ($('#main-link').length > 0 ) {
		changeLink($('#main-link'))
	}

});

function isiOS () {
	return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}

function changeLink(selector) {
	if (isiOS()) {
		selector[0].href = "https://itunes.apple.com/ru/app/yaya-вакансии/id1421839165"
	}
}

function playVideo(selector) {
	var video = selector.parent().find('video');
	video.mediaelementplayer({
		alwaysShowControls: true,
		videoVolume: 'vertical',
		features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen']
	});

	selector.on('click', function() {
		$(this).css('z-index', 0);
		video[0].play();
	});

	video[0].addEventListener('ended', function() {
		console.log($(this).closest('.mejs__container').parent().find(selector));
		$(this).closest('.mejs__container').parent().find(selector).css('z-index', 2);
	});
}

function fixButton(selector) {
	var triggerHeight = selector.offset().top + selector.height();
	$(window).on('scroll', function() {
		if ($(document).scrollTop() > triggerHeight) {
			selector.addClass('fixed');
		} else {
			selector.removeClass('fixed');
		}
	});
}