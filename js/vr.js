var VR = function() {

    const DEFAULT_PROJECTION = '360';

    console.log(DEFAULT_PROJECTION);

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

    this.showCardboardView = function() {
        // Toggle cardboard
        var interval = setInterval(function(){
            if ($("canvas").length > 0) {
                setTimeout(function() {
                    $(".vjs-button-vr").click()
                    this.resume()
                }.bind(this),200)
                clearInterval(interval)
            }
        }.bind(this), 100)
    }

    this.switchVideo = function(video) {
        this.player.src({ src: video.src });
        this.player.mediainfo.projection = video.projection || DEFAULT_PROJECTION;
        this.player.play()

        this.showCardboardView()
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
    }

    this.start = function() {
        this.player = window.player = videojs('videojs-vr-player');
        player.mediainfo = player.mediainfo || {};
        player.mediainfo.projection = DEFAULT_PROJECTION;

        this.vr = window.vr = player.vr({
            motionControls:true,
            projection: 'AUTO',
            debug: true,
            forceCardboard: true
        });

        this.player.play()

        this.showCardboardView()
    }
}