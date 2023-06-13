// import '@babel/polyfill';
import { initLoginPage, logout } from './login';

initHeader();
initLoginPage();

function initHeader() {
  const oLogoutBtn = document.querySelector('.nav__el--logout');

  if (oLogoutBtn) {
    oLogoutBtn.addEventListener('click', async () => {
      await logout();
    });
  }
}
