<?php
include("dbconnect.php");


$whichSocial = $_REQUEST['whichSocial'];
$fbId = $_REQUEST['fbId'];
$fbName = $_REQUEST['fbName'];
$fbAvatar = $_REQUEST['fbAvatar'];

$sql = "";

if($whichSocial=='facebook'){
    $sql = "select user_id from users where facebook_id='$fbId' ";  
}else{
    $sql = "select 1";
    exit;
}

$user_id = 0;
try{
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll( PDO::FETCH_ASSOC );
    
    foreach ($result as $row) {
        $user_id = $row['user_id'];
    }
}catch (PDOException $ev) {
    $dbh=null;
  //echo json_encode('error'=> 'DB error');
}

$now = date('Y-m-d H:i:s');

$sql = "insert into profile_viewed (user_id, fbId, fbName, cdate) values ('$user_id', '$fbId', '$fbName' , '$now' )";
try{
    $stmt = $dbh->prepare($sql);
    $stmt->execute();

}catch (PDOException $ev) {
    $dbh=null;
  //echo json_encode('error'=> 'DB error');
}

?>