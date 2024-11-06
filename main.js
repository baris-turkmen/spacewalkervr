// Immediately log when file loads
console.log('Main.js is loading...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Check if translations are available
    if (typeof translations === 'undefined') {
        console.error('translations object is not defined!');
        return;
    }
    
    // Check if we can find the language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    console.log('Found language buttons:', langButtons.length);
    
    // Language handling
    let currentLang = localStorage.getItem('language') || 'tr';
    console.log('Current language:', currentLang);
    
    function setLanguage(lang) {
        console.log('Attempting to set language to:', lang);
        
        if (!translations[lang]) {
            console.error('Translation not found for:', lang);
            return;
        }

        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-i18n]');
        console.log('Found translatable elements:', translatableElements.length);
        
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            console.log('Translating element with key:', key);
            
            const keys = key.split('.');
            let value = translations[lang];
            
            try {
                keys.forEach(k => {
                    value = value[k];
                });
                
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else {
                    element.textContent = value;
                }
                console.log('Successfully translated:', key, 'to:', value);
            } catch (error) {
                console.error('Translation failed for key:', key, error);
            }
        });

        // Update active state of language buttons
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        
        console.log('Language change completed');
    }

    // Add click handlers to language buttons
    langButtons.forEach(btn => {
        console.log('Adding click handler to button:', btn.getAttribute('data-lang'));
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = btn.getAttribute('data-lang');
            console.log('Language button clicked:', newLang);
            setLanguage(newLang);
        });
    });

    // Initialize with saved language or default
    console.log('Initializing with language:', currentLang);
    setLanguage(currentLang);

    // Add this inside your DOMContentLoaded event listener
    const navLinks = document.querySelectorAll('.nav-links a');

    // Update active state based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', updateActiveNavLink);

    // Add click handler for mobile nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}); 