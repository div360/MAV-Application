import React from 'react'
import testVideo from '../assets/test-video.mp4'

interface VideoComponentProps {
  videoRef:React.RefObject<HTMLVideoElement>
  
}


const VideoComponent:React.FC<VideoComponentProps> = ({videoRef}) => {
  return (
    <div className='mt-[10vh] bg-transparent overflow-hidden min-h-[60vh] max-h-[60vh] min-w-[60vw] max-w-[60vw]'>
      <video ref={videoRef} src={testVideo}></video>
    </div>
  )
}

export default VideoComponent
