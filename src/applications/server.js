import express from "express";
import cookieParser from "cookie-parser";

import * as discord from "./discord.js";
import * as storage from "./storage.js";
import { COOKIE_SECRET } from "../config.js";
import { getUserInfo } from "../shortcuts/database.js";
import { LINKED_ROLE_GUILD_ID } from "../events/client/messageCreate.js";

/**
 * Main HTTP server used for the bot.
 */

const app = express();
app.use(cookieParser(COOKIE_SECRET));

/**
 * Just a happy little route to show our server is up.
 */
app.get("/", (req, res) => {
    res.send("👋");
});

/**
 * Route configured in the Discord developer console which facilitates the
 * connection between Discord and any additional services you may use.
 * To start the flow, generate the OAuth2 consent dialog url for Discord,
 * and redirect the user there.
 */
app.get("/linked-role", async (req, res) => {
    try {
        // Discord OAuth2 authorization URL generation
        const { url, state } = discord.getOAuthUrl();

        // Store the state parameter in the user's cookies for verification
        res.cookie("clientState", state, {
            maxAge: 1000 * 60 * 5,
            signed: true,
        });

        // Redirect the user to the Discord OAuth2 authorization endpoint
        res.redirect(url);
    } catch (error) {
        console.error("Error while redirecting to Discord OAuth:", error);
        res.status(500).send(
            "An error occurred while redirecting to Discord OAuth."
        );
    }
});

/**
 * Route configured in the Discord developer console, the redirect Url to which
 * the user is sent after approving the bot for their Discord account. This
 * completes a few steps:
 * 1. Uses the code to acquire Discord OAuth2 tokens
 * 2. Uses the Discord Access Token to fetch the user profile
 * 3. Stores the OAuth2 Discord Tokens in Redis / Firestore
 * 4. Lets the user know it's all good and to go back to Discord
 */
app.get("/discord-oauth-callback", async (req, res) => {
    try {
        // 1. Uses the code and state to acquire Discord OAuth2 tokens
        const code = req.query["code"];
        const discordState = req.query["state"];

        // make sure the state parameter exists
        const { clientState } = req.signedCookies;
        if (clientState !== discordState) {
            console.error("State verification failed.");
            return res.sendStatus(403);
        }

        const tokens = await discord.getOAuthTokens(code);

        // 2. Uses the Discord Access Token to fetch the user profile
        const meData = await discord.getUserData(tokens);
        const userId = meData.user.id;
        await storage.storeDiscordTokens(userId, {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: Date.now() + tokens.expires_in * 1000,
        });

        // 3. Update the users metadata, assuming future updates will be posted to the `/update-metadata` endpoint
        await updateMetadata(userId);

        res.send("You did it!  Now go back to Discord.");
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

/**
 * Example route that would be invoked when an external data source changes.
 * This example calls a common `updateMetadata` method that pushes static
 * data to Discord.
 */
app.post("/update-metadata", async (req, res) => {
    try {
        const userId = req.body.userId;

        await updateMetadata(userId);

        res.sendStatus(204);
    } catch (e) {
        res.sendStatus(500);
    }
});

/**
 * Given a Discord UserId, push static make-believe data to the Discord
 * metadata endpoint.
 */
async function updateMetadata(userId) {
    // Fetch the Discord tokens from storage
    const tokens = await storage.getDiscordTokens(userId);

    let metadata = {};
    try {
        // Fetch the new metadata you want to use from an external source.
        // This data could be POST-ed to this endpoint, but every service
        // is going to be different.  To keep the example simple, we'll
        // just generate some random data.
        metadata = {
            messagecount: await getUserInfo(userId),
        };
        console.log(metadata);
    } catch (e) {
        e.message = `Error fetching external data: ${e.message}`;
        console.error(e);
        // If fetching the profile data for the external service fails for any reason,
        // ensure metadata on the Discord side is nulled out. This prevents cases
        // where the user revokes an external app permissions, and is left with
        // stale linked role data.
    }

    // Push the data to Discord.
    await discord.pushMetadata(userId, tokens, metadata);
}

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
