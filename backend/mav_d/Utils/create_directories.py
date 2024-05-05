import os
import logging
from .get_path import get_input_path, get_output_path

logger = logging.getLogger("MAV_SIH")

def create_input_output_dir():
    '''Create Input and Output directories if not present'''
    
    try:
        logger.debug("Creating Input and Output directories")
        
        if(not os.path.exists(get_input_path())):
            os.mkdir(get_input_path())
            
        if(not os.path.exists(get_output_path())):
            os.mkdir(get_output_path())
    
    except Exception as e:
        print(str(e))
    