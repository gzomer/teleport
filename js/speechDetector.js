var SpeechDetector = function() {

    this.detectSilence = function(streamSource, onSoundStart = _ => {}, onSoundEnd = _ => {},
    							  silenceDelay = 1000, minDecibels = -60, maxDecibels = -10) {

        const ctx = this.getContext();
        const analyser = ctx.createAnalyser();

        streamSource.connect(analyser);

        analyser.minDecibels = minDecibels;
        analyser.maxDecibels = maxDecibels;

        const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
        let silence_start = performance.now();
        let triggered = false; // trigger only once per silence event

        function loop(time) {
            requestAnimationFrame(loop); // we'll loop every 60th of a second to check
            analyser.getByteFrequencyData(data); // get current data

            if (data.some(v => v)) { // if there is data above the given db limit
                if (triggered) {
                    triggered = false;
                    onSoundStart();
                }
                silence_start = time; // set it to now
            }
            if (!triggered && time - silence_start > silenceDelay) {
                onSoundEnd();
                triggered = true;
            }
        }
        loop();
    }

    this.getContext = function() {
        if (this._audioContext != null) {
            return this._audioContext
        }
        if (typeof webkitAudioContext != 'undefined') {
            this._audioContext = new webkitAudioContext()
        }
        if (typeof AudioContext != 'undefined') {
            this._audioContext = new AudioContext()
        }
        return this._audioContext
    }


    this.getMediaStreamSource = function(stream) {
        var context = this.getContext();
        return context.createMediaStreamSource(stream);
    }

    this.startListening = function(onSpeakCallback, onSilenceCallback) {
        this.onSilenceCallback = onSilenceCallback;
        this.onSpeakCallback = onSpeakCallback

        const SILENCE_DELAY = 300;
        return new Promise(function(resolve, reject) {
            navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                .then(function(stream){
                    let streamNode = this.getMediaStreamSource(stream)

                    this.detectSilence(streamNode, this.onSpeakCallback, this.onSilenceCallback, SILENCE_DELAY);
                    resolve(streamNode);
                }.bind(this)).catch(e => reject(e));
        }.bind(this));

    }
}