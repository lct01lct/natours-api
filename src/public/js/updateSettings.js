import axios from 'axios';
import { showAlert } from './alert';

const updateSettings = async (name, email) => {
  try {
    const { data } = await axios({
      method: 'patch',
      url: 'http://127.0.0.1:3000/api/v1/users',
      data: { name, email },
    });

    if (data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const initAccountPage = () => {
  const oUserForm = document.querySelector('.form-user-data');

  if (oUserForm) {
    oUserForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const name = document.getElementById('name').value;

      await updateSettings(name, email);
    });
  }
};
