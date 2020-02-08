import videojs from 'video.js';

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
			videojs.log('Create TextTrack');
			this.createTexTrackBadge(options_.subtitle);
		}
		if (options_.volume) {
			videojs.log('Create VolumeBadge');
			this.createVolumeBadge(options_.volume);
		}
		if (options_.quality) {
			videojs.log('Create Quality');
			this.createQualityBadge(options_.quality);
		}
	}
	/**
	 * Create Badge Text on any selector pass to this function.
	 *
	 * @param  {...any} selector
	 */
	createBadgeTextEl(...selector) {
		if (selector.length > 0) {
			selector.map(selectorStr => {
				const elDom = Dom.$(selectorStr);

				if (elDom) {
					const badgeTextEl = Dom.createEl('span', {
						className: 'vjs-badge-text'
					});

					elDom.appendChild(badgeTextEl);
				}
			});
		}
	}
	/**
	 * The function create `TextTrack` badge top of sub-caps button or else subtitle plugin
	 *
	 * @param {Object} options - { position: 'right'|'left', color:'string', backgroundColor:'string' }
	 */
	createTexTrackBadge(options) {
		const player = this.player_;

		this.createBadgeTextEl(
			'button.vjs-subtitle-setting-button',
			'button.vjs-subs-caps-button'
		);
		player.on('texttrackchange', () => {
			this.onTextTrackChange();
		});
	}
	/**
	 * The function create `TextTrack` badge top of sub-caps button or else subtitle plugin
	 *
	 * @param {Object} options - { position: 'right'|'left', color:'string', backgroundColor:'string' }
	 */
	createQualityBadge(options) {
		const player = this.player_;

		this.createBadgeTextEl('.vjs-quality-selector button');
		if (player.qualityLevels) {
			player.qualityLevels().on('change', () => {
				this.onQualityChange();
			});
		}
	}
	/**
	 * The function create `Volume` badge top of volume-bar
	 *
	 * @param {Object} options - { position: 'right'|'left', color:'string', backgroundColor:'string' }
	 */
	createVolumeBadge(options) {
		const player = this.player_;

		this.createBadgeTextEl('.vjs-mute-control');
		this.setVolume();
		player.on('volumechange', () => {
			this.onVolumeChange();
		});
	}

	/**
	 *
	 */
	onQualityChange() {
		const levels = this.player_.qualityLevels().levels_;
		if (levels && levels.length > 0) {
			const currentLevel = levels[this.player_.qualityLevels().selectedIndex];
			this.setValue('.vjs-quality-selector button .vjs-badge-text', () => {
				if (currentLevel.height) {
					if (currentLevel.height === 720 || currentLevel.height === 1080) {
						return 'HD';
					} else {
						return currentLevel.height;
					}
				} else {
					return this.player.localize('quality');
				}
			});
		}
	}
	/**
	 *
	 */
	onVolumeChange() {
		this.setVolume();
	}

	/**
	 *
	 */
	onTextTrackChange() {
		const textTracks = this.player_.textTracks();
		const subTextDoms = [];

		subTextDoms.push(
			Dom.$('button.vjs-subtitle-setting-button .vjs-badge-text')
		);
		subTextDoms.push(Dom.$('button.vjs-subs-caps-button .vjs-badge-text'));
		if (subTextDoms && subTextDoms.length > 0) {
			if (textTracks && textTracks.tracks_.length > 0) {
				textTracks.tracks_.map(textTrack => {
					if (textTrack.mode && textTrack.mode === 'showing') {
						subTextDoms.map(subText => {
							if (subText) {
								if (subText.innerText.toLowerCase() !== textTrack.language) {
									subText.innerText = textTrack.language.toLowerCase();
								}
							}
						});
					}
				});
			}
		}
	}

	setVolume() {
		const vjsBadgeTextEl = Dom.$('.vjs-mute-control .vjs-badge-text');

		if (vjsBadgeTextEl) {
			vjsBadgeTextEl.innerText = parseInt(this.player_.volume() * 100, 10);
		}
	}
	setValue(selectorStr, func) {
		if (selectorStr && func) {
			if (typeof func === 'function') {
				const el = Dom.$(selectorStr);
				if (el) {
					el.innerText = func();
				}
			}
		}
	}
}

Badge.prototype.name = 'ControlBadge';

export default Badge;
