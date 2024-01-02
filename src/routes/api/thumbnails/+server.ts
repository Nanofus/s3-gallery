import {json, type RequestHandler} from "@sveltejs/kit";
import sharp from "sharp";
import {S3} from "@aws-sdk/client-s3";
import {
    AWS_ACCESS_KEY_ID,
    AWS_BUCKET,
    AWS_PREFIX,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    THUMBNAIL_GENERATION_PASSWORD
} from "$env/static/private";
import {Buffer} from "buffer";

// Generate thumbnails with:
// http://localhost:5173/api/thumbnails?auth={THUMBNAIL_GENERATION_PASSWORD}

// NOTE: THIS CURRENTLY ONLY WORKS LOCALLY

const checkIfValidFormat = (key: string) => {
    const lowercaseKey = key.toLowerCase();
    return lowercaseKey.endsWith("jpg") ||
        lowercaseKey.endsWith("jpeg");
}

export const GET: RequestHandler = async ({url}) => {
    if (!url.searchParams.get("auth") || url.searchParams.get("auth") !== THUMBNAIL_GENERATION_PASSWORD) {
        return json({error: "No auth specified"});
    }

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
    const albums = data.CommonPrefixes?.map((prefix) => prefix.Prefix?.replace(AWS_PREFIX, '')
        .replace('/', '') || '') || [];

    const existingThumbs = await (async () => {
        try {
            return (await (await s3.getObject({
                Bucket: AWS_BUCKET,
                Key: AWS_PREFIX + "thumb_log.txt"
            })).Body.transformToString("utf-8")).split(',');
        } catch {
            return [];
        }
    })();
    const newGeneratedThumbs: string[] = [];

    for (let album of albums) {
        const data = await s3.listObjects({
            Bucket: AWS_BUCKET,
            Prefix: AWS_PREFIX + decodeURIComponent(album)
        })
        const keys = data.Contents?.filter(item => !item.Key?.endsWith('/'))
            .map(item => item.Key) as string[];

        for (let key of keys) {
            const newKey = AWS_PREFIX + 'thumbs/' + decodeURIComponent(album) + key.replace(AWS_PREFIX + decodeURIComponent(album), "");
            console.log("Generating thumbnail for " + key + " to " + newKey);
            if (existingThumbs.includes(newKey) || existingThumbs.includes(key)) {
                console.log("Already generated, skipping");
                continue;
            }
            if (!checkIfValidFormat(key)) {
                console.log("Invalid format, skipping");
                continue;
            }
            if (key.includes("thumbs")) {
                console.log("Already a thumbnail, skipping");
                continue;
            }
            const obj = await s3.getObject({Bucket: AWS_BUCKET, Key: key})
            const buffer = (await obj.Body?.transformToByteArray());
            const result = await sharp(buffer)
                .rotate() // Take EXIF rotation into account
                .toFormat("jpeg")
                .jpeg({quality: 100})
                .resize(300)
                .toBuffer();
            await s3.putObject({
                Bucket: AWS_BUCKET,
                Key: newKey,
                Body: result,
                ContentType: 'image/jpeg'
            });
            console.log("Resized");
            newGeneratedThumbs.push(newKey);
        }
    }

    const newThumbsList = existingThumbs.concat(newGeneratedThumbs);
    console.log("Uploading updated thumbnail list");
    await s3.putObject({
        Bucket: AWS_BUCKET,
        Key: AWS_PREFIX + "thumb_log.txt",
        Body: Buffer.from(JSON.stringify(newThumbsList.join(",")), 'utf8')
    });

    return json({success: true});
}
