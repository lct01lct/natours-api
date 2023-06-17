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

    const form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'data');
  });

  oPasswordForm?.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password ').innerHTML = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ password, passwordConfirm, passwordCurrent }, 'password');

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password ').innerHTML = 'Save password';
  });
};
