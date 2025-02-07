import fetch from "node-fetch";
import { CLIENT_ID, TOKEN } from "../config.js";

/**
 * Register the metadata to be stored by Discord. This should be a one time action.
 * Note: uses a Bot token for authentication, not a user token.
 */
const url = `https://discord.com/api/v10/applications/${CLIENT_ID}/role-connections/metadata`;
// supported types: number_lt=1, number_gt=2, number_eq=3 number_neq=4, datetime_lt=5, datetime_gt=6, boolean_eq=7, boolean_neq=8
const body = [
    {
        key: "isstaff",
        name: "Get the role!",
        name_localizations: { tr: "Role sahip ol!" },
        description: "You look like a staff.",
        description_localizations: { tr: "Sen yetkili birine benziyorsun." },
        type: 7,
    },
];

const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${TOKEN}`,
    },
});
if (response.ok) {
    const data = await response.json();
    console.log(data);
} else {
    //throw new Error(`Error pushing discord metadata schema: [${response.status}] ${response.statusText}`);
    const data = await response.text();
    console.log(data);
}
