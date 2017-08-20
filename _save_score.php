<?php
header('Content-type: application/json');

$user_id = $_REQUEST['user_id'];
$base_id = $_REQUEST['base_id'];
$myScore = $_REQUEST['myscore'];

///// get current high score for this base
$sql = "select guardian_id,guardian.score ";
$sql .= " from guardian ";
$sql .= " where guardian.base_id = $base_id ";
$sql .= " and isStillGuardian = 1";
$sql .= " order by guardian.guardian_time desc";
$sql .= " limit 1";

include_once('dbconnect.php');

$highScore = 0;

try{

  ///// debug
  $sqlDebug = "insert into debug (debug_text) values('check score on base = $base_id ') ";
  $stmt = $dbh->prepare($sqlDebug);
  $stmt->execute();


  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );



  $old=[];
  foreach ($result as $row) {
    $highScore = $row['score'];
    $old[]['id'] = $row['id'];
  }

  ///// debug
  $sqlDebug = "insert into debug (debug_text) values('got guardian id = " . $old[0]['id'] . " / score = $highScore  (myscore= $myScore )') ";
  $stmt = $dbh->prepare($sqlDebug);
  $stmt->execute();

  if($myScore > $highScore){

    ///// debug
    $sqlDebug = "insert into debug (debug_text) values('my score more than old , new guardian coming') ";
    $stmt = $dbh->prepare($sqlDebug);
    $stmt->execute();

    ///// end old guardian
    for($i=0; $i<sizeof($old); $i++){
      $now = date('Y-m-d H:i:s');
      $id = $old[$i]['id'];
      $sql = "update guardian set isStillGuardian=0 , guardian_end_time='$now' where guardian_id=$id";
      $stmt = $dbh->prepare($sql);
      $stmt->execute();
    }

    $now = date('Y-m-d H:i:s');

    //// set other guardian to 0 for this base
    $sql = "update guardian set guardian_end_time = '$now', isStillGuardian=0 where base_id = $base_id and isStillGuardian=1 ";
    $stmt = $dbh->prepare($sql);
    $stmt->execute();


    $sql = "insert into guardian (base_id, user_id, score,isStillGuardian, guardian_time) ";
    $sql .= " values ('$base_id', '$user_id', $myScore , 1, '$now')";

    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    echo json_encode('done');
  }else{
    ///// debug
    $sqlDebug = "insert into debug (debug_text) values('guardign not change') ";
    $stmt = $dbh->prepare($sqlDebug);
    $stmt->execute();
  }


}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  echo json_encode($e->ret);
}



 ?>
