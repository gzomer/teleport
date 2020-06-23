var Teleport = function() {

	this.log = new Log();

	this.state = {
		currentLocation : null
	}

	this.THINGS_TO_SEE = {
		'wildlife' : [
			{
				'video': {
					'src': '/videos/elephants.mp4',
					'projection' :'360'
				}
			}
		],
		'scuba_diving' : [
			{
				'video': {
					'src': '/videos/scuba.mp4',
					'projection' :'360'
				}
			}
		],
		'painting' : [
			{
				'id' :'video_sistine',
				'video' : {
					'src': '/videos/sistine.mp4',
					'projection' : '360'
				},
				'audio': 'sistine'
			}
		]
	}

	// Audio info
	this.INFOS = {
		'video_sistine' : 'sistine'
	}

	this.LOCATIONS_TO_VISIT = {
		'everest': {
			'start' : {
				'video' : {
					'src' : '/videos/everest.mp4',
					'projection' :'360'
				}
			}
		},
		'coliseum': {
			'start' : {
				'video' : {
					'src' : '/videos/coliseum.mp4',
					'projection' :'EAC'
				}
			}
		},
		'rome': {
			'start' : {
				'video' : {
					'src' : '/videos/rome-full.mp4',
					'projection' :'EAC'
				}
			},
			'attractions' : [
				{
					'name' : 'Pantheon',
					'video' : {
						'src' : '/videos/pantheon.mp4',
						'projection' :'EAC'
					}
				},
				{
					'name' : 'Coliseum',
					'video' : {
						'src' : '/videos/coliseum.mp4',
						'projection' :'EAC'
					}
				}
			]
		},
		'back' : {
			'start' : {
				'video' : {
					'src' : '/videos/world.mp4',
					'projection' :'360'
				}
			},
		}
	}

	this.setState = function(newState) {
		this.state = {...this.state, ...newState};
	}

	this.process = function(action) {
		this.log.info('Process action', action);
		return this.parseAction(action);
	}

	this.getThingVideos = function(thing) {
		return this.THINGS_TO_SEE[thing];
	}

	this.hasThing = function(thing) {
		return typeof this.THINGS_TO_SEE[thing] != 'undefined';
	}

	this.hasLocation = function(location) {
		return typeof this.LOCATIONS_TO_VISIT[location] != 'undefined';
	}

	this.isThing = function(action) {
		return action.action == 'show' && typeof action.thing != 'undefined';
	}

	this.isLocation = function(action) {
		return action.action == 'show' && typeof action.location != 'undefined';
	}

	this.chooseRandomVideo = function(videos) {
		return videos[Math.floor(Math.random()*videos.length)];
	}

	this.getStartVideoFromLocation = function(location) {
		return this.LOCATIONS_TO_VISIT[location].start;
	}

	this.parseAction = function (action) {
		if (!action) {
			return null;
		}
		if (this.isThing(action)) {
			if (this.hasThing(action.thing)) {
				var video = this.chooseRandomVideo(this.getThingVideos(action.thing));
				this.setState({
					currentVideo: video
				})

				return video
			}
		} else if (this.isLocation(action)) {

			if (this.hasLocation(action.location)) {
				this.setState({
					currentLocation : action.location
				})
				var video = this.getStartVideoFromLocation(action.location);
				this.setState({
					currentVideo: video
				})

				return video
			}
		} else if (action.action == 'attraction_info') {
			if (this.state.currentVideo != null) {
				var videoId = this.state.currentVideo.id

				if (typeof this.INFOS[videoId] != 'undefined') {
					return {
						audio : this.INFOS[videoId]
					}
				}
			}
		} else if (action.action == 'next_attraction') {
			if (!this.state.currentLocation) {
				return null;
			}

			var attractions = this.LOCATIONS_TO_VISIT[this.state.currentLocation].attractions

			var nextAttractionIndex = 0;
			if (this.state.currentAttraction != null) {
				nextAttractionIndex = (this.state.currentAttraction + 1) % attractions.length
			}
			this.setState({
				currentAttraction : nextAttractionIndex
			})
			var video = attractions[nextAttractionIndex];
			this.setState({
				currentVideo: video
			})

			return video
		} else if (action.action != null) {
			var result = {}
			result[action.action] = action

			return result
		}

		return null;
	}
}