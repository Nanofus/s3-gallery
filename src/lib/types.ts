export type AlbumList = {
    albums: Album[];
}

export type Album = {
    name: string;
    location: string | null;
    main: string | null;
};

export type AlbumData = Album & {
    images: Image[]
}

export type Image = {
    url: string;
    thumbnailUrl: string;
    description: string;
};
