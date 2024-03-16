const SchillerData = require('../models/schillerDataModel');

module.exports = {
    //# create a record
    create: async (request, reply) => { },

    //#get the list of records
    fetch: async (request, reply) => {
        try {
            let records = await SchillerData.find();
            reply.code(200).send(records);
        } catch (e) {
            reply.code(500).send(e);
        }
    },

    //#get a single record
    get: async (request, reply) => {
        try {
            let record = await SchillerData.findOne({ _id: request.params.id });
            reply.code(200).send(record);
        } catch (e) {
            reply.code(500).send(e);
        }
    },

    //#update a record
    update: async (request, reply) => {
        const updateDoc = {
            $set: {
                firstname,
                lastname,
            },
        };
        try {
            let record = await SchillerData.updateOne(
                { _id: request.params.id },
                updateDoc,
                { upcert: true }
            );
            reply.code(200).send(record);
        } catch (e) {
            reply.code(500).send(e);
        }
    },

    //#delete a record
    delete: async (request, reply) => { },
};
