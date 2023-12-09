import type {Load} from "@sveltejs/kit";

export const load: Load = async ({ fetch, params }) => {
    return await (await fetch('/api/albums')).json();
}
