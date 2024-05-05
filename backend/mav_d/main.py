import logging
from Utils.log_config import configure_logging
from Utils.create_directories import create_input_output_dir
from Algorithms.Phase_Based.main import phaseBasedAlgorithm

def main():
    '''
    Main entry point of the application
    '''
    try:
        '''
        Important to call the configure_logging() once and logger setup must be done 
        in each file before any logging calls are made, as it sets up the root logger 
        with the configuration from the Config file
        '''
        
        configure_logging()
        logger = logging.getLogger("MAV")
    
        logger.info("Application started")
                
        create_input_output_dir()
        
        phaseBasedAlgorithm("machine_vid1.mp4", 40)
        
    except Exception as e:
        logger.error(str(e))


if __name__ == '__main__':
    
    main()
