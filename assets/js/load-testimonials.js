document.addEventListener('DOMContentLoaded', () => {
  const testimonialsContainer = document.getElementById('testimonials-container');

  if (testimonialsContainer) {
    fetch('assets/js/testimonials.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        let content = '';
        data.forEach(testimonial => {
          const stars = '&#9733;'.repeat(testimonial.rating);
          content += `
            <div class="col-lg-6">
              <h3 class="resume-title">${testimonial.name}</h3>
              <div class="resume-item pb-0">
                <div style="display: flex; align-items: center;">
                  <span class="icon" style="background-image: url('${testimonial.imageUrl}'); width: 50px; height: 50px; border-radius: 50%; margin-right: 20px;"></span>
                  <h4 style="margin-bottom: 0;">
                    <span style="font-size: 30px; color: #f7d02c;">${stars}</span>
                  </h4>
                </div>
                <p><em>${testimonial.text}</em></p>
                <p>
                  <ul>
                    <li>Opiniòn En Google Negocio <a href="${testimonial.googleReviewLink}" style="color:yellow; font-weight: bold;">(ver)</a></li>
                  </ul>
                </p>
              </div>
            </div>
          `;
        });
        testimonialsContainer.innerHTML = content;
      })
      .catch(e => {
        console.error('Error fetching or parsing testimonials data:', e);
        testimonialsContainer.innerHTML = '<p>Error al cargar las opiniones de clientes.</p>';
      });
  }
});