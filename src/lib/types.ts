export type SourceType = 'LOCAL' | 'YOUTUBE';

export interface PlaylistItem {
    id: string;
    order: number;
    type: SourceType;
    title: string;
    artist: string;
    notes?: string;
    fileName?: string;
    youtubeUrl?: string;
    youtubeId?: string;
    duration?: number;
    status: 'READY' | 'MISSING' | 'ERROR' | 'PLAYING' | 'DONE';
}

export interface Playlist {
    id: string;
    name: string;
    items: PlaylistItem[];
}

export const EXCEL_COLUMNS = {
    ORDER: 'Order',
    SOURCE: 'Source',
    SONG_NAME: 'Song Name',
    ARTIST: 'Artist',
    FILE_NAME: 'File Name',
    YOUTUBE_URL: 'YouTube URL',
    NOTES: 'Notes'
};
