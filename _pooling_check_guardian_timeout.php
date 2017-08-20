<?php
include_once('dbconnect.php');

///// score for challenge correct
$sql = "select * from guardian ";
$sql .= " where isStillGuardian = 1 ";

//$return = [];

try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  $newSql = [];

  foreach ($result as $row) {
    $now = date('Y-m-d H:i:s');

    $id= $row['guardian_id'];
    $base_id = $row['base_id'];
    $gdtime = $row['guardian_time'];
    //$diff = dateDifference($udate, $now , '%d Day %h Hours %i Minute %s Seconds');
    $hour = dateDifference($gdtime, $now , '%h') +0;
    if($hour>=1){
      /// over 1 hour , set it to expire
      $afterHour = strtotime($gdtime) + 60*60;
      $newTime = date('Y-m-d H:i:s', $afterHour);
      $newSql[]['sql'] = "update guardian set isStillGuardian=0, guardian_end_time='$newTime' where guardian_id=" . $id;
    }
  }

  for($i=0 ; $i<sizeof($newSql); $i++){
    $sql = $newSql[$i]['sql'];
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
  }

  $dbh = null;
  //echo json_encode($return[0]);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  //echo json_encode($e->ret);
}

function dateDifference($date_1 , $date_2 , $differenceFormat = '%a' )
{
    $datetime1 = date_create($date_1);
    $datetime2 = date_create($date_2);

    $interval = date_diff($datetime1, $datetime2);

    return $interval->format($differenceFormat);

}
 ?>
