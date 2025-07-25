import axios from 'axios';
import { showAlert } from './alert.js';
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
      withCredentials: true,
      credentials: 'include',
    });
    if (res.data.status == 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    },{
      withCredentials: true,
      credentials: 'include',
    });
    console.log(res);
    if (res.data.status = 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try Again.');
  }
};
