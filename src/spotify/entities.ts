export interface Track {
    name: string;
    artist: Artist;
    album: Album;
    link: string;
    preview: string;
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Artist {
    name: string;
    icons: Array<Image>;
}

export interface Album {
    covers: Array<Image>;
    name: string;
    artist: Artist;
    date: string;
}