import {json, type RequestHandler} from "@sveltejs/kit";
import type {AlbumData} from "$lib/types";

export const GET: RequestHandler = ({ request }) => {
    let response: AlbumData = { name: "Kesä 2022", slug: "kesa-2022", images: [{ url: "/favicon.png", description: "Kuva 1" }, { url: "/favicon.png", description: "Kuva 2" }] };
    return json(response);
}
