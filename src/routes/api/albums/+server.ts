import {json, type RequestHandler} from "@sveltejs/kit";
import type {AlbumList} from "$lib/types";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { AWS_REGION } from "$env/static/private";

export const GET: RequestHandler = ({ request }) => {
    const client = new S3Client({ region: AWS_REGION, credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        } });

    const command = new ListBucketsCommand({});
    
    let response: AlbumList = { albums: [{ name: "Kesä 2022", slug: "kesa-2022"}, { name: "Talvi 2022", slug: "talvi-2022"}] };
    return json(response);
}
