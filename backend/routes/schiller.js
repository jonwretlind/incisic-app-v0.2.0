
const SchillerDataController = require('../controllers/schillerDataController');

module.exports = (app) => {
    // create a record
    app.post('/api/schiller_data', SchillerDataController.create);

    // get the list of records
    app.get('/api/schiller_data/all', SchillerDataController.fetch);

    // get a single record
    app.get('/api/schiller_data/:id', SchillerDataController.get);

    // update a record
    app.put('/api/schiller_data/:id', SchillerDataController.update);

    // delete a record
    app.delete('/api/schiller_data/:id', SchillerDataController.delete);
};
