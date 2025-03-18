function openPopup(message, status) {
  
  document.getElementById("popupNewsLetter").style.display = "block";
  document.getElementById("overlayNewsLetter").style.display = "block";
  if(status === 200){
    document.getElementById("messageNewsletter").style.color = "green";
  } else {
    document.getElementById("messageNewsletter").style.color = "red";
  }
  document.getElementById("messageNewsletter").textContent = message;
  setTimeout(closePopup, 3000);
}

function closePopup() {
  document.getElementById("popupNewsLetter").style.display = "none";
  document.getElementById("overlayNewsLetter").style.display = "none";
}


document.getElementById('newsletter-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(this); 
  
  fetch('sendNewsletter.php', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          openPopup(`${data.message}`, 200);
          form.reset();
      }
  })
  .catch(error => {
      openPopup(`${error.message}`, 500);
      form.reset();
  });
});