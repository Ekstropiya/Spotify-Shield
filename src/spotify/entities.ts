export interface Playlist {
    name: string;
    duration: number;
    icons: Array<Image>;
    tracks: Array<Track>;
}

export interface Show {
    name: string;
    description: string;
    images: Array<Image>;
    episodes: Array<Episode>
}

export interface Episode {
    name: string;
    url: string;
    date: string;
    duration: number;
    images: Array<Image>;
}

export interface Track {
    name: string;
    duration?: number;
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
    followers?: number;
}

export interface Album {
    covers: Array<Image>;
    name: string;
    artist: Artist;
    date: string;
}