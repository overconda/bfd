<?php

include_once('dbconnect.php');

$str = $_REQUEST['str'];
$sess = $_REQUEST['sess'];

$sql = "insert into debug (debug_text,sess) values('$str','$sess')";


$stmt = $dbh->prepare($sql);
$stmt->execute();


 ?>
