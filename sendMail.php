<?php
ini_set("include_path", '/home/amvbeaut/php:' . ini_get("include_path"));
require_once "/home/amvbeaut/php/Mail.php";

// Încarcă datele SMTP din `phoconfig.php`
$config = include('/home/amvbeaut/phpconfig.php');

// Preia datele din formular
$name = isset($_POST['nume']) ? htmlspecialchars($_POST['nume']) : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
$phone = isset($_POST['telefon']) ? htmlspecialchars($_POST['telefon']) : '';
$subject = isset($_POST['subiect']) ? htmlspecialchars($_POST['subiect']) : '';
$message = isset($_POST['mesaj']) ? htmlspecialchars($_POST['mesaj']) : '';

// Verifică dacă sunt completate toate câmpurile
if (empty($name) || empty($phone) || empty($email) || empty($message)  || empty($subject)) {
  echo json_encode(['status' => 'error', 'message' => 'Toate câmpurile sunt obligatorii.']);
  exit; // Termină execuția scriptului
}

// Setează datele emailului
$from = $config['smtp_user']; // Adresa care trimite
$to = $config['to_email']; // Adresa care primește

$subject = "Mesaj nou de la $name";
$body = "Ai primit un mesaj de la $name ($email):\n\n$message";

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
  echo json_encode(['status' => 'error', 'message' => 'Eroare la trimiterea mesajului. ❌' . $mail->getMessage()]);
} else {
  echo json_encode(['status' => 'success', 'message' => 'Mesaj trimis cu succes! ✅']);
}
?>