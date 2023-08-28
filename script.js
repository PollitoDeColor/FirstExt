const clientId = 'v3gnon73g7cupdj172jjcgi7p9orao';
const redirectUri = 'https://pollitodecolor.github.io/FirstExt/overlay.html'; // Debe coincidir con la URL configurada en el Centro de Desarrollo de Twitch

const authButton = document.getElementById('authButton');
const userInfo = document.getElementById('userInfo');
const usernameSpan = document.getElementById('username');

authButton.addEventListener('click', async () => {
  if (!localStorage.getItem('access_token')) {
    // Iniciar el flujo de autenticación de Twitch
    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;
  } else {
    // Aquí puedes realizar acciones que requieren autenticación
    // Por ejemplo, obtener información del usuario desde la API de Twitch
    const accessToken = localStorage.getItem('access_token');
    fetchUserInfo(accessToken); // Llamar a la función para obtener información del usuario
  }
});

async function fetchUserInfo(accessToken) {
  try {
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const username = data.data[0].login; // Obtener el nombre de usuario
      const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1); // Capitaliza la primera letra
      usernameSpan.textContent = capitalizedUsername;
      userInfo.style.display = 'block';

      // Actualizar el atributo alt de la imagen del pollito con el nombre de usuario
      const pollitoImage = document.getElementById('pollito');
      pollitoImage.alt = username;
    } else {
      console.error('Error al obtener información del usuario');
    }
  } catch (error) {
    console.error('Error en la solicitud de API:', error);
  }
}


// Verificar si ya tenemos un token de acceso almacenado
const urlFragment = window.location.hash.substring(1);
const urlParams = new URLSearchParams(urlFragment);
const accessToken = urlParams.get('access_token');

if (accessToken) {
  // Limpia el fragmento de URL para que no se muestre en la barra de direcciones
  window.history.replaceState({}, document.title, window.location.pathname);

  // Almacena el token de acceso en el almacenamiento local
  localStorage.setItem('access_token', accessToken);

  // Mostrar la información del usuario
  fetchUserInfo(accessToken); // Llamar a la función para obtener información del usuario
}
