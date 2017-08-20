<?php
header('Content-type: application/json');

$langid = 1;

$id = $_REQUEST['id'];  //// base id 
$uid = $_REQUEST['uid'];
if(isset($_REQUEST['langid'])){
    $langid=$_REQUEST['langid'];
}

include("dbconnect.php");

$return = [];

$sql = "select * from base_text where base_id = $id";
try{
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

    

    
  foreach ($result as $row) {
    $return[0]['name'] = $row['base_name'];
    $return[0]['desc1'] = $row['base_desc1'];
    $return[0]['desc2'] = $row['base_desc2'];
        
  }
}catch (PDOException $ev) {
  echo json_encode('error'=>$ev->getMessage);
}


///// Check Base with UNLOCKED or NOT
$sql = "select * from unlock_base where base_id = $id and user_id=$uid";
try{
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

    $unlocked = 0;
    
    
    foreach ($result as $row) {
    $unlocked = 1;    
    }
    
    $return[0]['unlocked'] = $unlocked;
    
}catch (PDOException $ev) {
  echo json_encode('error'=>$ev->getMessage);
}
?>