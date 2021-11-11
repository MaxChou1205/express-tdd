const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://max:<password>@cluster0.qd3gu.mongodb.net/tdd?retryWrites=true&w=majority",
      { useNewUrlParser: true }
    );
    console.log("connected.");
  } catch (e) {
    console.error("Error connecting to mongodb");
    console.error(e);
  }
}

module.exports = { connect };
