import { Router } from './utils/Router.js';
import { HeaderComponent } from './components/HeaderComponent.js';
import { RegistrationComponent } from './components/RegistrationComponent.js';
import { LoginComponent } from './components/LoginComponent.js';
import { FooterComponent } from './components/FooterComponent.js';
import { ProfileComponent } from './components/ProfileComponent.js';

export const router = new Router();
router.addRoute('/', LoginComponent);
router.addRoute('/register', RegistrationComponent);
router.addRoute('/login', LoginComponent);
router.addRoute('/profile', ProfileComponent);

const headerElement = document.getElementById('header');
const headerComponent = new HeaderComponent();
headerComponent.mount(headerElement);

const footerElement = document.getElementById('footer');
const footerComponent = new FooterComponent();
footerComponent.mount(footerElement);

router.handleRoute();

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
}


