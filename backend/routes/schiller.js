
const SchillerDataController = require('../controllers/schillerDataController');

module.exports = (app) => {
    // create a record
    app.post('/api/schiller', SchillerDataController.create);

    // get the list of records
    app.get('/api/schiller', SchillerDataController.fetch);

    // get a single record
    app.get('/api/schiller:id', SchillerDataController.get);

    // update a record
    app.put('/api/schiller:id', SchillerDataController.update);

    // delete a record
    app.delete('/api/schiller:id', SchillerDataController.delete);
};
