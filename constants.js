const API_URL = process.env.NODE_ENV !== 'local' ?
                'https://datalead-4gk.herokuapp.com/api' :
                'http://localhost:5000/api';

module.exports = {
  API_URL
};