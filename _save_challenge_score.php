<?php


include_once('dbconnect.php');


$user_id = $_REQUEST['user_id'];

///// score for challenge correct
$sql = "insert into user_score (user_id, score, how) ";
$sql .= " values($user_id, 10 , 'Correct answer while challenge' )";
try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();

  $dbh=null;

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  echo json_encode($e->ret);
}
 ?>
