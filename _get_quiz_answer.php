<?php
header('Content-type: application/json');

$quiz_id = $_REQUEST['quiz_id'];

$sql = "select ans_id , ans_text from quiz_answer where qzid=" . $quiz_id;

include_once('dbconnect.php');
try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  $return = [];

  foreach ($result as $row) {
      $return[] = [
          'ans_id' => $row['ans_id'],
          'ans_text' => $row['ans_text']
      ];
  }
  $dbh = null;

  echo json_encode($return);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  echo json_encode($e->ret);
}
 ?>
