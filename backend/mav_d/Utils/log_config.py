import os
import json
import logging
import logging.config
from Utils.get_path import get_config_path, get_logs_path

def configure_logging():
    '''Configure logging from json file.'''

    if not os.path.exists(get_logs_path()):
        os.makedirs(get_logs_path())
        
    json_file_path = os.path.join(get_config_path(), 'logging.json')
    
    with open(json_file_path, 'rt') as f:
        config = json.load(f)

    logging.config.dictConfig(config)

if __name__ == '__main__':
    configure_logging()
