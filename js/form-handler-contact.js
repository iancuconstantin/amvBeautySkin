function openPopup(message, status) {
    
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    if(status === 200){
        document.getElementById("message-text").style.color = "green";
    } else {
        document.getElementById("message-text").style.color = "red";
    }
    document.getElementById("message-text").textContent = message;
    setTimeout(closePopup, 3000);
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}


document.querySelectorAll('#contact_form input, #contact_form select').forEach(function(inputElement) {
    inputElement.addEventListener('input', function() {
        const form = document.getElementById('contact_form');
        const submitButton = form.querySelector('button[type="submit"]');

        form.classList.add('was-validated');

        // Verifică validitatea formularului
        if (form.checkValidity() === true) {
            submitButton.removeAttribute('disabled'); // Activează butonul
        } else {
            submitButton.setAttribute('disabled', 'true'); // Păstrează butonul dezactivat
        }
    });
});


document.getElementById('contact_form').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = document.getElementById('contact_form');
    form.classList.add('was-validated');
    // fetch('sendMail.php', {
    //     method: 'POST',
    //     body: formData
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.status === 'success') {
    //         openPopup(`${data.message}`, 200);
    //         form.reset();
    //     }
    // })
    // .catch(error => {
    //     openPopup(`${error.message}`, 500);
    //     form.reset();
    // });
});