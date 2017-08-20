<?php

include("dbconnect.php");
$baseid = $_REQUEST['base_id'];
$userid = $_REQUEST['userid'];

$sql = "select unlock_id from unlock_base where base_id = $baseid and user_id = $userid";
//echo $sql; die();
$i=0;
try{
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

    foreach ($result as $row) {
        /// unlocked
        $i=1;
        header("Location: unlocked.html?base_id=$baseid");
        //exit;
    }
    header("Location: unlock.html?base_id=$baseid");
}catch (PDOException $ev) {
    $dbh=null;
  //echo json_encode('error'=> 'DB error');
}


 ?>
