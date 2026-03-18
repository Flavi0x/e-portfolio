document.addEventListener('DOMContentLoaded', () => {
    
    // --- Logique pour la modal d'aperçu du CV ---
    const thumbnailLink = document.querySelector('.cv-thumbnail-link');
    const imageOverlay = document.getElementById('imageOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const closeBtn = document.querySelector('#imageOverlay .close-btn');

    if (thumbnailLink && imageOverlay && fullscreenImage && closeBtn) {
        thumbnailLink.addEventListener('click', (event) => {
            event.preventDefault();
            const imageSrc = thumbnailLink.querySelector('img').src;
            fullscreenImage.src = imageSrc;
            imageOverlay.style.display = 'flex';
        });

        const closeModal = () => {
            imageOverlay.style.display = 'none';
        };

        closeBtn.addEventListener('click', closeModal);
        imageOverlay.addEventListener('click', (event) => {
            if (event.target === imageOverlay) closeModal();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeModal();
        });
    }

    // --- Logique pour les animations au défilement ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- NOUVELLE LOGIQUE : Envoi du formulaire de contact via JS ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const form = event.target;
            const data = new FormData(form);
            const statusDiv = document.getElementById('form-status');
            
            // URL Formspree encodée pour la dissimuler.
            const encodedUrl = 'aHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi9tcWFkcnBidw==';
            const formAction = atob(encodedUrl);

            statusDiv.innerHTML = 'Envoi en cours...';
            statusDiv.style.color = 'var(--color-secondary-medium)';

            fetch(formAction, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    statusDiv.innerHTML = "Merci ! Votre message a bien été envoyé.";
                    statusDiv.style.color = '#198754';
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            statusDiv.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            statusDiv.innerHTML = "Oups ! Une erreur s'est produite.";
                        }
                        statusDiv.style.color = '#dc3545';
                    })
                }
            }).catch(error => {
                statusDiv.innerHTML = "Oups ! Une erreur réseau s'est produite.";
                statusDiv.style.color = '#dc3545';
            });
        });
    }
});