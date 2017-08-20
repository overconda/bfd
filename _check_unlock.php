<?php
header('Content-type: application/json');
include("dbconnect.php");
$baseid = $_REQUEST['baseid'];
$userid = $_REQUEST['userid'];

$sql = "select unlock_id from unlock_base where base_id = $baseid and user_id = $userid";

$i=0;
try{
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

    foreach ($result as $row) {
        $i=1;
    }
}catch (PDOException $ev) {
    $dbh=null;
  //echo json_encode('error'=> 'DB error');
}

$ret['is_unlock'] = $i;

$dbh = null;
echo json_encode($ret);
?>
