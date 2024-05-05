import os
import math
import logging
import numpy as np
from skimage import img_as_float
from imageio import get_reader, get_writer
from Utils.get_path import get_output_path
from skimage.filters import gaussian
from skimage import transform as sktransform
import pyfftw.interfaces.scipy_fftpack as spfft
from numpy import array, ceil, cos, log2, linspace, meshgrid, pi, sqrt, zeros, arctan2, abs, complex64

logger = logging.getLogger("MAV_SIH")

def resize_video(video, new_size):
    '''Resize a video to a new size.'''
    
    try:        
        num_frames, h, w, num_channels = video.shape
        resized_video = np.zeros((num_frames, new_size, new_size, num_channels))
        for i in range(num_frames):
            resized_video[i] = sktransform.resize(video[i], (new_size,new_size))
        return resized_video
    
    except Exception as e:
        logger.error(str(e))
    
def RGB_to_YIQ(image):
    '''Convert an RGB image to YIQ color space.'''
    
    try:        
        yiq_from_rgb = array([[0.299     ,0.587      ,     0.114],
                      [0.59590059,-0.27455667,-0.32134392],
                      [0.21153661, -0.52273617,0.31119955]])
        
        image=img_as_float(image)         
        image=image.dot(yiq_from_rgb.T)   
        return image
    
    except Exception as e:
        logger.error(str(e))
     
def YIQ_to_RGB(image):
    '''Convert an RGB image to YIQ color space.'''
    
    try:            
        rgb_from_yiq = array([[1.0,0.956,0.619],
                      [1.0,-0.272,-0.647],
                      [1.0,-1.106,1.703]])
    
        image=img_as_float(image)
        image=image.dot(rgb_from_yiq.T)
        return image
    
    except Exception as e:
        logger.error(str(e))

def load_video(filename):
    '''Load a video into a numpy array.'''
    
    try:        
        reader = get_reader(filename)
        orig_vid = np.concatenate([img_as_float(im)[np.newaxis] for im in reader])
        return orig_vid
    
    except Exception as e:
        logger.error(str(e))

def write_video(filename, result, fps, magnification_factor):
    '''Write a numpy array to a video file.'''
    
    try:        
        filename = filename.replace(".mp4", "")
        
        filename = f"{filename}_phase_based_mg_{magnification_factor}.mp4"
        
        file_path = os.path.join(get_output_path(), filename)
        
        writer = get_writer(file_path, fps=fps)
        for frame in result:
            writer.append_data((frame * 255).astype(np.uint8))
        writer.close()

    except Exception as e:
        logger.error(str(e))
        
def amplitude_weighted_blur(x, weight, sigma):
    '''Blur an image with a Gaussian kernel with sigma scaled by the amplitude of the image.'''
    
    try:
        if sigma != 0:
            return gaussian(x*weight, sigma, mode="wrap") / gaussian(weight, sigma, mode="wrap")
        return x
    
    except Exception as e:
        logger.error(str(e))
        
def difference_of_iir(delta, rl, rh):
    '''Apply a difference of Infinite Impulse Response filter to a video.'''

    try:        
        lowpass_1 = delta[0].copy()
        lowpass_2 = lowpass_1.copy()
        out = zeros(delta.shape, dtype=delta.dtype)
        for i in range(1, delta.shape[0]):
            lowpass_1 = (1-rh)*lowpass_1 + rh*delta[i]
            lowpass_2 = (1-rl)*lowpass_2 + rl*delta[i]
            out[i] = lowpass_1 - lowpass_2
        return out
    
    except Exception as e:
        logger.error(str(e))
      
def simplify_phase(x):
    '''Simplify the phase of an image to the range [-pi, pi].'''

    try:
        return  ((x + pi) % (2*pi)) - pi
    
    except Exception as e:
        logger.error(str(e))
        
def max_scf_pyr_height(dims):
    '''Compute the maximum height of a steerable complex pyramid for a given image size.'''

    try:        
        return int(log2(min(dims[:2]))) - 2
 
    except Exception as e:
        logger.error(str(e))
  
def get_polar_grid(dims):
    '''Get a polar grid for a given image size.'''
    
    try:        
        center = ceil((array(dims))/2).astype(int)
        xramp, yramp = meshgrid(linspace(-1, 1, dims[1]+1)[:-1], linspace(-1, 1, dims[0]+1)[:-1])
        theta = arctan2(yramp, xramp)
        r = sqrt(xramp**2 + yramp**2)

        r[center[0], center[1]] = min((r[center[0], center[1]-1], r[center[0]-1, center[1]]))/2
        return theta,r
    
    except Exception as e:
        logger.error(str(e))

