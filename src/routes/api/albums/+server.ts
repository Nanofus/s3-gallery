import {json, type RequestHandler} from "@sveltejs/kit";
import type {AlbumList} from "$lib/types";
import {S3} from "@aws-sdk/client-s3";
import {AWS_ACCESS_KEY_ID, AWS_BUCKET, AWS_PREFIX, AWS_REGION, AWS_SECRET_ACCESS_KEY} from "$env/static/private";

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

    const metadataObj = await s3.getObject({
        Bucket: AWS_BUCKET,
        Key: AWS_PREFIX + 'metadata.json'
    });
    const metadata = JSON.parse(await metadataObj.Body?.transformToString("utf-8")).albums || [];

    const response: AlbumList = {
        albums: prefixes.map((prefix) => {
            const name = prefix.Prefix?.replace(AWS_PREFIX, '')
                .replace('/', '') || '';
            const hackedName = decodeURIComponent(encodeURIComponent(name).replace('a%CC%88', '%C3%A4')); // TODO: Dirty hack for umlauts
            const mainImgUrl = metadata.filter((album: any) => album.name === hackedName)[0]?.main
                ? encodeURI('https://' + AWS_BUCKET + '/' + AWS_PREFIX + 'thumbs/' + name + '/' + metadata.filter((album: any) => album.name === hackedName)[0]?.main)
                : null;
            return {
                name: name,
                location: metadata.filter((album: any) => album.name === hackedName)[0]?.location,
                main: mainImgUrl,
                description: ''
            };
        }).filter(item => !item.name.includes("thumbs")).sort((a, b) => {
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
