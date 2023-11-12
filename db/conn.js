import mongoose from "mongoose";
mongoose.connect("mongodb+srv://daniyalali12568:mernauth@mernauth.7dnflu8.mongodb.net/MernAuthentication?retryWrites=true&w=majority")

const DB = mongoose.connection;
DB.on("error",console.error.bind(console,"connection error:"));
DB.once("open",function(){
  console.log("db connected!");
});
