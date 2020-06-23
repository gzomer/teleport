var VR = function() {

    const DEFAULT_PROJECTION = '360';

    this.log = new Log();

    this.hasStartedCardboard = false

    this.hasDeviceOrientation = function() {
        return typeof DeviceMotionEvent != 'undefined' && typeof DeviceMotionEvent.requestPermission != "undefined"
    }

    this.testDeviceOrientation = function() {
        return new Promise(function(resolve, reject) {

            if (!this.hasDeviceOrientation()){
                reject();
                return
            }

            let alreadyEnabled = false;

            const deviceOrientationCallback = function() {
                alreadyEnabled = true;
                window.removeEventListener('deviceorientation', deviceOrientationCallback);
            }
            window.addEventListener('deviceorientation', deviceOrientationCallback);

            setTimeout(function(){
                window.removeEventListener('deviceorientation', deviceOrientationCallback);
                if (alreadyEnabled) {
                    resolve(true)
                } else {
                    reject(false)
                }
            },200)
        }.bind(this))
    }

    this.askPermissionOrientation = function() {

        return new Promise(function(resolve, reject) {

            if (typeof DeviceMotionEvent.requestPermission != "undefined") {
                DeviceMotionEvent.requestPermission().then(function(response) {
                    if (response == 'granted') {
                        resolve({'granted':true});
                    } else {
                        reject({'granted':false});
                    }
                }, function(err) {
                    reject({'error':err});
                })
            } else {
                resolve({'not_available':true});
            }
        })
    }

    this.repeat = function (method, times) {
        var interval = setInterval(function(){
            if (times-- < 0 ) {
                clearInterval(interval)
                return
            }
            method()
        }, 200)
    }

    this.showCardboardView = function() {
        if (this.hasStartedCardboard) {
            // Reset before switching view
            $(".vjs-button-vr").trigger('click')
        }

        var interval = setInterval(function(){
            if ($(".vjs-waiting").length == 0) {
                setTimeout(function() {
                    $(".vjs-button-vr").trigger('click')
                    this.resume()
                    this.repeat(this.resume, 10)
                    this.hasStartedCardboard = true;

                    setTimeout(function() {
                        $(".overlay").addClass('hidden')
                    }, 500)
                }.bind(this), 10)
                clearInterval(interval)
            }
        }.bind(this), 10)
    }

    this.switchVideo = function(video) {

        $(".overlay").removeClass('hidden')

        this.player.src({ src: video.src });

        this.player.mediainfo.projection = video.projection || DEFAULT_PROJECTION;

        this.vr = this.player.vr({
            motionControls:true,
            projection: 'AUTO',
            debug: true,
            forceCardboard: true
        });

        this.player.play()
        .then(function(){
            this.showCardboardView()
        }.bind(this), function(err){
            this.log.warn('VR play error', err)
        }.bind(this))
    }

    this.pause = function() {
        if (!this.player) {
            return
        }
        this.player.pause()
    }

    this.resume = function() {
        if (!this.player) {
            return
        }
        this.player.play()
        .then(function(){

        }.bind(this), function(err){
            this.log.warn('VR play error', err)
        }.bind(this))
    }

    this.start = function() {
        this.player = videojs('videojs-vr-player');
        this.player.mediainfo = this.player.mediainfo || {};
        this.player.mediainfo.projection = DEFAULT_PROJECTION;

        this.vr = this.player.vr({
            motionControls:true,
            projection: 'AUTO',
            debug: true,
            forceCardboard: true
        });

        this.player.play()
        .then(function(){
            this.showCardboardView()
        }.bind(this), function(err){
            this.log.warn('VR play error', err)
        }.bind(this))


    }
}