<?php
header('Content-type: application/json');


$user_id = $_REQUEST['user_id'];
$base_id = $_REQUEST['base_id'];
$myScore = $_REQUEST['myscore'];

///// get current high score for this base
$sql = "select guardian.score ";
$sql .= " from guardian ";
$sql .= " where guardian.base_id = $base_id ";
$sql .= " and isStillGuardian = 1";
$sql .= " order by guardian.udate desc";
$sql .= " limit 1";

include_once('dbconnect.php');

$highScore = 0;

try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  foreach ($result as $row) {
    $highScore = $row['score'];
  }


  if($myScore > $highScore){
    $now = date('Y-m-d H:i:s');
    $sql = "insert into guardian (base_id, user_id, score,isStillGuardian, guardian_time) ";
    $sql .= " values ('$base_id', '$user_id', $myScore , 1, '$now')";

    $stmt = $dbh->prepare($sql);
    $stmt->execute();
  }


}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  //echo json_encode($e->ret);
}



 ?>
