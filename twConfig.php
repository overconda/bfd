<?php
if(!session_id()){
    session_start();
}

//Include Twitter client library
include_once 'tw-src/twitteroauth.php';

/*
 * Configuration and setup Twitter API
 */
$consumerKey = '98v3ZFxFLnOg67M1DgYletIyI';
$consumerSecret = 'xXWPqIkHyPiU9uJl4426EmKLhRYNEMF940Ld3DoYzHhrxns4H5';
$redirectURL = 'https://www.singhabeerfinder.com/twindex.php';

?>
