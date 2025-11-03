import axios from 'axios';

class CloudinaryUploadService {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    this.apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  }

  /**
   * Upload image to Cloudinary
   * @param {File} file - Image file to upload
   * @param {Object} options - Upload options
   * @returns {Promise} - Upload result with URL and public_id
   */
  async uploadImage(file, options = {}) {
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Starting upload for file:', file.name);
    console.log('Cloudinary config:', {
      cloudName: this.cloudName,
      uploadPreset: this.uploadPreset,
      apiKey: this.apiKey
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('cloud_name', this.cloudName);

    // Add optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    if (options.tags) {
      formData.append('tags', options.tags.join(','));
    }
    if (options.resource_type) {
      formData.append('resource_type', options.resource_type);
    }

    try {
      console.log('Sending request to Cloudinary...');
      console.log('Form data entries:', Array.from(formData.entries()));

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: options.onProgress,
        }
      );

      console.log('Cloudinary response:', response.data);

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        originalFilename: file.name,
        size: response.data.bytes,
        format: response.data.format,
        width: response.data.width,
        height: response.data.height,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);

      let errorMessage = 'Upload failed';
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Upload multiple images
   * @param {FileList|Array} files - Multiple image files
   * @param {Object} options - Upload options
   * @returns {Promise} - Array of upload results
   */
  async uploadMultipleImages(files, options = {}) {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = Array.from(files).map((file, index) => {
      return this.uploadImage(file, {
        ...options,
        onProgress: (progressEvent) => {
          if (options.onProgress) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            options.onProgress(progress, index, files.length);
          }
        },
      });
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Public ID of the image to delete
   * @returns {Promise} - Delete result
   */
  async deleteImage(publicId) {
    if (!publicId) {
      throw new Error('Public ID is required');
    }

    try {
      // Note: This requires authentication and should be done through your backend
      // for security reasons. This is just a placeholder implementation.
      const response = await axios.post(
        `/api/cloudinary/delete`,
        { publicId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(error.response?.data?.error?.message || 'Delete failed');
    }
  }

  /**
   * Get image info from URL
   * @param {string} url - Cloudinary image URL
   * @returns {Object} - Image info object
   */
  getImageInfo(url) {
    if (!url) return null;

    // Extract public_id from Cloudinary URL
    const cloudinaryRegex = /\/v\d+\/(.+?)\.[a-z]+$/;
    const match = url.match(cloudinaryRegex);

    if (match) {
      return {
        url,
        publicId: match[1],
      };
    }

    // If it's not a Cloudinary URL, return basic info
    return {
      url,
      publicId: null,
    };
  }

  /**
   * Generate optimized image URL
   * @param {string} url - Original Cloudinary URL
   * @param {Object} transformations - Image transformations
   * @returns {string} - Optimized URL
   */
  getOptimizedUrl(url, transformations = {}) {
    if (!url || !url.includes('cloudinary')) {
      return url;
    }

    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
    } = transformations;

    // Build transformation string
    const transformationParts = [];
    if (width) transformationParts.push(`w_${width}`);
    if (height) transformationParts.push(`h_${height}`);
    transformationParts.push(`c_${crop}`);
    transformationParts.push(`q_${quality}`);
    transformationParts.push(`f_${format}`);

    const transformationString = transformationParts.join(',');

    // Insert transformations into URL
    const urlParts = url.split('/upload/');
    if (urlParts.length === 2) {
      return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
    }

    return url;
  }

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @returns {Object} - Validation result
   */
  validateImage(file) {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 10MB.'
      };
    }

    return { valid: true };
  }

  /**
   * Create image preview from file
   * @param {File} file - Image file
   * @returns {Promise<string>} - Image data URL
   */
  createPreview(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

// Export singleton instance
export default new CloudinaryUploadService();

// Export named functions for easier usage
export const uploadImage = (file, options) => CloudinaryUploadService.uploadImage(file, options);
export const uploadMultipleImages = (files, options) => CloudinaryUploadService.uploadMultipleImages(files, options);
export const deleteImage = (publicId) => CloudinaryUploadService.deleteImage(publicId);
export const validateImage = (file) => CloudinaryUploadService.validateImage(file);
export const createPreview = (file) => CloudinaryUploadService.createPreview(file);