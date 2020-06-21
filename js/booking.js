var Booking = function() {

	var currentStep = null

	this.isActive = function() {
		return this.currentStep != null
	}

	this.start = function() {
		$('.booking').removeClass('hidden')
		this.updateStep('showPrices')
	}

	this.updateStep = function(step) {
		this.currentStep = step
		this.updateBookingView()

	}

	this.end = function() {
		$('.booking').addClass('hidden')
		this.currentStep = null
	}

	this.chooseOption = function() {
		this.updateStep('review')
	}

	this.confirm = function() {
		this.updateStep('confirmed')
	}

	this.updateBookingView = function() {
		var view = null

		if (this.currentStep == 'showPrices') {
			view = $(".booking-options").html()
		}

		if (this.currentStep == 'review') {
			view = $(".booking-review").html()
		}

		if (this.currentStep == 'confirmed') {
			view = $(".booking-confirmed").html()
		}

		if (view != null) {
			$(".booking-vr .inner-content").html(view)
			$(".booking-vr .inner-content-right").html(view)
		}
	}
}
