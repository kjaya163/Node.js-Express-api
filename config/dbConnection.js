const mongoose = require("mongoose");

const conectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING , { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(
            "Database Connected: ", 
            connect.connection.host,
            connect.connection.name,
            );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = conectDB;