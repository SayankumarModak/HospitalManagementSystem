import mongoose from "mongoose";

export const dbConnetion = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "DOCTORJEE_PROJECT",
    })
    .then(() => {
      console.log("Connection Successfully Occured");
    })
    .catch((err) => {
      console.log(`error occured, ${err}`);
    });
};
