'use client';

import React, { useRef, useState } from 'react';
import { usePlayerStore } from '@/lib/store';
import { parsePlaylistFile } from '@/lib/parser';
import { Upload, FileVideo, FileSpreadsheet, FolderOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { PlaylistItem } from '@/lib/types';

export default function DragDropZone({ compact = false }: { compact?: boolean }) {
    return <InternalZone compact={compact} />;
}

// Wrapper to keep logic clean (refactoring to internal component for 'compact' prop usage)
function InternalZone({ compact }: { compact: boolean }) {
    const [isDragging, setIsDragging] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string>(''); // Debug status
    const { setPlaylist, addFileToMap, addToQueue } = usePlayerStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        // Prevent flicker when dragging over children
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    };

    const processFiles = async (fileList: FileList) => {
        const files = Array.from(fileList);
        setStatusMsg(`Scanning ${files.length} files...`);

        // Filter Logic
        const playlistFile = files.find(f => f.name.endsWith('.xlsx') || f.name.endsWith('.csv'));

        // robust video check
        const isVideo = (file: File) => {
            const type = file.type || ''; // Fallback for emptry string types
            const name = file.name.toLowerCase();
            // Debug log specific to this file
            console.log(`Checking ${name} (${type})`);

            return type.startsWith('video/') ||
                name.endsWith('.mkv') ||
                name.endsWith('.avi') ||
                name.endsWith('.mov') ||
                name.endsWith('.mp4') ||
                name.endsWith('.webm') ||
                name.endsWith('.3gp') ||
                name.endsWith('.wmv'); // Added more formats
        };

        const videoFiles = files.filter(isVideo);
        setStatusMsg(`Found: ${files.length} files. Videos identified: ${videoFiles.length}.`);

        // 1. Handle File Mapping
        videoFiles.forEach(file => {
            // Lazy Load: Don't create URL yet. Just store the File object.
            // URL.createObjectURL will be called just-in-time by the player.
            addFileToMap(file.name, file);
        });

        // 2. Handle Playlist Logic
        let playlistLoaded = false;
        if (playlistFile) {
            try {
                const items = await parsePlaylistFile(playlistFile);
                if (items && items.length > 0) {
                    setPlaylist(items);
                    playlistLoaded = true;
                    setStatusMsg(prev => `${prev} Playlist loaded.`);
                }
            } catch (err) {
                console.error("Failed to parse", err);
                setStatusMsg(prev => `${prev} Playlist error.`);
            }
        }

        // 3. Fallback: If no valid playlist loaded, treat as raw video import
        if (!playlistLoaded && videoFiles.length > 0) {
            try {
                videoFiles.forEach((file) => {
                    // SAFE ID GENERATION (crypto.randomUUID crashes on HTTP LAN)
                    const safeId = typeof crypto !== 'undefined' && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                    const newItem: PlaylistItem = {
                        id: safeId,
                        order: 0,
                        type: 'LOCAL',
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        artist: 'Local File',
                        fileName: file.name,
                        status: 'READY'
                    };
                    addToQueue(newItem);
                });
                setStatusMsg(prev => `${prev} Queued ${videoFiles.length} videos.`);
            } catch (err: any) {
                console.error("Queue Error:", err);
                setStatusMsg(prev => `${prev} Error adding: ${err.message}`);
            }
        } else if (videoFiles.length === 0 && !playlistLoaded) {
            setStatusMsg(prev => `${prev} No playable videos found.`);
        }
    };

    const loadDemo = (e: React.MouseEvent) => {
        e.stopPropagation();
        const demoItems: any[] = [
            { id: '1', order: 1, type: 'YOUTUBE', title: 'Never Gonna Give You Up', artist: 'Rick Astley', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ', status: 'READY' },
            { id: '2', order: 2, type: 'YOUTUBE', title: 'Bohemian Rhapsody', artist: 'Queen', youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', youtubeId: 'fJ9rUzIMcZQ', status: 'READY' }
        ];
        setPlaylist(demoItems);
        setStatusMsg("Demo loaded.");
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileInput}
            />
            <input
                type="file"
                ref={folderInputRef}
                className="hidden"
                multiple
                // @ts-ignore - webkitdirectory is standard in modern browsers but missing in some react types
                webkitdirectory=""
                directory=""
                onChange={handleFileInput}
            />

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    "relative transition-all duration-300 group overflow-hidden",
                    "border-2 border-dashed rounded-xl",
                    isDragging ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20 bg-black/20",
                    compact ? "p-4" : "p-8"
                )}
            >

                {compact ? (
                    <div className="flex items-center justify-around gap-2">
                        {/* File Import */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors flex-1"
                        >
                            <div className="p-2 bg-white/5 rounded-full text-primary">
                                <Upload size={16} />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-semibold text-gray-300">Add Files</p>
                            </div>
                        </div>

                        <div className="hidden md:block h-8 w-[1px] bg-white/10" />

                        {/* Folder Import (Desktop Only - Mobile/Tablets don't support webkitdirectory well) */}
                        <div
                            onClick={() => folderInputRef.current?.click()}
                            className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors flex-1"
                        >
                            <div className="p-2 bg-white/5 rounded-full text-blue-400">
                                <FolderOpen size={16} />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-semibold text-gray-300">Add Folder</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        {/* Main Large View actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <Upload className="h-8 w-8 text-primary" />
                                <span className="text-sm font-medium">Add Files</span>
                            </button>
                            <button
                                onClick={() => folderInputRef.current?.click()}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <FolderOpen className="h-8 w-8 text-blue-400" />
                                <span className="text-sm font-medium">Add Folder</span>
                            </button>
                        </div>

                        <div>
                            <p className="text-sm text-gray-400 mt-1">
                                Drag & Drop also supported
                            </p>
                        </div>
                    </div>
                )}

                {/* Debug Status Message */}
                {statusMsg && (
                    <div className="absolute top-0 left-0 right-0 bg-black/80 text-[10px] text-yellow-500 p-1 text-center truncate px-2 pointer-events-none">
                        {statusMsg}
                    </div>
                )}

                {!compact && (
                    <button
                        onClick={loadDemo}
                        className="absolute bottom-2 right-2 text-[10px] text-gray-600 hover:text-primary z-50 pointer-events-auto bg-black/50 px-2 py-1 rounded border border-white/5 hover:border-primary/50"
                    >
                        Load Demo
                    </button>
                )}
            </div>

            {compact && (
                <div className="mt-2 text-center">
                    <button
                        onClick={loadDemo}
                        className="text-[10px] text-gray-500 hover:text-primary underline"
                    >
                        Load Demo Data
                    </button>
                    {/* Tiny visual indicator that file input is ready */}
                    <div className="h-1 w-1 bg-green-500 rounded-full mx-auto mt-1 opacity-50" title="Ready"></div>
                </div>
            )}
        </>
    );
}
