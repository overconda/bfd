<?php
include_once('dbconnect.php');


$user_id = $_REQUEST['user_id'];

///// score for challenge correct
$sql = "select sum(score) as c from user_score ";
$sql .= " where user_id = $user_id ";

$return = [];

try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  foreach ($result as $row) {
    $return[0]['score'] = $row['c'];

  }

  echo json_encode($return[0]);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  echo json_encode($e->ret);
}
 ?>
