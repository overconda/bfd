<?php
header('Content-Type: application/json');

//start session
session_start();

//Include Twitter config file && User class
include_once 'twConfig.php';
include_once 'TwUser.php';

//If user already verified
if(isset($_SESSION['status']) && $_SESSION['status'] == 'verified' && !empty($_SESSION['request_vars'])){
	//Full Success Login Status

}elseif(isset($_REQUEST['oauth_token']) && $_SESSION['token'] == $_REQUEST['oauth_token']){
	//Have session

}else{
	//Fresh authentication
	$twClient = new TwitterOAuth($consumerKey, $consumerSecret);
	$request_token = $twClient->getRequestToken($redirectURL);

	//Received token info from twitter
	$_SESSION['token']		 = $request_token['oauth_token'];
	$_SESSION['token_secret']= $request_token['oauth_token_secret'];

	//If authentication returns success
	if($twClient->http_code == '200'){
		//Get twitter oauth url
		$authUrl = $twClient->getAuthorizeURL($request_token['oauth_token']);

		//Display twitter login button
			//$output = '<a href="'.filter_var($authUrl, FILTER_SANITIZE_URL).'"><img src="tw-images/sign-in-with-twitter.png" width="151" height="24" border="0" /></a>';
			$output = filter_var($authUrl, FILTER_SANITIZE_URL);
			$return = array(
				'url' => $output
			);
			echo json_encode($return);
	}/*else{
		$output = '<h3 style="color:red">Error connecting to twitter! try again later!</h3>';
	}*/
}
?>
