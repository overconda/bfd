<?php
header('Content-type: application/json');

$baseid = $_REQUEST['baseid']+0;
$base_id = $_REQUEST['base_id']+0;

if($base_id==0) $base_id=$baseid;



$sql = "select guardian.score, users.user_id, users.username, users.avatar_facebook ";
$sql .= " from guardian ";
$sql .= " inner join users on guardian.user_id = users.user_id ";
$sql .= " where guardian.base_id = $base_id ";
$sql .= " and isStillGuardian = 1";
$sql .= " order by guardian.guardian_time desc";
$sql .= " limit 1";

include_once('dbconnect.php');
try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  $return = [];

  foreach ($result as $row) {
      $return[] = [
          'user_id' => $row['user_id'],
          'username' => $row['username'],
          'avatar' => $row['avatar_facebook'],
          'score' => $row['score']
      ];
  }
  $dbh = null;


  echo json_encode($return[0]);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  echo json_encode($e->ret);
}
 ?>
