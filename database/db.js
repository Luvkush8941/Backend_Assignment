const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config({ path: "./config.env" });


// ------------------ HOSTED DATABASE -----------------

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
