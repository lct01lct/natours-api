// import '@babel/polyfill';
import { initLoginPage, logout } from './login';
import { initAccountPage } from './updateSettings';

initHeader();
initLoginPage();
initAccountPage();

function initHeader() {
  const oLogoutBtn = document.querySelector('.nav__el--logout');

  if (oLogoutBtn) {
    oLogoutBtn.addEventListener('click', async () => {
      await logout();
    });
  }
}
