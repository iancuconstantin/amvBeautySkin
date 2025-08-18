const CLIENT_ID = '178872531052-0m8qc9ru2jf33el9tpaf2g54b789oiej.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBXadJIiwbZZtobzh42D-umDK3XScHM8ZE';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const calendarId = 'd1fa751e242a84ed93ddc2857e6bfb9b5e8bc3b0688a64012bb6c73b456f0949@group.calendar.google.com';
let accessToken;
const redirectUri = 'https://www.amv-beautyskin.ro/notificari';
const mapLinkGoogle = 'bit.ly/4cwW1oC';
const mapLinkWaze = 'bit.ly/4cFAKcs';


async function authenticate() {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SCOPES}&response_type=token`;
  window.location.href = authUrl;
}

function handleAuthResponse() {
  const hash = window.location.hash.substr(1);
  const params = new URLSearchParams(hash);
  accessToken = params.get('access_token');
  
  if (accessToken) {
    console.log("✅ Autentificare reușită!");
    getAppointments(calendarId);
  } else {
    console.log("⚠️ Autentificare eșuată!");
  }
}

function extractPhoneNumber(description) {
  const regex = /:\s*([+O0o\d\s]{8,})/i;
  const match = description?.match(regex);
  if (!match) return null;
  
  const cleanedNumber = match[1]
    .replace(/[Oo]/g, '0')
    .replace(/\s+/g, '');

  return cleanedNumber;
}  


async function getAppointments(calendarId = 'primary') {
  if (!accessToken) {
    console.log("⚠️ Nu sunt autentificat!");
    return;
  }

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
  
    const startOfDay = new Date(tomorrow);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(tomorrow);
    endOfDay.setHours(23, 59, 59, 999);

    const timeMin = startOfDay.toISOString();
    const timeMax = endOfDay.toISOString();

    const container = document.getElementById('appointments-container');

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Google API error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const appointments = data.items
          .filter(event => event.description)
          .map(event => ({
            title: event.summary,
            date: event.start.dateTime || event.start.date,
            phone: extractPhoneNumber(event.description),
        }));
  
      const row = document.createElement("div");
      row.className = "row";
      container.innerHTML = '';
      
      appointments.forEach(event => {
          const card = document.createElement('div');
          card.classList.add('appointment-card');
  
          const col = document.createElement("div");
          col.className = "col-lg-4 col-md-6 col-sm-12 col-xs-12";
          
          
          const phoneNumber = event.phone;
          let message = `🔔 Reminder 🔔\nProgramare AMV Beauty Skin\nMâine, ${new Date(event.date).toLocaleString()}.\nVă așteptăm cu drag!\n 📍Maps: ${mapLinkGoogle}\n 📍Waze: ${mapLinkWaze}`;
          const urlApiWhats = `https://api.whatsapp.com/send/?phone=4${phoneNumber}&text=${encodeURIComponent(message)}`;
          card.innerHTML = `
              <h3>${event.title}</h3>
              <p><strong>Data:</strong> ${new Date(event.date).toLocaleString()}</p>
              <p><strong>Telefon:</strong> ${phoneNumber}</p>
              <a href="${urlApiWhats}" target="_blank">
              <button class="whatsapp-button">Trimite reminder</button>
              </a>
          `;
          col.appendChild(card);
          row.appendChild(col);
      });
        container.appendChild(row);
      } else {
        container.innerHTML = 'Nu sunt evenimente pentru ziua de mâine.';
      }
    } catch (error) {
      console.error("Failed to fetch calendar events:", error.message);
    }
}

if (window.location.hash) {
  handleAuthResponse();
} else {
  authenticate();
}

module.exports = { authenticate, handleAuthResponse, extractPhoneNumber, getAppointments };