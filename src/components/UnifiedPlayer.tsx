import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-youtube';
import { usePlayerStore } from '@/lib/store';
import { PlaylistItem } from '@/lib/types';
import { clsx } from 'clsx';
import { Music2, FolderOpen, AlertTriangle, FileVideo, RefreshCw } from 'lucide-react';

export default function UnifiedPlayer() {
    const { playlist, currentIndex, isPlaying, play, pause, fileMap, addFileToMap } = usePlayerStore();
    const [activeUrl, setActiveUrl] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);
    const playerRef = useRef<any>(null);
    const restoreFolderRef = useRef<HTMLInputElement>(null);
    const restoreFileRef = useRef<HTMLInputElement>(null);

    const currentItem = currentIndex >= 0 ? playlist[currentIndex] : null;

    // Prevent accidental refresh if queue has items
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (playlist.length > 0) {
                e.preventDefault();
                e.returnValue = ''; // Trigger browser confirmation dialog
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [playlist]);

    // JIT URL Creation / Cleanup Effect
    useEffect(() => {
        // Cleanup function to revoke old URL if it was a blob
        const cleanup = () => {
            if (activeUrl && activeUrl.startsWith('blob:')) {
                URL.revokeObjectURL(activeUrl);
                setActiveUrl(null);
            }
        };

        if (!currentItem) {
            cleanup();
            setActiveUrl(null);
            return;
        }

        if (currentItem.type === 'LOCAL') {
            const fileOrUrl = currentItem.fileName ? fileMap.get(currentItem.fileName) : null;

            if (fileOrUrl instanceof File) {
                // Create Blob URL JIT
                const newUrl = URL.createObjectURL(fileOrUrl);
                setActiveUrl(newUrl);
            } else if (typeof fileOrUrl === 'string') {
                // Already a string (legacy or demo mode)
                setActiveUrl(fileOrUrl);
            } else {
                console.warn("File not found in map:", currentItem.fileName);
                setActiveUrl(null);
            }
        } else {
            // YouTube, no blob needed
            setActiveUrl(null);
        }

        return cleanup;
    }, [currentItem, fileMap]); // Re-run when current item changes

    const handleEnd = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
            usePlayerStore.getState().jumpTo(nextIndex);
        }
    };

    const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsRestoring(true);
        const files = Array.from(e.target.files);
        let restoredCount = 0;

        files.forEach(file => {
            // Just hydrate the map, don't add to queue
            addFileToMap(file.name, file);
            if (file.name === currentItem?.fileName) {
                restoredCount++;
            }
        });

        setTimeout(() => setIsRestoring(false), 500);

        // Reset input
        e.target.value = '';
    };

    if (!currentItem) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-10">
                <div className="p-6 rounded-full bg-white/5 mb-4 animate-pulse">
                    <Music2 size={48} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
                    Waiting for Queue
                </h2>
                <p className="text-gray-500 mt-2">Drop files to begin</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black relative">
            {/* Hidden Inputs for Restoration */}
            <input
                type="file"
                ref={restoreFolderRef}
                className="hidden"
                // @ts-ignore
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleRestore}
            />
            <input
                type="file"
                ref={restoreFileRef}
                className="hidden"
                multiple
                onChange={handleRestore}
            />

            {currentItem.type === 'YOUTUBE' ? (
                <ReactPlayer
                    videoId={currentItem.youtubeId}
                    opts={{
                        height: '100%',
                        width: '100%',
                        playerVars: {
                            autoplay: 1,
                            controls: 1,
                        },
                    }}
                    className="absolute top-0 left-0 w-full h-full"
                    onEnd={handleEnd}
                    onPlay={play}
                    onPause={pause}
                />
            ) : (
                activeUrl ? (
                    <video
                        src={activeUrl}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        playsInline
                        onEnded={handleEnd}
                        onPlay={play}
                        onPause={pause}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 gap-6">
                        <div className="p-4 bg-orange-500/10 rounded-full text-orange-500 mb-2">
                            <AlertTriangle size={48} />
                        </div>

                        <div className="max-w-md">
                            <h3 className="text-2xl font-bold text-white mb-2">Session Restored</h3>
                            <p className="text-gray-400 mb-2">
                                The persistent queue remembered this song, but the browser lost permission to access the file after reload.
                            </p>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-4">
                                <p className="text-sm font-mono text-orange-300 break-all">{currentItem.fileName}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => restoreFileRef.current?.click()}
                                disabled={isRestoring}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 font-semibold transition-all border border-white/10"
                            >
                                {isRestoring ? <RefreshCw className="animate-spin" size={20} /> : <FileVideo size={20} />}
                                Re-Select File
                            </button>

                            <button
                                onClick={() => restoreFolderRef.current?.click()}
                                disabled={isRestoring}
                                className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl flex items-center gap-2 font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                            >
                                {isRestoring ? <RefreshCw className="animate-spin" size={20} /> : <FolderOpen size={20} />}
                                Re-Select Folder
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Select the folder containing your songs to restore access to all of them at once.
                        </p>
                    </div>
                )
            )}
            {/* Debug overlay (optional, commented out) */}
            {/* <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs p-1">
          {currentItem.type}: {currentItem.title}
       </div> */}
        </div>
    );
}
