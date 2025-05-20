// Botón para volver arriba
document.addEventListener('DOMContentLoaded', function() {
  // Crear el botón
  var scrollButton = document.createElement('button');
  scrollButton.innerHTML = '↑';
  scrollButton.id = 'scroll-to-top';
  scrollButton.title = 'Volver arriba';
  
  // Estilos del botón
  scrollButton.style.position = 'fixed';
  scrollButton.style.bottom = '20px';
  scrollButton.style.right = '20px';
  scrollButton.style.width = '50px';
  scrollButton.style.height = '50px';
  scrollButton.style.borderRadius = '50%';
  scrollButton.style.backgroundColor = '#333';
  scrollButton.style.color = '#fff';
  scrollButton.style.border = 'none';
  scrollButton.style.fontSize = '20px';
  scrollButton.style.cursor = 'pointer';
  scrollButton.style.display = 'none';
  scrollButton.style.zIndex = '1000';
  scrollButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  
  // Añadir el botón al final del body
  document.body.appendChild(scrollButton);
  
  // Mostrar/ocultar el botón según la posición de scroll
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollButton.style.display = 'block';
    } else {
      scrollButton.style.display = 'none';
    }
  });
  
  // Acción de scroll al hacer clic
  scrollButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
