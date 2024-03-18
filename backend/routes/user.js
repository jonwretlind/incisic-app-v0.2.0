
const UserController = require('../controllers/userController');

module.exports = (app) => {
  // create a user
  app.post('/api/user', UserController.create);

  // get the list of users
  app.get('/api/user/all', UserController.fetch);

  // get a single user
  app.get('/api/user/:id', UserController.get);

  // update a user
  app.put('/api/user/:id', UserController.update);

  // delete a user
  app.delete('/api/user/:id', UserController.delete);
};
