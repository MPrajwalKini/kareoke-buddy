'use client';

import React from 'react';
import { usePlayerStore } from '@/lib/store';
import { clsx } from 'clsx';
import { Play, Music, Youtube, AlertCircle, GripVertical, Trash2 } from 'lucide-react';
import { Reorder, AnimatePresence } from 'framer-motion';

export default function PlaylistQueue() {
    const { playlist, currentIndex, jumpTo, removeFromQueue, reorderQueue } = usePlayerStore();

    if (playlist.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                Queue is empty
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            <Reorder.Group axis="y" values={playlist} onReorder={reorderQueue} className="space-y-2">
                <AnimatePresence initial={false}>
                    {playlist.map((item, index) => {
                        const isActive = index === currentIndex;
                        const isPast = index < currentIndex;

                        return (
                            <Reorder.Item
                                key={item.id}
                                value={item}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={clsx(
                                    "group p-2 rounded-lg flex items-center gap-3 transition-all duration-200 border relative select-none",
                                    isActive
                                        ? "bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20",
                                    isPast && "opacity-50"
                                )}
                            >
                                {/* Drag Handle */}
                                <div className="cursor-grab active:cursor-grabbing p-1 text-gray-600 hover:text-gray-400">
                                    <GripVertical size={14} />
                                </div>

                                <div
                                    onClick={() => jumpTo(index)}
                                    className={clsx(
                                        "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold cursor-pointer shrink-0",
                                        isActive ? "bg-primary text-white" : "bg-white/10 text-gray-400"
                                    )}
                                >
                                    {isActive ? <Play size={12} fill="currentColor" /> : index + 1}
                                </div>

                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => jumpTo(index)}>
                                    <h4 className={clsx(
                                        "font-medium truncate text-sm",
                                        isActive ? "text-white" : "text-gray-300"
                                    )}>
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="truncate max-w-[120px]">{item.artist}</span>
                                        {item.type === 'YOUTUBE' ? (
                                            <span className="flex items-center gap-1 text-red-400"><Youtube size={10} /> YT</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-blue-400"><Music size={10} /> Local</span>
                                        )}
                                    </div>
                                </div>

                                {item.status === 'ERROR' && (
                                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                                )}

                                {/* Delete Action */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromQueue(item.id);
                                    }}
                                    className="p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </Reorder.Item>
                        );
                    })}
                </AnimatePresence>
            </Reorder.Group>
        </div>
    );
}
