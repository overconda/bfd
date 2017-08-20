<?php
header('Content-type: application/json');


$user_id = $_REQUEST['user_id'];
$base_id = $_REQUEST['base_id'];
$quiz_id = $_REQUEST['quiz_id'];
$answer_id = $_REQUEST['answer_id'];

$sql = "select is_correct  from quiz_answer where qzid = $quiz_id and ans_id = $answer_id";



$result=0;

include_once('dbconnect.php');
try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  $r = [];

  foreach ($result as $row) {
    $r[] = $row;
    if($row['is_correct']=='1'){
      //// correct , save database

      $now = date("Y-m-d H:i:s");
      $sql = "insert into unlock_base (user_id, base_id, finish_time) values($user_id, $base_id, '$now')";

      //$result[0]['sql'] = $sql;
      $stmt = $dbh->prepare($sql);
      $stmt->execute();

      ///// score for unlock base
      $sql = "insert into user_score (user_id, score, how) ";
      $sql .= " values($user_id, 10 , 'Correct answer for unlock base $base_id ' )";
      $stmt = $dbh->prepare($sql);
      $stmt->execute();

      ///// score for unlock base
      $sql = "insert into user_score (user_id, score, how) ";
      $sql .= " values($user_id, 50 , 'Unlock Base $base_id ' )";
      $stmt = $dbh->prepare($sql);
      $stmt->execute();


      $dbh = null;
      header("Location: be-guardian.html?base_id=$base_id");
    }else{
      $dbh = null;
      header("Location: notify-wrong-answer.html?base_id=$base_id");
    }
  }



  $return = $r[0];


  $dbh = null;

  //echo json_encode($return);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  //echo json_encode($e->ret);
}



 ?>
