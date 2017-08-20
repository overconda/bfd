<?php
header('Content-type: application/json');

$quized_list = "";
if(isset($_REQUEST['quized_list'])){
    if(trim(strlen($_REQUEST['quized_list']))>0){
      $quized_list = ' where qzid not in (' . $_REQUEST['quized_list'] . ')';
    }
}



$sql = "select qzid , quiz_cate.name_eng as cate_name , quiz_cate.cate_id, qz_title from quiz ";
$sql .= " inner join quiz_cate on quiz.qz_cate_id = quiz_cate.cate_id ";
$sql .= $quized_list;
$sql .= " order by rand() limit 1";

//echo $sql; exit;

include_once('dbconnect.php');
try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  $return = [];

  foreach ($result as $row) {
      $return[] = [
          'quiz_id' => $row['qzid'],
          'cate_id' => $row['cate_id'],
          'cate_name' => $row['cate_name'],
          'title' => $row['qz_title']
      ];
  }
  $dbh = null;

  echo json_encode($return[0]);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  echo json_encode($e->ret);
}
 ?>
