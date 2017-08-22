<?php
header('Content-Type: application/json');

//start session
session_start();

//Include Twitter config file && User class
//include_once 'twConfig.php';
//include_once 'TwUser.php';

$ret = array('auth'=>'no');

//If OAuth token not matched
if(isset($_REQUEST['oauth_token']) && $_SESSION['token'] !== $_REQUEST['oauth_token']){
	//Remove token from session
	unset($_SESSION['token']);
	unset($_SESSION['token_secret']);
	$ret['auth'] = 'fail';
}

//If user already verified
if(isset($_SESSION['status']) && $_SESSION['status'] == 'verified' && !empty($_SESSION['request_vars'])){
	//Retrive variables from session
	$username 		  = $_SESSION['request_vars']['screen_name'];
	$twitterId		  = $_SESSION['request_vars']['user_id'];
	$oauthToken 	  = $_SESSION['request_vars']['oauth_token'];
	$oauthTokenSecret = $_SESSION['request_vars']['oauth_token_secret'];
	$profilePicture	  = $_SESSION['userData']['picture'];
	$ret['auth'] = 'ok';
}

echo json_encode($ret);
?>
