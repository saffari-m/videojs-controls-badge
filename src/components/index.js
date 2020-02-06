import videojs from "video.js";

class ControlBadge {
  
	constructor(player, options) {
		this.player_ = player;
		this.options = options;
	}
}

ControlBadge.prototype.name = "ControlBadge";

export default ControlBadge;
