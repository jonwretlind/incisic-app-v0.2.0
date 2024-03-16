const UserData = require('../models/userdata');

module.exports = {
  //# create a user
  create: async (request, reply) => {},

  //#get the list of users
  fetch: async (request, reply) => {
    try {
      let users = await UserData.find();
      reply.code(200).send(users);
    } catch (e) {
      reply.code(500).send(e);
    }
  },

  //#get a single user
  get: async (request, reply) => {
    try {
      let user = await UserData.findOne({_id: request.params.id});
      reply.code(200).send(user);
      console.log(user);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
 
  //#update a user
  update: async (request, reply) => {
      const updateDoc = {
      $set: {
        firstname,
        lastname,
      },
    };
    try {
      let user = await UserData.updateOne(
        {_id: request.params.id},
        updateDoc,
        { upcert: true }
      );
      reply.code(200).send(user);
    } catch (e) {
      reply.code(500).send(e);
    }
  },

  //#delete a user
  delete: async (request, reply) => {},
};
