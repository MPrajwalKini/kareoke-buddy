import { read, utils } from 'xlsx';
import { PlaylistItem, SourceType, EXCEL_COLUMNS } from './types';
import { extractYoutubeId } from './utils';

export async function parsePlaylistFile(file: File): Promise<PlaylistItem[]> {
    const data = await file.arrayBuffer();
    const workbook = read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData: any[] = utils.sheet_to_json(worksheet);
    const items: PlaylistItem[] = [];

    jsonData.forEach((row, index) => {
        const typeRaw = row[EXCEL_COLUMNS.SOURCE]?.toString().toUpperCase().trim();
        const type: SourceType = (typeRaw === 'YOUTUBE' || typeRaw === 'LOCAL') ? typeRaw : 'LOCAL';

        const item: PlaylistItem = {
            id: crypto.randomUUID(),
            order: Number(row[EXCEL_COLUMNS.ORDER]) || index + 1,
            type,
            title: row[EXCEL_COLUMNS.SONG_NAME] || 'Unknown Title',
            artist: row[EXCEL_COLUMNS.ARTIST] || 'Unknown Artist',
            fileName: row[EXCEL_COLUMNS.FILE_NAME],
            youtubeUrl: row[EXCEL_COLUMNS.YOUTUBE_URL],
            notes: row[EXCEL_COLUMNS.NOTES],
            status: 'READY'
        };

        if (type === 'YOUTUBE') {
            if (item.youtubeUrl) {
                item.youtubeId = extractYoutubeId(item.youtubeUrl) || undefined;
                if (!item.youtubeId) item.status = 'ERROR';
            } else {
                item.status = 'ERROR';
            }
        } else {
            if (!item.fileName) {
                item.status = 'ERROR'; // Will be checked against loaded files map later
            }
        }

        items.push(item);
    });

    return items.sort((a, b) => a.order - b.order);
}
