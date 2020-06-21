var Audio = function() {

    this.speechDetector = new SpeechDetector();
    this.log = new Log();

    this.getUserMedia = function() {
        return navigator.mediaDevices.getUserMedia({
            audio: true
        })
    }

    this.unlockAudio = function() {
        function unlockAudio() {
          $(".audio-file").map(function(index, item) {
            item.play()
            item.pause()
          })
          document.body.removeEventListener('click', unlockAudio)
          document.body.removeEventListener('touchstart', unlockAudio)
        }
        document.body.addEventListener('click', unlockAudio)
        document.body.addEventListener('touchstart', unlockAudio)
    }

    this.askPermission = function() {
        return new Promise(function(resolve, reject) {

            navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                .then(function(stream) {
                    resolve('authorized')
                }, function(err) {
                    reject({
                        'type': 'audio_not_authorized',
                        'err': err
                    })
                })
        });
    }

    this.onSpeak = function() {
        this.log.info('On speak');
        this.startRecording();
    }

    this.onSilence = function() {
        this.log.info('On silence');
        this.stopRecording();
    }

    this.createRecorder = function(streamNode, onInitCallback) {
        this.recorder = new Recorder(streamNode, {
            numChannels: 1
        }, onInitCallback);
    }

    this.startRecording = function() {
        if (this.isRecording || !this.recorder || !this.recorder.initialized) {
            return;
        }
        this.log.info('Start recording')

        this.recorder.clear()
        this.recorder.record()

        this.isRecording = true
    }

    this.stopRecording = function() {
        if (!this.isRecording || !this.recorder || !this.recorder.initialized) {
            return
        }
        this.log.info('Stop recording')

        this.recorder.stop();
        this.isRecording = false;

        this.recorder.exportMonoWAV(function(stream) {
            this.isRecording = false;
            if (this.onRecordCallback){
            	this.onRecordCallback(stream);
            }
        }.bind(this));
    }
    this.startRecorder = async function(onRecordCallback, onInitCallback) {
    	this.onRecordCallback = onRecordCallback;
        let streamNode = await this.speechDetector.startListening(this.onSpeak.bind(this), this.onSilence.bind(this))

        this.createRecorder(streamNode, onInitCallback);
    }
}