import {json, type RequestHandler} from "@sveltejs/kit";
import type {AlbumData} from "$lib/types";
import {S3} from "@aws-sdk/client-s3";
import {
    AWS_ACCESS_KEY_ID,
    AWS_BUCKET,
    AWS_PREFIX,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    LOGNAME
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

    const metadataObj = await s3.getObject({
        Bucket: AWS_BUCKET,
        Key: AWS_PREFIX + 'metadata.json'
    });
    const metadata = JSON.parse(await metadataObj.Body?.transformToString()).albums || [];
    
    const albumName = decodeURIComponent(encodeURIComponent(params.album).replace('a%CC%88', '%C3%A4')); // TODO: Dirty hack for umlauts
    
    let response: AlbumData = {
        name: albumName,
        location: metadata.filter((album: any) => album.name === albumName)[0]?.location,
        main: metadata.filter((album: any) => album.name === albumName)[0]?.main
            ? encodeURI('https://' + AWS_BUCKET + '/' + AWS_PREFIX + params.album + '/' + metadata.filter((album: any) => album.name === albumName)[0]?.main)
            : null,
        images: content.filter(item => !item.Key?.includes('thumbs')).map(item => {
            return {
                url: 'https://' + AWS_BUCKET + '/' + item.Key || '',
                thumbnailUrl: 'https://' + AWS_BUCKET + '/' + item.Key?.replace(AWS_PREFIX, AWS_PREFIX + 'thumbs/') || '',
                description: ''
            }
        }).filter(item => !item.url.endsWith('/'))
            .filter(item => !item.url.toLowerCase().endsWith('.heic'))
    };
    return json(response);
}
