import mongoose from "mongoose";
import "dotenv/config";

export default () => {
	return mongoose
		.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds by default is is 10 seconds...
		})
		.catch((err) => console.log(err.reason));
	//  mongoose.connect(process.env.MONGO_URI);
};
