import axios from 'axios';
import { showAlert } from './alert';

const login = async (email, password) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err);
    console.log(err);
  }
};

export const logout = async () => {
  try {
    const { data } = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if (data.status === 'success') {
      location.reload(true);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const initLoginPage = () => {
  const oEmail = document.getElementById('email');
  const oPassword = document.getElementById('password');
  const oForm = document.querySelector('.form--login');

  if (oForm && oEmail && oPassword) {
    oEmail.value = 'admin@qq.com';
    oPassword.value = '123456789';
  }

  oForm?.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
};
