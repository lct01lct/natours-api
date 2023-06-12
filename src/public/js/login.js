const login = async (email, password) => {
  password = '$2a$12$Q0grHjH9PXc6SxivC8m12.2mZJ9BbKcgFpwSG4Y1ZEII8HJVzWeyS';

  const res = await axios({
    method: 'post',
    url: 'http://127.0.0.1:3000/api/v1/users/login',
    data: {
      email,
      password,
    },
  });

  console.log(res);
  console.log(document.cookie);
};

document.getElementById('email').value = 'admin@natours.io';
document.getElementById('password').value = '123456';

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
