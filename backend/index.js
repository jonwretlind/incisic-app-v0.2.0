const fastify = require('fastify')({ logger: true });
const mongoose = require("mongoose");
// API port 3001 is proxied on remote Nginx server
// to port 4000 in /etc/nginx/sites-enabled/incisic
const PORT = 4000;
const DB_URL = "mongodb://127.0.0.1:27017/incisic_app";
const userRoutes = require('./routes/user')
const schillerRoutes = require('./routes/schiller')
const userData = require("./models/userdata");
const schillerData = require("./models/schillerDataModel");
const contentRangeHook = require('./hooks/contentRangeHook');
const app = fastify;

app.register(require('fastify-cors'), {
  origin: true,
  allowedHeaders: 'Content-Type'
});

try {
  mongoose.connect(DB_URL);
} catch (e) {
  console.error(e);
};

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("Connection with MongoDB was successful");
});

app.addHook('preHandler', contentRangeHook);
userRoutes(app, userData);
schillerRoutes(app, schillerData);

app.get('/', (req, res) => {
  res.send('Hello, this is the Incisic Backend Server at your service!');
})

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
