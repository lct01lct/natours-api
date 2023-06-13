import axios from 'axios';
import { showAlert } from './alert';

const updateSettings = async (data, type) => {
  const url =
    type === 'password'
      ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
      : 'http://127.0.0.1:3000/api/v1/users';

  try {
    const res = await axios({
      method: 'patch',
      url: url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const initAccountPage = () => {
  const oUserForm = document.querySelector('.form-user-data');
  const oPasswordForm = document.querySelector('.form-user-password');

  oUserForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;

    await updateSettings({ name, email }, 'data');
  });

  oPasswordForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ password, passwordConfirm, passwordCurrent }, 'password');
  });
};
