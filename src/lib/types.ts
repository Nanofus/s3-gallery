export type AlbumList = {
    albums: Album[];
}

export type Album = {
    name: string;
};

export type AlbumData = Album & {
    images: Image[]
}

export type Image = {
    url: string;
    description: string;
};
