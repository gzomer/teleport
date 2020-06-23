var WitAI = function() {

	this.log = new Log();
	this.CONFIDENCE_THRESHOLD = 0.70;
	this.CLIENT_TOKEN = 'EFTZM5QECWTY5XIAWBNOUMZX5MRLDJGU';
	this.BASE_URL = 'https://teleport.guru/witai';

	const MAP_INTENTS = {
		"experience_skydive": {
			"action": "show",
			"thing": "skydive"
		},
		"experience_painting": {
			"action": "show",
			"thing": "painting"
		},
		"experience_scuba_diving": {
			"action": "show",
			"thing": "scuba_diving"
		},
		"experience_wildlife": {
			"action": "show",
			"thing": "wildlife"
		},
		"post_facebook": {
			"action": "post_facebook"
		},
		"invite_friend": {
			"action": "invite_friend",
			"contact" : "$wit$contact:contact"
		},
		"end_call": {
			"action": "end_call"
		},
		"attraction_info":{
			"action" : "attraction_info"
		},
		"go_to": {
			"action" : "show",
			"location" : "$wit$location:location"
		},
		"next_attraction": {
			"action" :"next_attraction"
		},
		"player_pause": {
			"action" :"player_pause"
		},
		"player_resume": {
			"action" :"player_resume"
		},
		"post_facebook": {
			"action" :"post_facebook"
		},
		"book_trip": {
			"action" :"book_trip"
		},
		"end_booking": {
			"action" :"end_booking"
		},
		"choose_option": {
			"action" : "choose_option"
		},
		"confirm": {
			"action" : "confirm"
		}
	}

	this.uploadSpeech = function(blob) {

		return new Promise((resolve, reject) => {
			try {
	            fetch(this.BASE_URL + '/speech?v=20200513', {
	                method: 'POST',
	                headers: {
	                  Authorization: 'Bearer ' + this.CLIENT_TOKEN,
	                  "Content-Type": "audio/wav"
	                },
	                body: blob
	              }).then(
	                response => response.json()
	              ).then(
	                data => resolve(data)
	              ).catch(
	                error => reject(error)
	              );
	        } catch (e) {
	        	this.log.warn(e);
	        	reject(e);
	        }
		})
	}

	this.getMessage = function(message) {

		return new Promise((resolve, reject) => {
			try {
	            fetch(this.BASE_URL + '/message?v=20200513&q=' + message, {
	                method: 'GET',
	                headers: {
	                  Authorization: 'Bearer ' + this.CLIENT_TOKEN,
	                }
	              }).then(
	                response => response.json()
	              ).then(
	                data => resolve(data)
	              ).catch(
	                error => reject(error)
	              );
	        } catch (e) {
	        	this.log.warn(e);
	        	reject(e);
	        }
		})
	}

	this.detectMesssage = async function(text) {
		let response = await this.getMessage(text)

		return this.convertIntentToAction(response);
	}

	this.detectSpeech = async function(blob) {
		let response = await this.uploadSpeech(blob)

		return this.convertIntentToAction(response);
	}

	this.convertIntentToAction = function(response) {
		if (!response.intents || response.intents.length == 0) {
			return null
		}

		firstIntent = response.intents[0];

		if (firstIntent.confidence < this.CONFIDENCE_THRESHOLD) {
			return null;
		}

		if (typeof MAP_INTENTS[firstIntent.name] === 'undefined') {
			return null;
		}

		let action = Object.assign({}, MAP_INTENTS[firstIntent.name]);

		for (var key in action) {
			var value = action[key];

			// If it is a entity
			if (value[0] == '$') {
				var entityKey = value.slice(1);

				if (typeof response.entities[entityKey] === 'undefined' || response.entities[entityKey].length == 0) {
					return null;
				}

				var firstEntity = response.entities[entityKey][0];

				if (firstEntity.confidence < this.CONFIDENCE_THRESHOLD) {
					return null;
				}
				action[key] = firstEntity.body.toLowerCase();
			}
		}
		return action;
	}
}