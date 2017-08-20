<?php
session_start();
//echo $_POST["hdnFbID"]."<br>";
//echo $_POST["hdnName"]."<br>";
//echo $_POST["hdnEmail"]."<br>";

	$objConnect = mysql_connect("localhost","pophonic_beerfinder","BFDdb#2017") or die(mysql_error());
	$objDB = mysql_select_db("pophonic_beerfinder");
	mysql_query("SET NAMES UTF8");


	// Check Exists ID
	$strSQL = "SELECT * FROM user_facebook WHERE fb_id = '".$_POST["fbid"]."' ";
	$objQuery = mysql_query($strSQL);
	$objResult = mysql_fetch_array($objQuery);
	if($objResult)
	{
		$_SESSION["strFacebookID"] = $objResult["fb_id"];
		header("location:page1.php");
		exit();
	}
	else
	{
		// Create New ID

			$strPicture = "https://graph.facebook.com/".$_POST["fbid"]."/picture?type=large";
			//$strLink = "https://www.facebook.com/app_scoped_user_id/".$_POST["fbid"]."/";

			$now=trim(date('Y-m-d H:i:s'));

			$strSQL ="  INSERT INTO  user_facebook (fb_id	,name,email,avatar,cdate)
				VALUES
				('".trim($_POST["fbid"])."',
				'".trim($_POST["fbname"])."',
				'".trim($_POST["fbemail"])."',
				'".trim($strPicture)."',
				'".$now."')";
			$objQuery  = mysql_query($strSQL);

			$_SESSION["strFacebookID"] = $_POST["fbid"];
			header("location:page1.php");
			exit();
	}

	mysql_close();
?>
