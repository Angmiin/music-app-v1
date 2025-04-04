import { Track } from "./track";

type Playlist = {
    id: number;
    title: string;
    description: string;
    nb_tracks: number;
    picture_medium: string;
    tracks: {
        data: Track[];
    };
};