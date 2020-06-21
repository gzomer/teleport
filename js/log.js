var Log = function() {

	this.log = function(level, message, extra = null) {
		if (extra != null) {
			console.log('[' + level + ']', message, extra);
		} else {
			console.log('[' + level + ']', message);
		}

	}

	this.info = function( message, extra = null) {
		this.log('INFO', message, extra);
	}

	this.warn = function( message, extra = null) {
		this.log('WARN', message, extra);
	}
}