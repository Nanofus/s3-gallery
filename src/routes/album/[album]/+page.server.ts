import type {Load} from "@sveltejs/kit";

export const load: Load = async ({ fetch, params }) => {
    console.log(params.slug);
    return {
        album: await (await fetch(`/api/albums/${params.slug}`)).json()
    };
}
