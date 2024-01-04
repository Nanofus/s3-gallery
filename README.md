# s3-gallery

Super-simple SvelteKit-based photo gallery. Designed for documenting events, so contains a bunch of assumptions based on that.

## Features

- Multiple albums with cover images
- Display location info for each album
- S3 bucket-based storage
- Thumbnail generation
- HTTP basic auth

## To do

- Proper support for videos
- Better authentication

## Setup

1. Fork and clone the project.
2. Create an S3 bucket + access credentials (write permission required for thumbnail generation).
3. Upload your photos and videos there, one folder per album. Add a `metadata.json` file to the root with the following schema:
```json
{
  "albums": [
    {
      "name": "album name, matching the folder name",
      "location": "album location, optional",
      "main": "cover image filename.jpg, optional"
    },
    ...
  ]
}
```
4. Fill in the env variables based on `.env.example`:
```
SITE_PASSWORD= # Username and password for HTTP basic auth, separated by a colon: "username:password"
THUMBNAIL_GENERATION_PASSWORD= # Password for the thumbnail generation URL, passed as a query parameter
AWS_REGION= # AWS region, e.g. "eu-west-1"
AWS_ACCESS_KEY_ID= # IAM user access key ID
AWS_SECRET_ACCESS_KEY= # IAM user secret access key
AWS_BUCKET= # S3 bucket name
AWS_PREFIX= # Prefix for the S3 bucket, e.g. "photos/"
PUBLIC_SITE_TITLE="Gallery" # Title for the site
PUBLIC_BACK_BUTTON_TEXT="<- Back" # Text for the back button
```
5. Deploy it to the hosting provider of your choice, for example Vercel.