def get_angle_mask_smooth(index, num_bands, angle, is_complex):
    '''Get a mask for a given angle in a steerable complex pyramid.'''
    
    try:        
        order = num_bands-1
        const = sqrt((2**(2*order))*(math.factorial(order)**2)/(num_bands*math.factorial(2*order)))
        angle = simplify_phase(angle+(pi*index/num_bands))

        if is_complex:
            return const*(cos(angle)**order)*(abs(angle) < pi/2)
        else:
            return abs(sqrt(const)*(cos(angle)**order))
    
    except Exception as e:
        logger.error(str(e))

def get_filters_smooth_window(dims, orientations, cos_order=6, filters_per_octave=6, is_complex=True, pyr_height=-1):
    """
    A complex steerable filter generator with a smoother window. Better for 
    quarter octave or half octave decompositions.
    """
    
    try:        
        max_pyr_height = max_scf_pyr_height(dims)                                  
        if( pyr_height == -1 or pyr_height > max_pyr_height):
            pyr_height = max_pyr_height
        total_filter_count = filters_per_octave * pyr_height                        
        
        theta, r = get_polar_grid(dims)
        r = (log2(r) + pyr_height)*pi*(0.5 + (total_filter_count / 7)) / pyr_height

        window_function = lambda x, c: (abs(x - c) < pi/2).astype(int)
        compute_shift = lambda k: pi*(k/(cos_order+1)+2/7)

        rad_filters = []

        total = zeros(dims)
        a_constant = sqrt((2**(2*cos_order))*(math.factorial(cos_order)**2)/((cos_order+1)*math.factorial(2*cos_order)))
        for k in range(total_filter_count):
            shift = compute_shift(k+1)
            rad_filters += [a_constant*(cos(r-shift)**cos_order)*window_function(r,shift)]
            total += rad_filters[k]**2
        rad_filters = rad_filters[::-1]

        center = ceil(array(dims)/2).astype(int)
        low_dims = ceil(array(center+1.5)/4).astype(int)
        total_cropped = total[center[0]-low_dims[0]:center[0]+low_dims[0]+1, center[1]-low_dims[1]:center[1]+low_dims[1]+1]

        low_pass = zeros(dims)
        low_pass[center[0]-low_dims[0]:center[0]+low_dims[0]+1, center[1]-low_dims[1]:center[1]+low_dims[1]+1] = abs(sqrt(1+0j-total_cropped))
        total += low_pass**2
        high_pass = abs(sqrt(1+0j-total))

        anglemasks = []
        for i in range(orientations):
            anglemasks += [get_angle_mask_smooth(i, orientations, theta, is_complex)]

        out = [high_pass]
        for i in range(len(rad_filters)):
            for j in range(len(anglemasks)):
                out += [anglemasks[j]*rad_filters[i]]
        out += [low_pass]
        return out
    
    except Exception as e:
        logger.error(str(e))
        
def get_radial_mask_pair(r, rad, t_width):
    '''Get a pair of radial masks for a given radius in a steerable complex pyramid.'''
    
    try:        
        log_rad = log2(rad)-log2(r)
        hi_mask = abs(cos(log_rad.clip(min=-t_width, max=0)*pi/(2*t_width)))
        lo_mask = sqrt(1-(hi_mask**2))
        return (hi_mask, lo_mask)
    
    except Exception as e:
        logger.error(str(e))

def get_angle_mask(b, orientations, angle):
    '''Get a mask for a given angle in a steerable complex pyramid.'''
    
    try:        
        order = orientations - 1
        a_constant = sqrt((2**(2*order))*(math.factorial(order)**2)/(orientations*math.factorial(2*order)))
        angle2 = simplify_phase(angle - (pi*b/orientations))
        return 2*a_constant*(cos(angle2)**order)*(abs(angle2) < pi/2)
        
    except Exception as e:
        logger.error(str(e))

