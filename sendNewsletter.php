<?php
ini_set("include_path", '/home/amvbeaut/php:' . ini_get("include_path"));
require_once "/home/amvbeaut/php/Mail.php";

// Încarcă datele SMTP din `phoconfig.php`
$config = include('/home/amvbeaut/phpconfig.php');

// Preia emailul din formular
$email = isset($_POST['newsletter']) ? htmlspecialchars($_POST['newsletter']) : '';

// Verifică dacă câmpul email este completat
if (empty($email)) {
  echo json_encode(['status' => 'error', 'message' => 'Este necesar să completezi câmpul cu email.']);
  exit; // Termină execuția scriptului
}

// Setează datele emailului
$from = $config['smtp_user']; // Adresa care trimite
$to = $config['to_email']; // Adresa care primește

$subject = "Nouă abonare la newsletter";
$body = "<html>
        <body>
            <p><strong>Subiect:</strong>Abonare noua la newsletter!</p>
            <p><strong>Adresa abonat: </strong>$email</p>
        </body>
    </html>";

$headers = array(
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/html; charset=UTF-8',
    'From' => $from,
    'Reply-To' => $email,
    'To' => $to,
    'Subject' => $subject
);

$smtp = Mail::factory('smtp', array(
    'host' => $config['host'],
    'auth' => true,
    'username' => $config['smtp_user'],
    'password' => $config['smtp_pass']
));

// Trimite emailul
$mail = $smtp->send($to, $headers, $body);

// Răspuns JSON în funcție de succesul trimiterii emailului
if (PEAR::isError($mail)) {
  echo json_encode(['status' => 'error', 'message' => 'Eroare la trimitere. Încearcă din nou. ❌' . $mail->getMessage()]);
} else {
  echo json_encode(['status' => 'success', 'message' => 'Te-ai abonat cu succes la newsletter! ✅']);
}
?>
