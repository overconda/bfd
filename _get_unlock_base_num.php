<?php

include_once('dbconnect.php');

$user_id = $_REQUEST['user_id'];



$sql = " SELECT DISTINCT base_id FROM unlock_base where user_id=" . $user_id;


$return = [];
$count=0;
try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  foreach ($result as $row) {
    $count++;
  }

  $return[0]['count'] = $count;

  echo json_encode($return[0]);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  echo json_encode($e->ret);

}
 ?>
