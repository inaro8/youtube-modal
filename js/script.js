/**
 * YouTube Player
 */
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const html = document.documentElement;
const body = document.body;
const videoTriggers = document.querySelectorAll('.js-yt-trigger');
const videoContent = document.querySelector('.js-yt');
const videoClose = document.querySelector('.js-yt-close');
const videoOverlay = document.querySelector('.js-yt-overlay');
const videos = document.querySelectorAll('.js-yt-video');
const videosId = Array.from(videos).map(video => video.id);
let currentVideoId;

// YouTube API
function onYouTubeIframeAPIReady() {
	const players = videosId.map(id => {
		return new YT.Player(id, {
			videoId: id,
			playerVars: {
				loop: 0,
				rel: 0
			},
			events: {
				'onStateChange': onPlayerStateChange,
			}
		});
	});

	// モーダルオープン & 動画再生
	const startVideo = (videoId) => {
		videoContent.classList.add("is-open");
		videoOverlay.classList.add("is-open");
		html.classList.add("is-fixed");
		body.classList.add("is-fixed");

		const targetVideo = players.filter((player) => {
			return player.getVideoData().video_id === videoId;
		});
		document.getElementById(
			targetVideo[0].getVideoData().video_id
		).style.display = "block";
		targetVideo[0].unMute().playVideo();
		currentVideoId = videoId;
	};

	// モーダルクローズ & 再生ストップ
	const stopVideo = () => {
		videoContent.classList.remove('is-open');
		videoOverlay.classList.remove('is-open');
		html.classList.remove('is-fixed');
		body.classList.remove('is-fixed');

		const targetVideo = players.filter(player => {
			return player.getVideoData().video_id === currentVideoId;
		});
		targetVideo[0].stopVideo();
		document.getElementById(currentVideoId).style.display = 'none';
	}

	// 再生ボタンをクリックしたとき
	videoTriggers.forEach((videoTrigger) => {
		const videoId = videoTrigger.dataset.ytId;
		videoTrigger.addEventListener("click", startVideo.bind(null, videoId));
	});

	// 閉じるボタンをクリックしたとき
	videoClose.addEventListener('click', stopVideo);

	// オーバーレイ部分をクリックしたときもモーダルを閉じる
	videoOverlay.addEventListener('click', stopVideo);

	// 再生終了時にモーダルを閉じる
	function onPlayerStateChange(e) {
		const ytStatus = e.data;
		if (ytStatus == YT.PlayerState.ENDED) {
			stopVideo();
		}
	}

	// ページ表示後、自動再生させるとき、以下のコメントアウトを外す
	// setTimeout(() => {
	// 	const autoPlayId = videoTriggers[1].dataset.ytId;
	// 	startVideo(autoPlayId);
	// }, 3000);
}
