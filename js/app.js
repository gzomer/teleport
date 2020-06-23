var App = function() {

	this.log = new Log();
	this.teleport = new Teleport();
	this.witai = new WitAI();
	this.audio = new Audio()
	this.vr = new VR()
	this.currentInstruction = 0
	this.inConversation = false
	this.booking = new Booking()
	this.shouldDetectStandalone = true

	this.init = function() {
		this.showInstructions()

		if (localStorage.getItem('ignoreStandalone')) {
			this.shouldDetectStandalone = false
		}

		if (!window.navigator.standalone && this.shouldDetectStandalone) {
			return
		} else {
			this.nextInstruction()
		}

		this.audio.unlockAudio()
		this.audio.askPermission()
		.then(function(){
			this.nextInstruction()
			this.waitForOrientationPermission()
		}.bind(this), function(e) {
			this.log.warn('Permission error', e)
		}.bind(this))

		this.setupHandlers()
	}

	this.setupHandlers = function() {
		$("#orientationPermissionBtn").click(this.onAllowOrientationClick.bind(this));
		$("#startVR").click(this.onStartClick.bind(this));
	}

	this.waitForOrientationPermission = function() {
		if (!this.vr.hasDeviceOrientation()) {
			this.nextInstruction()
			return;
		}

		this.vr.testDeviceOrientation()
		.then(function(result){
			this.nextInstruction()
		}.bind(this), function(err) {
			this.vr.askPermissionOrientation()
		}.bind(this))

	}

	this.showVR = function() {
		$('.vr').removeClass('hidden')
		this.vr.start();
	}

	this.onRecordCallback = async function(stream) {
		this.log.info('On new recording', stream)

		var action = await this.witai.detectSpeech(stream)

		this.processAction(action)
	}

	this.processAction = function(action) {
		var result = this.teleport.process(action)

		this.log.info('Action result', result)

		if (!result) {
			return
		}

		// Listen only to end of conversation while in conversation
		if (this.inConversation) {
			if (result.end_call) {
				this.endConversation()
			}
			return
		}

		// Listen only to booking related things when booking
		if (this.booking.isActive()) {
			if (result.end_booking) {
				this.endBooking()
			}
			if (result.choose_option) {
				this.chooseBookingOption()
			}
			if (result.confirm) {
				this.confirmBooking()
			}
			return
		}

		if (result.video) {
			this.vr.switchVideo(result.video)
		} else if (result.invite_friend) {
			this.startConversation(result.invite_friend)
		} else if (result.book_trip) {
			this.startBooking(result.book_trip)
		} else if (result.player_pause) {
			this.pauseVR()
		} else if (result.player_resume) {
			this.resumeVR()
		} else if (result.audio) {
			this.playAudio(result.audio)
		}
	}

	this.playAudio = function(audio) {
		$("#" + audio)[0].play()
	}

	this.startRecorder = function() {
		this.audio.startRecorder(this.onRecordCallback.bind(this), this.onRecordInit.bind(this));
	}

	this.onRecordInit = function() {
		this.log.info('Recorder initialized');
	}

	this.onStartClick = function() {
		this.hideInstructions();
		this.showVR()
		this.startRecorder();
	}

	this.pauseVR = function() {
		if (!this.vr) {
            return
        }
		this.vr.pause();
	}

	this.resumeVR = function() {
		if (!this.vr) {
            return
        }
		this.vr.resume();
	}

	this.startConversation = function(contact) {
		this.inConversation = true;
		this.pauseVR()

		// Mock for conversation
		function playAnyWeekend(){
			$("#any_weekend")[0].play()
		}

		function playGoTogether(cb){
			$("#go_together")[0].play()
			setTimeout(function(){
				cb()
			}, 6500)
		}

		function playHey(cb) {
			$("#hey")[0].play()
			setTimeout(function(){
				cb()
			}, 8000)
		}

		// Mock talking with a friend
		playHey(function() {
			playGoTogether(function(){
				playAnyWeekend()
			})
		})
	}

	this.endConversation = function() {
		this.inConversation = false;
		this.resumeVR()
	}


	this.startBooking = function() {
		this.pauseVR()
		this.booking.start()
	}

	this.chooseBookingOption = function() {
		this.booking.chooseOption()
	}

	this.confirmBooking = function() {
		this.booking.confirm()
	}

	this.endBooking = function() {
		this.resumeVR()
		this.booking.end()
	}

	this.onAllowOrientationClick = function() {
		this.vr.askPermissionOrientation()
		.then(function(result) {
			this.nextInstruction()
		}.bind(this), function(e) {
			console.log(e)
		})
	}

	this.showInstructions = function() {
		this.nextInstruction();
	}

	this.hideInstructions = function() {
		$('.instructions').hide()
	}

	this.nextInstruction = function() {
		this.currentInstruction += 1;
		$('.step').removeClass('step-active');
		$('.step' + this.currentInstruction).addClass('step-active');
	}
}

let app = null
$(function(){
	app = new App();
	app.init();
})
