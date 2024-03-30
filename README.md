# Telegram AI Bot

## Introduction

The Telegram AI Bot is an innovative tool designed to streamline social media content creation for platforms like Twitter, LinkedIn, and Facebook. It assists users in generating optimized posts based on their daily activities or achievements. This bot serves as an invaluable asset for individuals looking to maintain an active and engaging online presence without investing excessive time and effort.

## Features

- **Post Generation:** Automatically crafts tailored posts for Twitter, LinkedIn, and Facebook.
- **Daily Activity Tracking:** Users can input their daily activities, which the bot will use to generate content.
- **Easy to Use:** With simple commands, generate content effortlessly.

## How to Use

1. Open Telegram and navigate to @tweetProgress_bot or search for the username @tweetProgress_bot.
2. Send the `/start` command to initiate interaction with the bot.
3. Throughout the day, input activities or accomplishments you wish to share, such as "Learning React", "Exploring new marketing strategies", etc.
4. At the end of the day, use the `/generate` command to receive optimized posts tailored to your activities.

## How to Reproduce This Repository

To set up your own version of the Telegram AI Bot, follow these steps:

1. Clone this repository to your local machine.
    ```bash
    git clone <repository-url>
    ```
2. Create a `.env` file in the root directory. Use the `.env.sample` file as a template.
3. Fill in the appropriate environment variables in the `.env` file according to your configuration.
4. Install dependencies:
    ```bash
    npm install
    ```
5. Run the development server:
    ```bash
    npm run dev
    ```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `API_KEY`: Your API key for external services.
- `BOT_TOKEN`: Token of your Telegram bot.
- `DATABASE_URL`: URL for your database connection.

These variables ensure that the bot functions correctly and securely within your environment.


## Contact

For support or queries, reach out to us on Twitter: [whyrohitwhy](https://twitter.com/whyrohitwhy).

