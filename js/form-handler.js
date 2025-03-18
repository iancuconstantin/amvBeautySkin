function openPopupNewsletter(message, status) {
  console.log("verificare getElement: ", document.getElementById("popupNewsletter"));
  document.getElementById("popupNewsletter").style.display = "block";
  document.getElementById("overlayNewsletter").style.display = "block";
  if(status === 200){
    document.getElementById("messageNewsletter").style.color = "green";
  } else {
    document.getElementById("messageNewsletter").style.color = "red";
  }
  document.getElementById("messageNewsletter").textContent = message;
  setTimeout(closePopupNewsletter, 3000);
}

function closePopupNewsletter() {
  document.getElementById("popupNewsletter").style.display = "none";
  document.getElementById("overlayNewsletter").style.display = "none";
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
          openPopupNewsletter(`${data.message}`, 200);
          form.reset();
      }
  })
  .catch(error => {
      openPopupNewsletter(`${error.message}`, 500);
      form.reset();
  });
});