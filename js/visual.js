//all functions actions that cause visual changes
jQuery(function($) {
	
	if(numCircuit == "single") {
		$('.twin-circuit').remove();
		$('.content').addClass('single');
	}
	else if(numCircuit == "twin") {
		$('.single-circuit').remove();
		$('.content').addClass('twin');
	}


	

	
	$('.nav-button').click(function() {
		
		var password = '12345';
		var view = $(this).children('a').data('target');
		
		//check to see if user is trying to enter restricted area.
		if(view == 'page-setup') {
			var input = prompt('This area is restricted. Please enter a valid password:');
			if(input != password) {
				alert('Sorry, that password is incorrect.');
				return false;
			}
		}
		
		$('.nav-button').each( function() {
			if($(this).hasClass('active')) {
				$(this).removeClass('active');
			}
		});
		// make no page view active
		$('.main.view').each(function() {
			if($(this).hasClass('active')) {
				$(this).removeClass('active');
			}
		});
		
		//set nav button target as active
		$('.view.'+$(this).children('a').data('target')).addClass('active');
		//set nav button as active
		$(this).addClass('active');
	});
	
	$('#siteName').change(function() {
		$('#main-site-name').html($(this).val());
	});
	
	//change number of compressor buttons on main
	$('#cNum').change(function() {
		$('.tabs').each(function() {
			if($(this).hasClass('active')) {
				$(this).removeClass('active');
			}
		});
		
		$('.tabs.'+$(this).val()).addClass('active');
		
	});
	
	
	$('#setTons').change(function() {
		if($(this).val() == 35) {
			mainPowerGauge = new PerfectWidgets.Widget("main-power-gauge", mainPowerModel35);
			mainCapacityGauge = new PerfectWidgets.Widget("main-capacity-gauge", mainCapacityModel35);
		}
		else if($(this).val() == 75) {
			mainPowerGauge = new PerfectWidgets.Widget("main-power-gauge", mainPowerModel75);
			mainCapacityGauge = new PerfectWidgets.Widget("main-capacity-gauge", mainCapacityModel75);
		}
	});
	
	//control main page tab highlighting
	/*$('.tabs .tab').click(function() {
		if(!$(this).hasClass('dead')) {
			if($(this).hasClass('active')) {
				$(this).removeClass('active');
			}
			else {
				$(this).addClass('active');
			}
		}
	});*/
	
	/*
	 $('input.oem-val').blur(function() {
		if($(this).prop('id') == 'oemEER') {
			$('#stats-oem-eer').html($(this).val());
		}
		else if($(this).prop('id') == 'oemIEER') {
			$('#stats-oem-ieer').html($(this).val());
		}
		else if($(this).prop('id') == 'oemKWT') {
			$('#stats-oem-kwt').html($(this).val());
		}
	 });
	*/
	//control circuit button
	$('.tab.circuit').click(function() {
		if($(this).hasClass('c1')) {
			$('.tab.circuit').removeClass('c1');
			$('.tab.circuit').addClass('c2');
			$('.tab.circuit').html('Circuit 2');
			$('.tab.circuit').data('circuit',2);
			$('.circuit2').css('display', 'block');
			$('.circuit1').css('display', 'none');
			
		}
		else if($(this).hasClass('c2')){
			$('.tab.circuit').removeClass('c2');
			$('.tab.circuit').addClass('c1');
			$('.tab.circuit').html('Circuit 1');
			$('.tab.circuit').data('circuit',1);
			$('.circuit1').css('display', 'block');
			$('.circuit2').css('display', 'none');
		}
	});
	

	$('#thermo-help').click(function() {
		$('.thermo-callout.help').each(function() {
			if($(this).css('display') == 'none') {
				$(this).css('display', 'block');
			}
			else {
				$(this).css('display', 'none');
			}
		});
	});
	
	
	//  This function actuates the folder tab system on the settings page.
	$('a.folder-tab').click(function(evt) {
		evt.preventDefault();
		
		var folder = $(this).data('folder');
		/*var password = '12345';
		
		//check to see if user is trying to enter restricted area.
		if(folder == 'calibration') {
			var input = prompt('This area is restricted. Please enter a valid password:');
			if(input != password) {
				alert('Sorry, that password is incorrect.');
				return false;
			}
		}*/
		
		//remove active from all tabs that have it ( should only be one )
		$('a.folder-tab').each(function() {
			if($(this).hasClass('active')) {
				$(this).removeClass('active');
			}
		});
		
		//add active to tab clicked
		$(this).addClass('active');
		
		//remove active from all folder-contents
		$('.folder-content').each(function() {
			if($(this).hasClass('active')) {
				$(this).removeClass('active');
			}
		});
		
		//add active to corresponding folder-content of clicked tab
		$('.folder-content.setup-' + folder).addClass('active');
		
	});
	
	
	//Set Energy table OEM values from inputs on settings
	$('.oem-val').change(function(){
		$('#stats-'+$(this).data('target')).html($(this).val());
	});
	
	
	
	// This will set the text of all elements with a class of refrigerant-type to the
	// selected refrigerant type from the setup page.
	$('#RfgtChoice').change(function() {
		$('.refrigerant-type').html($(this).val());
	});
	
	
	// This function will show the ranged slider min and max values before and after the
	// associated ranged slider.
	$('.setting input[type=range]').each( function() {
		$(this).parent().children('span:first').html($(this).attr('min'));
		$(this).parent().children('span:last').html($(this).attr('max'));
		$(this).parents('table').find('.rate-value').html($(this).val());
	});
	
	
	
	// Devin - You can comment out the following section when you have your function in place,
	// to set the value of the ranged slider element, or you can leave it.  All it does it set 
	// the value of its corresponding value element in this case x1 since there are no other 
	// ranged values.  But the ranged value blocks can be duplicated with the same layout and 
	// they will work just the same.  No changes needed to this function
	$('.setting input[type=range]').change( function() {
		$(this).parents('table').find('.rate-value').html($(this).val());
	});
});

//var numCircuit = "single";
	var numCircuit = "twin";

	var date = new Date();
	var options = { weekday: "long", year: "numeric", month: "long", day: "numeric",
							 		hour12: false, hour: "2-digit", minute: "2-digit", timeZoneName: "short"
								};
								
	$('#main-date-time').html(date.toLocaleTimeString("en-us", options));

(function updateTime(){
	setTimeout(function(){
		
		
		$('#main-date-time').html(date.toLocaleTimeString("en-us", options));
	}, 30000);
})();