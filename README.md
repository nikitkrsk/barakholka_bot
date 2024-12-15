# Telegram Keyword Tracking Bot

This bot is designed to help members of Telegram supergroups efficiently track messages containing specific topics or keywords they care about. By subscribing to keywords or predefined categories, users receive notifications for messages that match their interests, making group participation more streamlined and relevant.

## Features

- **Keyword Tracking**: Users can add specific keywords they want to track and receive notifications for messages containing those keywords.
- **Predefined Categories**: Subscribe to categories like "Технологии," "Автомобили," "Дети," or "Часы" to track related keywords.
- **Media Support**: Tracks keywords in both text messages and captions of media files like photos.
- **Flexible Keyword Management**: Commands to add, remove, list, and clear keywords easily.
- **Category Management**: Commands to subscribe/unsubscribe to predefined keyword groups.

## Commands

### User Commands
- `/start` - Welcome message with a link to `/help` for guidance.
- `/help` - Detailed instructions on how to use the bot.
- `/add <keyword>` - Add a keyword to your tracking list.
- `/remove <keyword>` - Remove a keyword from your tracking list.
- `/list` - Display the list of tracked keywords.
- `/clear` - Remove all keywords from your tracking list.
- `/groups` - Show available predefined categories.
- `/subscribe_group <category>` - Subscribe to a category to track all related keywords.
- `/unsubscribe_group <category>` - Unsubscribe from a category and stop tracking its keywords.

### Admin Information
- The bot requires admin access in the group to read messages.
- It forwards matching messages directly to users who subscribed to the relevant keywords or categories.

## How It Works
1. Add the bot to a supergroup and provide it with the necessary permissions (e.g., Read Messages).
2. Users interact with the bot in private messages to configure their preferences.
3. The bot listens for messages in the group and checks if any keywords or category-related words match.
4. When a match is found, the bot forwards the message to the user(s) who subscribed to the relevant keyword or category.

## Installation and Setup
1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your Telegram bot token:
   ```
   BOT_TOKEN=your-telegram-bot-token
   ```
4. Start the bot:
   ```bash
   node bot.js
   ```

## Usage Example
1. Add keywords individually:
   ```
   /add машина
   /add пылесос
   ```
2. Subscribe to a category:
   ```
   /subscribe_group технологии
   ```
3. View your current keyword list:
   ```
   /list
   ```
4. Clear all keywords:
   ```
   /clear
   ```

## Support
If you have any questions or suggestions, feel free to contact me. Enjoy using the bot!
