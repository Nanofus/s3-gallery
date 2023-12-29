import type {RequestHandler} from "@sveltejs/kit";
import { SITE_PASSWORD } from "$env/static/private";

export const POST: RequestHandler = ({ cookies, request }): Response => {
    let password = request.headers.get("Authorization")?.split(" ")[1] as string;
    if (password === btoa(SITE_PASSWORD)) {
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: false }), { status: 401, headers: { "Content-Type": "application/json" } });
}
