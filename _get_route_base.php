<?php
header('Content-type: application/json');
include("dbconnect.php");
$routeid = $_REQUEST['id'];

$sql = "select base_main.base_id , base_text.base_name, base_desc1 from base_main inner join base_text on base_main.base_id = base_text.base_id where base_main.route_id = $routeid";

$return = [];
try{
    $stmt = $dbh->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

    
    $i=0;
    
    foreach ($result as $row) {
        $return[$i]['base_id'] = $row['base_id'];
        $return[$i]['base_name'] = $row['base_name'];
        $return[$i]['base_desc1'] = $row['base_desc1'];
        $i++;
    }
}catch (PDOException $ev) {
    $dbh=null;
  //echo json_encode('error'=> 'DB error');
}

$dbh = null;
echo json_encode($return);
?>