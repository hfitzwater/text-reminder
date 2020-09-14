import axios from 'axios';

const HOST = process.env.VUE_APP_API_HOST;
const PORT = process.env.VUE_APP_API_PORT;

const BASE_URI = `https://${HOST}/`;
export const SESSION_TOKEN_KEY = 'trToken';
let TOKEN = sessionStorage.getItem(SESSION_TOKEN_KEY);

axios.defaults.baseURL = BASE_URI;

export default class CoreClient {
  static async getUserFromToken() {
    if( TOKEN ) {
      const { data } = await axios.get('users/me', {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      });

      if( data.phoneNumber ) {
        const resp = await axios.get(`phone-numbers/${data.phoneNumber}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        });
        data.phoneNumber = resp.data;
      }

      return data;
    }
  }

  static async login(email, password) {
    const { data } = await axios.post('auth/local', {
      identifier: email,
      password: password,
    });

    TOKEN = data.jwt;

    sessionStorage.setItem(SESSION_TOKEN_KEY, TOKEN);

    return data.user;
  }

  static async signup(email, phoneNumber, password) {
    const { data } = await axios.post('auth/local/register', {
      username: email,
      email: email,
      phoneNumber: phoneNumber,
      password: password
    });

    TOKEN = data.jwt;

    sessionStorage.setItem(SESSION_TOKEN_KEY, TOKEN);

    return data.user;
  }

  static async confirmPhone(code) {
    const { data } = await axios.post('phone-number-confirmations/confirm', { code }, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    return data;
  }

  static async forgotPassword(email) {
    const { data } = await axios.post('auth/forgot-password', { email });

    return data;
  }

  static async resetPassword(password, code) {
    const { data } = await axios.post('auth/reset-password', {
      password,
      code,
      passwordConfirmation: password
    });

    return data;
  }

  static logout() {
    sessionStorage.clear();
    TOKEN = null;
  }

  static async getReminders() {
    const { data } = await axios.get('reminders', {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    return data;
  }

  static async createReminder( reminder ) {
    const result = await axios.post('reminders', reminder, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    return result;
  }

  static async updateReminder( reminder ) {
    const result = await axios.put(`reminders/${reminder.id}`, reminder, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    return result;
  }

  static async deleteReminder( reminderId ) {
    const result = await axios.delete(`reminders/${reminderId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    return result;
  }
}