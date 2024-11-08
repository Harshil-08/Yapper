import { faker } from "@faker-js/faker";
import User from "../models/user.js"

export const createUser = async (number)=>{
	try {
		const userPromise = [];
		for (let i = 0; i < number; i++) {
	  	const temp = User.create({
				username: faker.internet.username(),
				bio:faker.lorem.sentence(10),
				email: faker.internet.email(),
				password:"password",
				avatar:{
					url: faker.image.avatar(),
					public_id: faker.system.fileName(),
				},
			});
			userPromise.push(temp);
			console.log("Users created",number)
		}
		await Promise.all(userPromise)
	} catch (error) {
		console.log(error)	
	}
}

export default createUser;
