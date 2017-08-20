<?php
$fbId = $_REQUEST['fbId'];
$fbName = $_REQUEST['fbName'];
$fbAvatar = $_REQUEST['fbAvatar'];

include("dbconnect.php");
$sql = "select count(*) as cc from users where facebook_id = '$fbId' ";

$Found = false;

try{
	$stmt = $dbh->prepare($sql);
	$stmt->execute();
	$result = $stmt->fetchAll( PDO::FETCH_ASSOC );

	foreach ($result as $row) {
		if($row['cc']>0){
			$Found =  true;
		}	
	}
}catch (PDOException $ev) {
	$dbh=null;
	//echo json_encode('error'=> 'DB error');
}

if(!$Found){
	$now = date("Y-m-d H:i:s");
	$sql = "insert into users (facebook_id, username, avatar_facebook , cdate, udate) values('$fbId', '$fbName' , '$fbAvatar' ,'$now','$now') ";
	echo $sql;
	$stmt = $dbh->prepare($sql);
	$stmt->execute();
}


$userid=0;
$sql = "select user_id from users where facebook_id = '$fbId' ";
try{
	$stmt = $dbh->prepare($sql);
	$stmt->execute();
	$result = $stmt->fetchAll( PDO::FETCH_ASSOC );

	foreach ($result as $row) {
		$userid=$row['user_id'];	
	}
	
}catch (PDOException $ev) {
	$dbh=null;
}

echo $userid;

$dbh=null;

?>