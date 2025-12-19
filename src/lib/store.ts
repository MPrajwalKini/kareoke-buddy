import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlaylistItem } from './types';

interface PlayerState {
    playlist: PlaylistItem[];
    currentIndex: number;
    isPlaying: boolean;
    volume: number;
    // Web: Map<filename, File object>. Mobile: Map<filename, uri string>
    // Note: This map is NOT persisted because File objects are not serializable to localStorage
    fileMap: Map<string, any>;

    // Actions
    setPlaylist: (items: PlaylistItem[]) => void;
    play: () => void;
    pause: () => void;
    next: () => void;
    prev: () => void;
    jumpTo: (index: number) => void;
    updateStatus: (id: string, status: PlaylistItem['status']) => void;
    addFileToMap: (name: string, fileOrUrl: any) => void;
    addToQueue: (item: PlaylistItem) => void;
    removeFromQueue: (id: string) => void;
    reorderQueue: (newOrder: PlaylistItem[]) => void;
    clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            playlist: [],
            currentIndex: -1,
            isPlaying: false,
            volume: 1,
            fileMap: new Map(),

            setPlaylist: (items) => set({ playlist: items, currentIndex: 0, isPlaying: false }),
            addToQueue: (item) => set((state) => ({
                playlist: [...state.playlist, item],
                currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex
            })),
            removeFromQueue: (id) => set((state) => {
                const newPlaylist = state.playlist.filter(item => item.id !== id);
                let newIndex = state.currentIndex;
                if (newIndex >= newPlaylist.length) newIndex = newPlaylist.length - 1;
                // If playlist becomes empty, reset index
                if (newPlaylist.length === 0) newIndex = -1;
                return { playlist: newPlaylist, currentIndex: newIndex };
            }),
            reorderQueue: (newOrder) => set({ playlist: newOrder }),
            clearQueue: () => set({ playlist: [], currentIndex: -1, isPlaying: false }),

            play: () => set({ isPlaying: true }),
            pause: () => set({ isPlaying: false }),

            next: () => {
                const { playlist, currentIndex } = get();
                if (currentIndex < playlist.length - 1) {
                    set({ currentIndex: currentIndex + 1, isPlaying: true });
                } else {
                    set({ isPlaying: false });
                }
            },

            prev: () => {
                const { currentIndex } = get();
                if (currentIndex > 0) {
                    set({ currentIndex: currentIndex - 1, isPlaying: true });
                }
            },

            jumpTo: (index) => {
                const { playlist } = get();
                if (index >= 0 && index < playlist.length) {
                    set({ currentIndex: index, isPlaying: true });
                }
            },

            updateStatus: (id, status) => {
                set((state) => ({
                    playlist: state.playlist.map(item => item.id === id ? { ...item, status } : item)
                }));
            },

            addFileToMap: (name, url) => {
                set((state) => {
                    const newMap = new Map(state.fileMap);
                    newMap.set(name, url);
                    return { fileMap: newMap };
                });
            }
        }),
        {
            name: 'player-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({
                // ONLY persist these fields. 
                // We deliberately exclude fileMap because File objects die on reload.
                // We exclude isPlaying so it doesn't auto-start on reload.
                playlist: state.playlist,
                currentIndex: state.currentIndex,
                volume: state.volume
            }),
        }
    )
);
