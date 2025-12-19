'use client';

import React, { useState } from 'react';
import { usePlayerStore } from '@/lib/store';
import { extractYoutubeId } from '@/lib/utils';
import { Search, Plus, Youtube } from 'lucide-react';
import { PlaylistItem } from '@/lib/types';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToQueue, playlist } = usePlayerStore();

    const fetchYoutubeMetadata = async (id: string) => {
        try {
            // Noembed is a reliable public oEmbed proxy/wrapper, or use direct YT oembed
            const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
            const data = await res.json();
            return {
                title: data.title || 'Unknown Title',
                author: data.author_name || 'Unknown Artist'
            };
        } catch (e) {
            console.error("Failed to fetch metadata", e);
            return { title: 'YouTube Video', author: 'Unknown' };
        }
    };

    const handleAdd = async () => {
        if (!query) return;
        setIsLoading(true);

        const ytId = extractYoutubeId(query);

        if (ytId) {
            const metadata = await fetchYoutubeMetadata(ytId);

            const newItem: PlaylistItem = {
                id: typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `yt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                order: playlist.length + 1,
                type: 'YOUTUBE',
                title: metadata.title,
                artist: metadata.author,
                youtubeUrl: query,
                youtubeId: ytId,
                status: 'READY'
            };
            addToQueue(newItem);
            setQuery('');
        } else {
            // Mock Search for Demo
            // In a real app, call YouTube Data API here
            const newItem: PlaylistItem = {
                id: typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                order: playlist.length + 1,
                type: 'YOUTUBE',
                title: query, // Assume the query is the song name for mock
                artist: 'Queue Add',
                youtubeUrl: 'https://youtube.com/watch?v=mock', // Mock
                status: 'ERROR', // Will error on play, but proves UI works
                notes: 'Search Result'
            };
            addToQueue(newItem);
            setQuery('');
        }
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
    };

    return (
        <div className="relative mb-4">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                <div className="pl-3 text-gray-400">
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Search size={16} />
                    )}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste YouTube URL or Song Name..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white p-3 placeholder-gray-500 disabled:opacity-50"
                />
                <button
                    onClick={handleAdd}
                    disabled={!query || isLoading}
                    className="p-3 hover:bg-white/10 text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
}
