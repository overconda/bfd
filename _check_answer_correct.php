<?php
header('Content-type: application/json');

$quiz_id = $_REQUEST['quiz_id'];
$answer_id = $_REQUEST['answer_id'];

$sql = "select is_correct  from quiz_answer where qzid = $quiz_id and ans_id = $answer_id";



$result=0;

include_once('dbconnect.php');
try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  $return = [];

  foreach ($result as $row) {
    if($row['is_correct']=='1'){
      $return[] = ['correct' => '1'];
    }else{
      $return[] = ['correct' => '0'];
    }

    $dbh = null;

    echo json_encode($return[0]);
  }

  //echo json_encode($return);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  //echo json_encode($e->ret);
}



 ?>
