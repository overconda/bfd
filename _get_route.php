<?php
header('Content-type: application/json');

$id=$_REQUEST['id'];
include("dbconnect.php");

$return = [];

$sql = "select * from route where route_id = $id";
try{
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

    

    
  foreach ($result as $row) {
    $return[0]['route_name'] = $row['route_name'];
    $return[0]['point_complete'] = $row['point_complete'];
    $return[0]['point_unlock'] = $row['point_unlock'];
    $return[0]['point_extra'] = $row['point_extra'];
        
  }
}catch (PDOException $ev) {
    $dbh=null;
  //echo json_encode('error'=> 'DB error');
}

$dbh=null;

$ret = $return[0];

echo json_encode($ret);

?>