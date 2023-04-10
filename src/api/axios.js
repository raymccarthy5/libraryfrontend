import axios from 'axios';

const BASE_URL = 'https://library-management-backend.herokuapp.com/api/v1';

export default axios.create({
  baseURL: BASE_URL
});

