import os

def get_base_path():
    """Return the path to the root directory of the project."""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_cwd():
    """Return the path to the current working directory."""
    return os.getcwd()

def get_logs_path():
    """Return the path to the Logs directory."""
    return os.path.join(get_base_path(), 'logs')

def get_config_path():
    """Return the path to the Config directory."""
    return os.path.join(get_base_path(), 'config')

def get_input_path():
    """Return the path to the Input directory."""
    return os.path.join(get_base_path(), 'Input')

def get_output_path():
    """Return the path to the Output directory."""
    return os.path.join(get_base_path(), 'Output')
