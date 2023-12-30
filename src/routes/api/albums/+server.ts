import {json, type RequestHandler} from "@sveltejs/kit";
import type {AlbumList} from "$lib/types";
import {S3} from "@aws-sdk/client-s3";
import {
    AWS_ACCESS_KEY_ID,
    AWS_BUCKET,
    AWS_PREFIX,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    SITE_PASSWORD
} from "$env/static/private";

export const GET: RequestHandler = async () => {
    const s3 = new S3({
        region: AWS_REGION, credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        }
    });

    const data = await s3.listObjects({
        Bucket: AWS_BUCKET,
        Prefix: AWS_PREFIX,
        Delimiter: '/'
    })
    const prefixes = data.CommonPrefixes || [];

    const response: AlbumList = {
        albums: prefixes.map((prefix) => {
            return {
                name: prefix.Prefix?.replace(AWS_PREFIX, '')
                    .replace('/', '') || '',
                description: ''
            };
        }).sort((a, b) => {
            const aYear = parseInt(a.name.slice(-4));
            const bYear = parseInt(b.name.slice(-4));
            if (isNaN(aYear) || isNaN(bYear)) {
                return 0;
            }
            return bYear - aYear;
        })
    };

    return json(response);
}
