<?php
header('Content-type: application/json');

$sql = "select base_main.base_id , radius, lat, lon, base_text.base_name , route_text.route_name from base_main ";
$sql .= " inner join base_text on base_main.base_id = base_text.base_id ";
$sql .= " inner join route on route.route_id = base_main.route_id ";
$sql .= " inner join route_text on route_text.route_id = route.route_id";
$sql .= " where base_main.active =1 ";


include_once('dbconnect.php');
try{
  $stmt = $dbh->prepare($sql);
  $stmt->execute();
  $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

  $return = [];

  foreach ($result as $row) {
      $return[] = [
          'base_id' => $row['base_id'],
          'radius' => $row['radius'],
          'lat' => $row['lat'],
          'lng' => $row['lon'],
          'base_name' => $row['base_name'],
          'route_name' => $row['route_name']
      ];
  }

  //$return[] = ['sql'=>$sql];
  $dbh = null;

  echo json_encode($return);

}catch (PDOException $ev) {
  $e->ret = $ev->getMessage;
  echo json_encode($e->ret);
}



?>
