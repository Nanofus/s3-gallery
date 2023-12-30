import {json, type RequestHandler} from "@sveltejs/kit";
import type {AlbumData} from "$lib/types";
import {S3} from "@aws-sdk/client-s3";
import {
    AWS_ACCESS_KEY_ID,
    AWS_BUCKET,
    AWS_PREFIX,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    SITE_PASSWORD
} from "$env/static/private";

export const GET: RequestHandler = async ({params}) => {
    if (!params.album) {
        return json({error: "No album specified"});
    }

    const s3 = new S3({
        region: AWS_REGION, credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        }
    });

    const data = await s3.listObjects({
        Bucket: AWS_BUCKET,
        Prefix: AWS_PREFIX + decodeURIComponent(params.album)
    })
    const content = data.Contents || [];

    let response: AlbumData = {
        name: params.album,
        images: content.map(item => {
            return {
                url: 'https://' + AWS_BUCKET + '/' + item.Key || '',
                description: ''
            }
        }).filter(item => !item.url.endsWith('/'))
    };
    
    return json(response);
}
