<?php
if (is_ajax()) {
	$text = $_POST["text"];
	$contacts = $_POST["contacts"];
	if ((isset($text) && !empty($text)) && (isset($contacts) && isset($contacts[0]) && !empty($contacts[0]))) { //check input params
		call_curl();
	}
}

//check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function call_curl(){
	$params = $_POST;
	
	$vs_url = "https://api.sendhub.com/v1/messages/?username=put_your_username_here&api_key=put_your_api_key_here";
	$o_ch = curl_init();
	$msg = stripslashes(rawurldecode($text));
	$msg = trim(preg_replace("!\n+!","\\"."n", $msg));
	curl_setopt($o_ch, CURLOPT_URL, $vs_url);
	curl_setopt($o_ch, CURLOPT_HEADER, false);
	curl_setopt($o_ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));	
	curl_setopt($o_ch, CURLOPT_POSTFIELDS, json_encode($params)); // $param = '{"contacts" : ["+put_cell_phone_number_here"],"text" : "Testing"}'
	curl_setopt($o_ch, CURLOPT_RETURNTRANSFER, 1);
	$vs_return = curl_exec($o_ch);
	curl_close($o_ch); 
	$va_return = json_decode($vs_return);
	
	$log_time = new DateTime($va_return->{'sent'});
	echo $log_time->format('Y-m-d H:i:s');
}
?>