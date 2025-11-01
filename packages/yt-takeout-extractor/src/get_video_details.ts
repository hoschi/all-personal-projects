import axios from 'axios';
import * as dotenv from 'dotenv';

// https://www.perplexity.ai/search/du-bist-senior-softwareentwick-kN8oJ3ilQfWQ7sFN.0mi1g

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// ============= Type Definitions =============

interface Chapter {
    title: string;
    time: string;
    timeInSeconds: number;
}

interface VideoSnippet {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    tags?: string[];
}

interface VideoContentDetails {
    duration: string;
}

interface VideoItem {
    id: string;
    snippet: VideoSnippet;
    contentDetails: VideoContentDetails;
}

interface YouTubeApiResponse {
    items: VideoItem[];
}

interface VideoData {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    tags: string[];
    duration: string;
    chapters: Chapter[];
}

// ============= Chapter Extraction =============

const extractChaptersFromDescription = (description: string): Chapter[] => {
    const timestampPattern = /(\d{1,2}):(\d{2}):?(\d{2})?\s*[-–]\s*(.+?)(?=\n|$)/g;
    const chapters: Chapter[] = [];
    let match;

    while ((match = timestampPattern.exec(description)) !== null) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = match[3] ? parseInt(match[3], 10) : 0;
        const title = match[4].trim();

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        chapters.push({
            title,
            time: `${match[1].padStart(2, '0')}:${match[2].padStart(2, '0')}:${(match[3] || '00').padStart(2, '0')}`,
            timeInSeconds: totalSeconds,
        });
    }

    return chapters;
};

// ============= API Functions =============

const getVideoData = async (videoId: string): Promise<VideoData> => {
    if (!YOUTUBE_API_KEY) {
        throw new Error(
            'YouTube API Key ist nicht gesetzt. Bitte .env Datei prüfen.'
        );
    }

    if (!videoId || videoId.trim() === '') {
        throw new Error('Video ID darf nicht leer sein.');
    }

    try {
        const response = await axios.get<YouTubeApiResponse>(
            `${YOUTUBE_API_BASE_URL}/videos`,
            {
                params: {
                    part: 'snippet,contentDetails',
                    id: videoId,
                    key: YOUTUBE_API_KEY,
                },
            }
        );

        if (response.data.items.length === 0) {
            throw new Error(`Kein Video mit der ID "${videoId}" gefunden.`);
        }

        const videoItem = response.data.items[0];
        const snippet = videoItem.snippet;
        const description = snippet.description || '';
        const chapters = extractChaptersFromDescription(description);

        const videoData: VideoData = {
            id: videoItem.id,
            title: snippet.title,
            description,
            publishedAt: snippet.publishedAt,
            channelTitle: snippet.channelTitle,
            tags: snippet.tags || [],
            duration: videoItem.contentDetails.duration,
            chapters,
        };

        return videoData;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.error?.message || error.message;
            throw new Error(`Fehler beim Abrufen der Video-Informationen: ${errorMessage}`);
        }
        throw error;
    }
};

// ============= Formatting Utilities =============

const formatDuration = (isoDuration: string): string => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const match = isoDuration.match(regex);

    if (!match) return isoDuration;

    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// ============= Output Formatting =============

const formatVideoOutput = (videoData: VideoData): string => {
    const separator = '='.repeat(60);

    let output = `\n${separator}\n`;
    output += `📺 VIDEO DETAILS\n`;
    output += `${separator}\n\n`;

    output += `Titel:            ${videoData.title}\n`;
    output += `Video-ID:         ${videoData.id}\n`;
    output += `Channel:          ${videoData.channelTitle}\n`;
    output += `Veröffentlicht:   ${formatDate(videoData.publishedAt)}\n\n`;

    output += `Dauer (ISO):      ${videoData.duration}\n`;
    output += `Dauer (lesbar):   ${formatDuration(videoData.duration)}\n\n`;

    output += `Tags (${videoData.tags.length}):\n`;
    if (videoData.tags.length > 0) {
        videoData.tags.forEach((tag) => {
            output += `  • ${tag}\n`;
        });
    } else {
        output += `  Keine Tags vorhanden\n`;
    }

    output += `\nBeschreibung:\n`;
    output += `${'-'.repeat(60)}\n`;
    output += `${videoData.description}\n`;
    output += `${'-'.repeat(60)}\n`;

    output += `\n📍 KAPITEL (${videoData.chapters.length})\n`;
    output += `${separator}\n`;

    if (videoData.chapters.length > 0) {
        videoData.chapters.forEach((chapter, index) => {
            output += `${index + 1}. [${chapter.time}] ${chapter.title} (${chapter.timeInSeconds}s)\n`;
        });
    } else {
        output += `Keine Kapitel in der Beschreibung gefunden.\n`;
    }

    output += `\n${separator}\n`;

    return output;
};

// ============= Main Function =============

const main = async () => {
    const videoId = process.argv[2];

    if (!videoId) {
        console.error(
            'Verwendung: bun run get_video_details.ts <VIDEO_ID>\n'
        );
        console.error('Beispiel: bun run get_video_details.ts wkTHCRSNhYo');
        process.exit(1);
    }

    try {
        console.log('⏳ Rufe Video-Daten ab...');
        const videoData = await getVideoData(videoId);
        console.log(formatVideoOutput(videoData));
    } catch (error) {
        console.error(
            '❌ Fehler:',
            error instanceof Error ? error.message : 'Unbekannter Fehler'
        );
        process.exit(1);
    }
};

main();