//var list = {"contacts":[]};
var contactElem = '<li class="media" data-fullname="[contact-name]" data-phonenumber="[contact-phone]"><div class="media-body"><div class="media"><img class="pull-left media-object img-circle" style="max-height:40px;" src="assets/img/head.png" /><div class="media-body"><h5>[contact-name]</h5></div></div></div></li>';
var logElem = '<li class="media"><div class="media-body"><div class="media"><div class="media-body">[log-record]</div></div></div></li>';

$(document).ready( function() {	

	Date.prototype.today = function () { 
		return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/" + ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+ this.getFullYear();
	}
	Date.prototype.timeNow = function () {
		 return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
	}
	
	$('#togglingForm')
        .bootstrapValidator({
                fields: {
					fullName: {
						validators: {
							notEmpty: {
								message: 'Name is required'
							},
							stringLength: {
								max: 50,
								message: 'Max site of name is 50'
							}
						}
					},
					mobilePhone: {
						validators: {
							notEmpty: {
								message: 'Phone number is required'
							},
							phone: {
								country: 'US',
								message: 'Phone number must be a 10 digit number.'
							}
						}
					}
            },
			submitHandler: function(validator, form, submitButton) {
				var ctname = $('#ct-name').val();
				var ctphone = $('#ct-phone').val();
		
				var newContact = new Person(ctname, ctphone);
				
				//add new contact to list of contacts for later use
				//list.contacts.push(newContact);			
			
				$('#contact-list').append(contactElem.split('[contact-name]').join(ctname).split('[contact-phone]').join(ctphone));

				$('#ct-name').val('');
				$('#ct-phone').val('');
			}
        });
    
	$('#send').click(function() {		
		
		var ctname = $('#ct-name').val();
		var ctphone = $('#ct-phone').val();
		var msg = $('#msgcontent').val();
	
		if (ctname !== '' && ctphone !== '' && msg !== '') {
			sendMessage(writeLog, ctphone, msg);
		} 
	});
	
	$( "#contact-list" ).on( "click", "li", function( event ) {
		event.preventDefault();
		
		$('#ct-name').val(this.dataset.fullname);
		$('#ct-phone').val(this.dataset.phonenumber);
	});
} );

function Person(fName, pNumber) {
    this.fullName = fName;
    this.phoneNumber = pNumber; 
}

function writeLog(log) {
	if (log) {
		var datetime = 'Message sent at ' + new Date().today() + '  ' + new Date().timeNow();		
		$('#log-list').append(logElem.split('[log-record]').join(datetime));			
		$('#msgcontent').val('');		
	
		//Need to covert return log time to local time		
		console.log('Message sent at ' + log);
	}
}

function sendMessage(callBack, phone, text) {
	var _phone = '+1' + phone;
	 var data = {
	   "contacts": [ _phone ],
	   "text": text
	 };
	 data = $.param(data);
	 $.ajax({
		 type: "POST",
		 //dataType: "json",
		 url: "process_data.php", 
		 data: data,
		 success: function(rs) {
			 writeLog(rs);
		 }
	 });
}


