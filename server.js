import { Telegraf } from "telegraf";
import "dotenv/config";
import userModel from "./src/models/User.js";
import eventModel from "./src/models/Event.js";
import connectDb from "./src/config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
try {
	connectDb();
	console.log("db connected");
} catch (error) {
	console.log("error", error);
	process.kill(process.pid, "SIGTERM");
}

bot.start(async (ctx) => {
	console.log("Bot starting up at:", new Date().toISOString());
	const from = ctx.update.message.from;
	try {
		await userModel.findOneAndUpdate(
			{ tgId: from.id },
			{
				$setOnInsert: {
					firstName: from.first_name,
					lastName: from.last_name,
					userName: from.username,
					isBot: from.is_bot,
				},
			},
			{
				upsert: true,
				new: true,
			}
		);

		await ctx.reply(`
    Hey!, ${from.first_name}, Welcome. I will be writing highly engagin social media posts for you. Just keep feeding me with the events throught the day. Let's shine on social media.`);
	} catch (error) {
		console.log(error);
		await ctx.reply("Something went wrong. Please try again later");
	}
});

bot.help(async (ctx) => {
	await ctx.reply(
		"For support contact @rohit_ck or hmu on twitter https://twitter.com/whyrohitwhy"
	);
});

bot.command("generate", async (ctx) => {
	const from = ctx.update.message.from;

	const { message_id: waitingmessageId } = await ctx.reply(
		`Hey!, ${from.first_name}, Kindly wait for a moment. I am curating posts for you.`
	);

	const { message_id: loadingStickerId } = await ctx.replyWithSticker(
		"CAACAgIAAxkBAANoZgf4AavMVeZYkDzPSGjpfZPjLLAAAgIBAAJWnb0KTuJsgctA5P80BA"
	);

	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date();
	endOfDay.setHours(23, 59, 59, 999);

	const events = await eventModel.find({
		tgId: from.id,
		createdAt: { $gte: startOfDay, $lte: endOfDay },
	});

	if (events.length === 0) {
		await ctx.deleteMessage(loadingStickerId);
		await ctx.deleteMessage(waitingmessageId);
		await ctx.reply("No events found. Please try again later");
		return;
	}

	try {
		const prompt = `Act as a senior copywriter, you write highly engaging posts for linkedin, facebook and    twitter using provided thoughts/events throughout the day.
          Write like a human, for humans. Craft three engaging social media posts tailored for linkedin, Facebook, and twitter audiences. Use simple language. Use given time labels just to understand the order of events, don't mention the time in posts. Each posts should creatively highlight the following events. Ensure the tone is conversational and impactful. Use relevant emojis if possible. Focus on engaging the respective platform's audience, encouraging interaction, and driving interest in the events:
          ${events.map((event) => event.text).join("\n")}
          ,
          Use all of the above events, not just top 3 events and create 3 seperate posts for linkedin, twitter and facebook, where all 3 posts should contain data of all the events above mentioned.         
          `;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		//store token count in user model
		await userModel.findOneAndUpdate(
			{ tgId: from.id },
			{
				$inc: {
					promptTokens: 1,
					completionTokens: 1,
				},
			}
		);
		await ctx.deleteMessage(loadingStickerId);
		await ctx.deleteMessage(waitingmessageId);
		await ctx.replyWithHTML(text);
	} catch (error) {
		console.log(error);
		await ctx.reply("Something went wrong. Please try again later");
	}

	// send response
});

// bot.on("sticker", async (ctx) => {
// 	const from = ctx.update.message.from;
// 	console.log("sticker", ctx.update.message);
// 	await ctx.reply("Stickers are not supported");
// });

bot.on("text", async (ctx) => {
	const from = ctx.update.message.from;
	const message = ctx.update.message.text;

	try {
		await eventModel.create({
			text: message,
			tgId: from.id,
		});

		await ctx.reply(
			"Noted, Keep texting me your thoughts. To generate the posts, just enter the command: /generate"
		);
	} catch (error) {
		console.log(error);
		await ctx.reply("Something went wrong. Please try again later");
	}
});

const shutdown = async () => {
	console.log("Shutting down bot...");
	await bot.stop("SIGTERM received");
	process.exit(0);
};

bot.launch().then(() => {
	console.log("Bot started successfully");
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// const chat = model.startChat({
// 	history: [
// 		{
// 			role: "user",
// 			parts: [
// 				{
// 					text: "Act as a senior copywriter, you write highly engaging posts for linkedin, facebook and twitter using provided thoughts/events throughout the day.",
// 				},
// 			],
// 		},
// 		{
// 			role: "user",
// 			parts: [
// 				{
// 					text: `Act as a senior copywriter, you write highly engaging posts for linkedin, facebook and twitter using provided thoughts/events throughout the day.
//       Write like a human, for humans. Craft three engaging social media posts tailored for linkedin, Facebook, and twitter audiences. Use simple language. Use given time labels just to understand the order of events, don't mention the time in posts. Each posts should creatively highlight the following events. Ensure the tone is conversational and impactful. Focus on engaging the respective platform's audience, encouraging interaction, and driving interest in the events:
//       ${events.map((event) => event.text).join("\n\n")}
//       `,
// 				},
// 			],
// 		},
// 	],
// 	generationConfig: {
// 		maxOutputTokens: 100,
// 	},
// });

// const chatCompletion = await openai.chat.completions.create({
// 	model: "gpt-3.5-turbo",
// 	messages: [
// 		{
// 			role: "system",
// 			content:
// 				"Act as a senior copywriter, you write highly engaging posts for linkedin, facebook and twitter using provided thoughts/events throughout the day.",
// 		},
// 		{
// 			role: "user",
// 			content: `
//       Write like a human, for humans. Craft three engaging social media posts tailored for linkedin, Facebook, and twitter audiences. Use simple language. Use given time labels just to understand the order of events, don't mention the time in posts. Each posts should creatively highlight the following events. Ensure the tone is conversational and impactful. Focus on engaging the respective platform's audience, encouraging interaction, and driving interest in the events:
//       ${events.map((event) => event.text).join("\n\n")}
//       `,
// 		},
// 	],
// });
// console.log("chatCompletion", chatCompletion);
