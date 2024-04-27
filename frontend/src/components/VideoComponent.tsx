import React, { useRef } from 'react';
import EditModal from './EditModal';
import { useBearStore } from '../store';

interface VideoComponentProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ videoRef }) => {
  // const [videoPresent, setVideoPresent] = useState(false);
  // const [videoSource, setVideoSource] = useState('');
  const { videoData, setVideoData } = useBearStore();
  // const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null); 


  // Event handler for video file selection
  const handleVideoSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoData({ source: fileUrl, videoRef: videoRef }); 
    }
  };

  // Opens the file selection dialog
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mt-[10vh] bg-transparent overflow-hidden min-h-[60vh] max-h-max min-w-[60vw] max-w-[60vw] flex justify-center items-center">
      {/* Display this button before a video is selected */}
      {!videoData.source && (
          <button onClick={openFileSelector} className='text-white border-2 border-white border-dashed p-5 rounded-xl'><p>Select a Video</p></button>
      )}

      {/* Conditionally render the video component */}
      {videoData.source && (
        <video ref={videoRef} src={videoData.source} ></video>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="video/*" // Accept video files
        ref={fileInputRef}
        onChange={handleVideoSelection}
        style={{ display: 'none' }}
      />
      <EditModal/>
    </div>
  );
};

export default VideoComponent;
