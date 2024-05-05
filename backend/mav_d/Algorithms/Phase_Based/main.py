'''
Phase Based Algorithm entry point
'''

import os
import logging
from .utils import load_video, resize_video, difference_of_iir, process_and_amplify, write_video
from Utils.get_path import get_input_path

logger = logging.getLogger("MAV_SIH")

def phaseBasedAlgorithm(input_video_name: str, magnification_factor: int):
    try:
        logger.info("Phase Based Algorithm started")
        
        input_video_path = os.path.join(get_input_path(), input_video_name)
        if(not os.path.exists(input_video_path)):
            logger.error("Input video not found")
            return
        
        video = load_video(input_video_path)
        
        resized_video = resize_video(video, 256)
        
        '''Parameters for phase based algorithm'''       
        magnification_factor = magnification_factor
        fl = 0.04
        fh = 0.4
        fs = 1
        attenuate_other_frequencies = True
        pyramid_type = "octave"
        sigma = 5
        temporal_filter = difference_of_iir
        
        result = process_and_amplify(resized_video, magnification_factor, fl, fh, fs, attenuate_other_frequencies, pyramid_type, sigma, temporal_filter)
        
        write_video(input_video_name, result, 30, magnification_factor)
        
        logger.info("Phase Based Algorithm completed")
        
    except Exception as e:
        logger.error(str(e))
        
    