def get_filters(dims, r_vals=None, orientations=4, t_width=1):
    """
    Gets a steerbale filter bank in the form of a list of ndarrays
    dims: (h, w). Dimensions of the output filters. Should be the same size as the image 
    you're using these to filter
    r_vals: The boundary between adjacent filters. Should be an array.
        e.g.: 2**np.array(list(range(0,-7,-1)))
    orientations: The number of filters per level
    t-width: The falloff of each filter. Smaller t_widths correspond to thicker filters with 
    less falloff
    """
    
    try:        
        if r_vals is None:
            r_vals = 2**np.array(list(range(0,-max_scf_pyr_height(dims)-1,-1)))
        angle, r = get_polar_grid(dims)
        hi_mask, lo_mask_prev = get_radial_mask_pair(r_vals[0], r, t_width)
        filters = [hi_mask]
        for i in range(1, len(r_vals)):
            hi_mask, lo_mask = get_radial_mask_pair(r_vals[i], r, t_width)
            rad_mask = hi_mask * lo_mask_prev
            for j in range(orientations):
                angle_mask = get_angle_mask(j, orientations, angle)
                filters += [rad_mask*angle_mask/2]
            lo_mask_prev = lo_mask
        filters += [lo_mask_prev]
        return filters
    
    except Exception as e:
        logger.error(str(e))
        

def process_and_amplify(video, magnification_factor, fl, fh, fs, attenuate_other_frequencies=False, pyramid_type="octave", sigma=0, temporal_filter=difference_of_iir):
    '''Apply phase amplification to a video.'''
    
    try:
        num_frames, h, w, num_channels = video.shape
        pyr_height = max_scf_pyr_height((h, w))

        if pyramid_type == "octave":
            logger.debug("Using octave pyramid")
            filters = get_filters((h, w), 2**np.array(list(range(0,-pyr_height-1,-1)), dtype=float), 4)
        elif pyramid_type == "halfOctave":
            logger.debug("Using half octave pyramid")
            filters = get_filters((h, w), 2**np.array(list(range(0,-pyr_height-1,-1)), dtype=float), 8, t_width=0.75)
        elif pyramid_type == "smoothHalfOctave":
            logger.debug("Using smooth half octave pyramid")
            filters = get_filters_smooth_window((h, w), 8, filters_per_octave=2)
        elif pyramid_type == "quarterOctave":
            logger.debug("Using quarter octave pyramid")
            filters = get_filters_smooth_window((h, w), 8, filters_per_octave=4)
        else:
            logger.error("Invalid pyramid type")
            return None
        
        yiq_video = np.zeros((num_frames, h, w, num_channels))
        fft_video = np.zeros((num_frames, h, w), dtype=complex64)

        for i in range(num_frames):
            yiq_video[i] = RGB_to_YIQ(video[i])
            fft_video[i] = spfft.fftshift(spfft.fft2(yiq_video[i][:,:,0]))

        magnified_y_channel = np.zeros((num_frames, h, w), dtype=complex64)
        dc_frame_index = 0
        for i in range(1,len(filters)-1):
            logger.debug("Magnifying frequency band %d", i)

            dc_frame = spfft.ifft2(spfft.ifftshift(filters[i]*fft_video[dc_frame_index]))
            dc_frame_no_mag = dc_frame / np.abs(dc_frame)
            dc_frame_phase = np.angle(dc_frame)

            total = np.zeros(fft_video.shape, dtype=float)
            filtered = np.zeros(fft_video.shape, dtype=complex64)

            for j in range(num_frames):
                filtered[j] = spfft.ifft2(spfft.ifftshift(filters[i]*fft_video[j]))
                total[j] = simplify_phase(np.angle(filtered[j]) - dc_frame_phase)

            logger.debug("Bandpass filtering")
            total = temporal_filter(total, fl/fs, fh/fs).astype(float)

            for j in range(num_frames):
                phase_of_frame = total[j]
                if sigma != 0:
                    phase_of_frame = amplitude_weighted_blur(phase_of_frame, np.abs(filtered[j]), sigma)

                phase_of_frame *= magnification_factor

                if attenuate_other_frequencies:
                    temp_orig = np.abs(filtered[j])*dc_frame_no_mag
                else:
                    temp_orig = filtered[j]
                magnified_component = 2*filters[i]*spfft.fftshift(spfft.fft2(temp_orig*np.exp(1j*phase_of_frame)))

                magnified_y_channel[j] = magnified_y_channel[j] + magnified_component

        for i in range(num_frames):
                magnified_y_channel[i] = magnified_y_channel[i] + (fft_video[i]*(filters[-1]**2))

        out = np.zeros(yiq_video.shape)

        for i in range(num_frames):
            out_frame  = np.dstack((np.real(spfft.ifft2(spfft.ifftshift(magnified_y_channel[i]))), yiq_video[i,:,:,1:3]))
            out[i] = YIQ_to_RGB(out_frame)

        return out.clip(min=0, max=1)
    
    except Exception as e:
        logger.error(str(e))