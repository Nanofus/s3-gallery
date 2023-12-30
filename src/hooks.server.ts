import type {Handle} from "@sveltejs/kit";
import {SITE_PASSWORD} from "$env/static/private";

export const handle: Handle = async ({event, resolve }) => {
    const auth = event.request.headers.get("Authorization");
    if (auth !== `Basic ${btoa(SITE_PASSWORD)}`) {
        return new Response("Not authorized", {
            status: 401,
            headers: {
                "WWW-Authenticate":
                    'Basic realm="User Visible Realm", charset="UTF-8"',
            },
        });
    }

    return resolve(event);
};
