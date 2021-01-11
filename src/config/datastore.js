const mongodb = (mongoose) => {
	const options = {
		useCreateIndex: true,
		useNewUrlParser: true,
		poolSize: 10, // Maintain up to 10 socket connections
		socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		useUnifiedTopology: true, // The new Topology type uses the same machinery to represent all three types, greatly improving our ability to maintain the code, and reducing the chance for bug duplication
	}

	return mongoose.connect(
		process.env.DATABASE_ENDPOINT,
		options,
		(error) => {
			if (error) throw error
		}
	)
}

export {
	mongodb
}