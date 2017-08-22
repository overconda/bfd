<?php
class TwUser {
	private $dbHost     = "localhost";
    private $dbUsername = "pophonic_beerfinder";
    private $dbPassword = "BFDdb#2017";
    private $dbName     = "pophonic_beerfinder";
    private $userTbl    = 'users_tw';

	function __construct(){
        if(!isset($this->db)){
            // Connect to the database
            $conn = new mysqli($this->dbHost, $this->dbUsername, $this->dbPassword, $this->dbName);
            if($conn->connect_error){
                die("Failed to connect with MySQL: " . $conn->connect_error);
            }else{
                $this->db = $conn;
            }
        }
    }

	function checkUser($userData = array()){
        if(!empty($userData)){
            //Check whether user data already exists in database
            $prevQuery = "SELECT * FROM ".$this->userTbl." WHERE oauth_provider = '".$userData['oauth_provider']."' AND oauth_uid = '".$userData['oauth_uid']."'";
            $prevResult = $this->db->query($prevQuery);
            if($prevResult->num_rows > 0){
                //Update user data if already exists
                $query = "UPDATE ".$this->userTbl." SET first_name = '".$userData['first_name']."', last_name = '".$userData['last_name']."', email = '".$userData['email']."', gender = '".$userData['gender']."', locale = '".$userData['locale']."', picture = '".$userData['picture']."', username = '".$userData['username']."', link = '".$userData['link']."', modified = '".date("Y-m-d H:i:s")."' WHERE oauth_provider = '".$userData['oauth_provider']."' AND oauth_uid = '".$userData['oauth_uid']."'";
                $update = $this->db->query($query);
            }else{
                //Insert user data
                $query = "INSERT INTO ".$this->userTbl." SET oauth_provider = '".$userData['oauth_provider']."', oauth_uid = '".$userData['oauth_uid']."', first_name = '".$userData['first_name']."', last_name = '".$userData['last_name']."', email = '".$userData['email']."', gender = '".$userData['gender']."', locale = '".$userData['locale']."', picture = '".$userData['picture']."', username = '".$userData['username']."', link = '".$userData['link']."', created = '".date("Y-m-d H:i:s")."', modified = '".date("Y-m-d H:i:s")."'";
                $insert = $this->db->query($query);
            }

            //Get user data from the database
            $result = $this->db->query($prevQuery);
            $userData = $result->fetch_assoc();


						//////// Check for Beerfinder User table
						$now = date('Y-m-d H:i:s');
						$prevQuery = "SELECT * FROM users where twitter_id = '" . $userData['oauth_uid'] . "' " ;
						$prevResult = $this->db->query($prevQuery);
            if($prevResult->num_rows > 0){
							/// do nothing
						}else{
							$query = "INSERT INTO users SET twitter_id='" . $userData['oauth_uid'] . "', username='" . $userData['username'] . "', avatar_twitter='" . $userData['picture'] . "', cdate='" . $now . "' ";
							$insert = $this->db->query($query);
						}
        }

        //Return user data
        return $userData;
    }
}
?>
