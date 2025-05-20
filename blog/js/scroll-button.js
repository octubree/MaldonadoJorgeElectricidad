(function() {
  // Crear el botón dinámicamente
  function createScrollButton() {
    // Eliminar botón existente si hay alguno
    var existingButton = document.getElementById('dynamic-scroll-to-top');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Crear el nuevo botón
    var button = document.createElement('button');
    button.id = 'dynamic-scroll-to-top';
    button.title = 'Volver arriba';
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    
    // Aplicar estilos directamente al elemento
    button.style.position = 'fixed';
    button.style.bottom = (window.innerWidth <= 768 ) ? '70px' : '30px';
    button.style.right = (window.innerWidth <= 768) ? '20px' : '30px';
    button.style.width = (window.innerWidth <= 768) ? '50px' : '56px';
    button.style.height = (window.innerWidth <= 768) ? '50px' : '56px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#2c3e50';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.zIndex = '99999';
    button.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    button.style.display = 'none';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    
    // Añadir al body
    document.body.appendChild(button);
    
    // Añadir evento de clic
    button.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Mostrar/ocultar según scroll
    function toggleButtonVisibility() {
      if (window.pageYOffset > 300) {
        button.style.display = 'flex';
      } else {
        button.style.display = 'none';
      }
    }
    
    // Comprobar inicialmente
    toggleButtonVisibility();
    
    // Añadir evento de scroll
    window.addEventListener('scroll', toggleButtonVisibility);
  }
  
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createScrollButton);
  } else {
    createScrollButton();
  }
  
  // Ejecutar también cuando la página esté completamente cargada
  window.addEventListener('load', createScrollButton);
  
  // Y una vez más después de un tiempo para asegurar
  setTimeout(createScrollButton, 2000);
  
  // Volver a crear el botón si cambia el tamaño de la ventana
  window.addEventListener('resize', createScrollButton);
})();
