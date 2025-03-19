<?php
ini_set("include_path", '/home/amvbeaut/php:' . ini_get("include_path"));
require_once "/home/amvbeaut/php/Mail.php";

// Încarcă datele SMTP din `phoconfig.php`
$config = include('/home/amvbeaut/phpconfig.php');

// Preia datele din formular
$name = isset($_POST['nume']) ? htmlspecialchars($_POST['nume']) : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
$phone = isset($_POST['telefon']) ? htmlspecialchars($_POST['telefon']) : '';
$subjectForm = isset($_POST['subiect']) ? htmlspecialchars($_POST['subiect']) : '';
$message = isset($_POST['mesaj']) ? htmlspecialchars($_POST['mesaj']) : '';
$recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';

//  **Verifică dacă reCAPTCHA a fost completat**
if (empty($recaptchaResponse)) {
    echo json_encode(['status' => 'error', 'message' => 'Verificare reCAPTCHA necesară.']);
    exit;
}

//  **Trimite cererea către serverul Google pentru verificare**
$recaptchaSecret = '6LcTkfkqAAAAAP7MSSWc9a4upRwusdN-TWyzi07i';
$url = 'https://www.google.com/recaptcha/api/siteverify';
$data = [
    'secret' => $recaptchaSecret,
    'response' => $recaptchaResponse
];

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => http_build_query($data)
    ]
];

$context  = stream_context_create($options);
$response = file_get_contents($url, false, $context);
$responseKeys = json_decode($response, true);

if (!$responseKeys["success"]) {
    echo json_encode(['status' => 'error', 'message' => 'Verificare reCAPTCHA eșuată. Încercați din nou.']);
    exit;
}

//  **Continuă procesarea formularului dacă reCAPTCHA este valid**
if (empty($name) || empty($phone) || empty($email) || empty($message) || empty($subjectForm)) {
    echo json_encode(['status' => 'error', 'message' => 'Toate câmpurile sunt obligatorii.']);
    exit;
}

// Setează datele emailului
$from = $config['smtp_user']; // Adresa care trimite
$to = $config['to_email']; // Adresa care primește

$subject = "Mesaj nou de la $name";
$body = "
    <html>
        <body>
            <p><strong>Subiect:</strong> $subjectForm</p>
            <p><strong>Mesajul a fost trimis de:</strong> $name ($email)</p>
            <p><strong>Telefon:</strong> $phone</p>
            <p><strong>Mesaj:</strong></p>
            <p>$message</p>
        </body>
    </html>
";

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
