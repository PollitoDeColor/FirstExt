const clientId = 'v3gnon73g7cupdj172jjcgi7p9orao';
const redirectUri = 'https://localhost:8080/overlay.html'; // Debe coincidir con la URL configurada en el Centro de Desarrollo de Twitch

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

  // Ahora continuamos con el resto del código...*/

  const pollito = document.getElementById('pollito');
  const usernameLabel = document.getElementById('usernameLabel'); // Cambiar el nombre de la variable para que coincida con el HTML
  const images = document.getElementsByClassName('clickable-image');

  function hideImages() {
    for (const image of images) {
      image.style.display = 'none';
    }
  }

  function showRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    const randomX = Math.random() * (window.innerWidth - randomImage.width);
    const randomY = Math.random() * (window.innerHeight - randomImage.height);
    randomImage.style.left = `${randomX}px`;
    randomImage.style.top = `${randomY}px`;
    randomImage.style.display = 'block';
  }

  document.body.addEventListener('click', (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;

    // Actualizar la posición del pollito con las coordenadas del clic
    pollito.style.left = `${clickX - pollito.width / 2}px`;
    pollito.style.top = `${clickY - pollito.height / 2}px`;

    const pollitoRect = pollito.getBoundingClientRect();
    const offsetX = 133-pollitoRect.width;
    const offsetY = 77; // Ajusta esto según sea necesario para el espaciado deseado
    
    usernameLabel.style.left = `${clickX - offsetX}px`;
    usernameLabel.style.top = `${clickY - offsetY}px`;

    // Verificar si se hizo clic en alguna imagen de los objetos
    for (const image of images) {
      const rect = image.getBoundingClientRect();
      if (
        clickX >= rect.left &&
        clickX <= rect.right &&
        clickY >= rect.top &&
        clickY <= rect.bottom
      ) {
        image.style.display = 'none'; // Desaparecer la imagen si se hizo clic en ella
      }
    }
  });

  // Función para posicionar el pollito en el mismo lugar relativo después de salir del modo de pantalla completa
  function updatePollitoPosition() {
    const rect = pollito.getBoundingClientRect();
    const offsetX = window.innerWidth / 2 - rect.left - rect.width / 2;
    const offsetY = window.innerHeight / 2 - rect.top - rect.height / 2;

    // Actualizar la posición del pollito con las coordenadas relativas al centro de la ventana
    pollito.style.left = `${pollito.offsetLeft + offsetX}px`;
    pollito.style.top = `${pollito.offsetTop + offsetY}px`;
  }

  // Escuchar el evento resize para actualizar la posición del pollito al cambiar el tamaño de la ventana
  window.addEventListener('resize', updatePollitoPosition);

  // Posicionar inicialmente el pollito en el centro de la ventana
  updatePollitoPosition();

  // Mostrar una imagen aleatoria cada 5 segundos
  setInterval(showRandomImage, 7500);
//});
