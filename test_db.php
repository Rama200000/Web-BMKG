<?php
$response = file_get_contents("http://localhost:8000/api/detail_skor.php?student_id=4");
echo $response;
