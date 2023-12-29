import type {Load} from "@sveltejs/kit";

export const load: Load = async ({ fetch, params }) => {
    return {
        album: await (await fetch(`/api/albums/${params.album}`)).json()
    };
}
