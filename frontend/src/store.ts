import { create } from 'zustand';

interface BearStoreState {
  openEditModel: boolean;
  handleEditModel: () => void;
  videoData: {
    source: string;
    videoRef: React.RefObject<HTMLVideoElement> | null; 
  };
  setVideoData: (data: BearStoreState['videoData']) => void; 
}

const useBearStore = create<BearStoreState>((set) => ({
  openEditModel: false,
  handleEditModel: () => set((state) => ({ ...state, openEditModel: !state.openEditModel })),
  videoData: { source: '', videoRef: null },
  setVideoData: (data) => set({ videoData: data }),
}));

export {useBearStore}