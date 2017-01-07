$(document).ready(function() {

	// Enable all tooltips.
	$('[data-toggle="tooltip"]').tooltip({animation: false, html: true});

	if( $("#wistia_z4xyhwsco0")[0] ) {
		wistiaEmbed = Wistia.embed("z4xyhwsco0", {
			version: "v1",
			videoWidth: '100%',
			videoHeight: '100%',
			playerColor: "0A2240",
			autoPlay: false,
			playbar: false,
			fullscreenButton: false,
			playerPreference: 'html5',
			controlsVisibleOnLoad: false,
			smallPlayButton: true,
			playButton: true
		});
		
		// insert the 'bind on play' function
		wistiaEmbed.bind('end', function() {
			// use the .time() method to jump ahead 10 seconds
			window.stop_scroll = true;
			// Remove the fixed video.
			$("#wistia_z4xyhwsco0").removeClass("fixed-video");
		});	
		
	}
	
	// Check if object is JSON.
	isJSON = function(obj) {
		try {
			JSON.parse(obj);
		} catch(e) {
			return false;
		}
		return true;
	}

	// Prevent links from going to other pages if they should open a modal. 
	$("[data-modal]").attr("href", "javascript: void(0);");
	
	$(document).on("click", ".open-mobile-menu", function() {
		$menu = $("#mobile-menu");
		if($menu.hasClass("opened")) {
			// Hide the menu 
			options = { left: "-100%" }
			
		} else {
			// Show the menu 
			options = { left: "0%" }
		}
		$menu.animate(
						options
					, 275, function() {
						$(this).toggleClass("opened");
					});
	})
	.on("click", ".close-mobile-menu", function() {
		$menu = $("#mobile-menu");
		// Hide the menu 
		options = { left: "-100%" }
		$menu.animate(
						options
					, 275, function() {
						$(this).removeClass("opened");
					});
	})
	.on("click", "[data-modal]", function(e) {
		e.preventDefault();
		var modal = $(this).data("modal"); 	// This is the ID we should be selecting. 
		// Open the modal.
		$( modal ).modal("show");
		
	});
	
	
	$(document).on("submit", "form#contact", function(e) {
		e.preventDefault();
		var send = {};
			send.email = $.trim( $("#email").val() );
			send.name = $.trim( $("#name").val() );
			send.subject = $.trim( $("#subject").val() );
			send.message = $.trim( $("#message").val() );

		if(send.email.length == 0 || send.name.length == 0 || send.message.length == 0) {
			if(send.name.length == 0) {
				$("#name").select();
			} else if(send.email.length == 0) {
				$("#email").select();
			} else if(send.message.length == 0) {
				$("#message").select();
			} else {
				alert("problem");
			}
			return false;
		}		
			
		$this = $("#submit", this);
		$this.button('loading');
		
		$.ajax({
			type:		"POST",
			url:		"./ajax/contact.php",
			data:		send
		})
		.done(function(data) {

			if(isJSON(data)) {
				data = JSON.parse(data);
				if(data.sent !== undefined) {
					if(data.sent == true) {
						// Email was sent
						$this.text("Thank you. I'll contact you shortly."); 
					} else {
						// Email was not sent
						$this.text("Could not send message")
					}
				} else {
					$this.text("Could not send message");
				}
			} else {
				alert(data);
			}		
		})
		.fail(function(e) {
			alert(e.responseText);
		});
				
	})
	.on("click", ".open-testimonial", function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		
		// Stop the primary video from playing 
		if( wistiaEmbed !== undefined ) {
			wistiaEmbed.pause();
		}
		
		$modal = $("#user-approval-videos");
		$video_iframe = $("#testimonial-video", $modal);
		
		$video_iframe.attr("src", $(this).data("video"));
		$modal.modal('show');
		
		return false;
	});
	
	// When a testimonial video modal is closed, stop the video from playing. 
	$('#user-approval-videos').on('hidden.bs.modal', function (e) {
		$("#testimonial-video", $modal).attr("src", "...");
	})
	
	function isElementInViewport (el) {

		//special bonus for those using jQuery
		if (typeof jQuery === "function" && el instanceof jQuery) {
			el = el[0];
		}

		var rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= $(window).height() && 
			rect.right <= $(window).width()
		);
	}


	// Force the video to scroll with the page.
	$frame1_height = $("#frame1").outerHeight();
	$intro_video_container = $("#video");
	$intro_video = $("#wistia_z4xyhwsco0");
	
	if( $(window).width() >= 767 ) {
		$(document).scroll(function() {
			//console.log($(window).scrollTop());
			
			if(window.stop_scroll === undefined ) {
				// Check if window is scrolled passed the first frame. 
				if( $(window).scrollTop() > $frame1_height ) {
					// Check if the intro video container is visible. If it is not visible, force the div#wistia_1zq2d6ss6z to be at a fied position.
					if( !isElementInViewport( $intro_video_container ) ) {
						// Show the scrolling video. 
						$intro_video.addClass("fixed-video");
					
					} else {
						// Hide the video 
						$intro_video.removeClass("fixed-video");
						
					}
				} else if ( $(window).scrollTop() <= $frame1_height / 2 ) {
					$intro_video.removeClass("fixed-video");
				}
			}
			
		});
	}
	

});