import videojs from "video.js";

const Dom = videojs.dom;

class Badge {
	constructor(player, options) {
		this.player_ = player;
		this.options = options;
	}

	/**
	 * The initial function to create element's
	 *
	 */
	createBadges() {
		const options_ = this.options;
		if (options_.subtitle) {
			videojs.log("Create TextTrack");
			this.createTexTrackBadge(options_.subtitle);
		}
		if (options_.volume) {
			videojs.log("Create VolumeBadge");
			this.createVolumeBadge(options_.volume);
		}
		if (options_.quality) {
		}
	}
	/**
	 * The function create `TextTrack` badge top of sub-caps button or else subtitle plugin
	 *
	 * @param {object} options - { position: 'right'|'left', color:'string', backgroundColor:'string' }
	 */
	createTexTrackBadge(options) {
		const player = this.player_;
		player.on("texttrackchange", e => {
			this.onTextTrackChange();
		});
	}
	/**
	 * The function create `Volume` badge top of volume-bar
	 *
	 * @param {object} options - { position: 'right'|'left', color:'string', backgroundColor:'string' }
	 */
	createVolumeBadge(options) {
		const player = this.player_;
		player.on("volumechange", e => {
			this.onVolumeChange();
		});
	}

	/**
	 *
	 */
	onVolumeChange(options) {
		videojs.log("volume :", parseInt(this.player_.volume() * 100));
	}

	/**
	 *
	 */
	onTextTrackChange() {
		const textTracks = this.player_.textTracks();
		const subTextDoms = [];
		subTextDoms.push(Dom.$(".vjs-subtitle-setting-button .vjs-control-text"));
		subTextDoms.push(Dom.$(".vjs-subs-caps-button .vjs-control-text"));
		if (subTextDoms && subTextDoms.length > 0) {
			if (textTracks && textTracks.tracks_.length > 0) {
				textTracks.tracks_.map(textTrack => {
					if (textTrack.mode && textTrack.mode === "showing") {
						subTextDoms.map(subText => {
							if (subText) {
								if (subText.innerText !== textTrack.language) {
									subText.innerText = textTrack.language;
								}
							}
						});
					}
				});
			}
		}
	}
}

Badge.prototype.name = "ControlBadge";

export default Badge;
