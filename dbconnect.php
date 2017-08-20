<?php
$dbh="";
try {
      $dbh = new PDO('mysql:host=localhost;dbname=pophonic_beerfinder', 'pophonic_beerfinder', 'BFDdb#2017');
    $dbh->query("SET NAMES 'UTF8' ");
} catch (PDOException $e) {
    print "<Br>Error!: " . $e->getMessage() . "<br/>";
    die();
}
?>