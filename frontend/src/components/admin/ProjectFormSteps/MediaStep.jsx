import React, { useRef, useState } from 'react';
import { ArrowUpTrayIcon, XMarkIcon, PhotoIcon, EyeIcon } from '@heroicons/react/24/outline';
import CloudinaryUploadService from '../../../services/CloudinaryUploadService';

const MediaStep = ({ formData, onChange, errors = {} }) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    console.log('handleImageUpload called with files:', files);
    console.log('Number of files:', files.length);

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        console.log(`Processing file ${index}:`, file.name, file.type, file.size);

        const validation = CloudinaryUploadService.validateImage(file);
        console.log('File validation:', validation);

        if (!validation.valid) {
          throw new Error(validation.error);
        }

        return await CloudinaryUploadService.uploadImage(file, {
          folder: 'portfolio/projects',
          tags: ['portfolio', 'project'],
          onProgress: (progress) => {
            const progressPercent = progress ? Math.round((progress.loaded / progress.total) * 100) : 0;
            console.log(`Upload progress for ${file.name}:`, progressPercent, '%');
            setUploadProgress(progressPercent);
          }
        });
      });

      console.log('Starting upload promises...');
      const uploadedImages = await Promise.all(uploadPromises);
      console.log('All uploads completed:', uploadedImages);

      const newImages = uploadedImages.map(img => ({
        url: img.url,
        publicId: img.publicId,
        caption: '',
        type: 'screenshot'
      }));

          const updatedFormData = {
        ...formData,
        images: [...(formData.images || []), ...newImages]
      };

      console.log('Updated form data before onChange:', updatedFormData);
      onChange(updatedFormData);

      setUploadProgress(0);
      console.log('Images successfully added to form data');
    } catch (error) {
      console.error('Error uploading images:', error);

      // Show a more user-friendly error message
      if (error.message.includes('Upload preset not found')) {
        alert('Image upload configuration issue. Please check your Cloudinary settings. You can save the project without images for now.');
      } else {
        alert(`Upload failed: ${error.message}`);
      }

      // Don't prevent the user from continuing - images are optional
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    onChange({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const updateImage = (index, updates) => {
    const updatedImages = formData.images.map((img, i) =>
      i === index ? { ...img, ...updates } : img
    );
    onChange({
      ...formData,
      images: updatedImages
    });
  };

  const setAsCover = (index) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      type: i === index ? 'cover' : 'screenshot'
    }));
    onChange({
      ...formData,
      images: updatedImages
    });
  };

  const imageTypes = [
    { value: 'cover', label: 'Cover', icon: '🖼️', description: 'Main project image' },
    { value: 'screenshot', label: 'Screenshot', icon: '📸', description: 'Project screenshot' },
    { value: 'diagram', label: 'Diagram', icon: '📊', description: 'Architecture diagram' },
    { value: 'mockup', label: 'Mockup', icon: '🎨', description: 'Design mockup' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500/20 to-cyan-400/20 border border-white/10 backdrop-blur-sm mb-4">
          <span className="text-2xl">🖼️</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Media & Images</h2>
        <p className="text-white/60">Add visual content to showcase your project</p>
      </div>

      {/* Upload Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Upload Images</h3>

        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            ${dragActive
              ? 'border-sky-500 bg-sky-500/10'
              : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            disabled={uploadingImage}
            className="hidden"
            id="image-upload"
          />

          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-4 rounded-full transition-all duration-300
              ${uploadingImage
                ? 'bg-sky-500/20 animate-pulse'
                : dragActive
                ? 'bg-sky-500/20'
                : 'bg-white/10'
              }
            `}>
              {uploadingImage ? (
                <div className="animate-spin h-8 w-8 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <ArrowUpTrayIcon className="h-8 w-8 text-white/60" />
              )}
            </div>

            <div>
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-xl hover:from-sky-600 hover:to-cyan-500 transition-all duration-300 font-medium"
              >
                {uploadingImage ? 'Uploading...' : 'Choose Images'}
              </label>
              <p className="mt-2 text-sm text-white/60">
                or drag and drop files here
              </p>
              <p className="text-xs text-white/40 mt-1">
                Supports JPG, PNG, GIF, WebP up to 10MB each
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {uploadingImage && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-white/60 mt-2">{uploadProgress}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      {formData.images && formData.images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Image Gallery ({formData.images.length})
            </h3>
            <p className="text-sm text-white/60">
              {formData.images.filter(img => img.type === 'cover').length} cover image
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm group">
                {/* Image Preview */}
                <div className="relative aspect-video bg-slate-800/50">
                  <img
                    src={image.url}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Image Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(image.url, '_blank')}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      title="View full size"
                    >
                      <EyeIcon className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Remove image"
                    >
                      <XMarkIcon className="h-4 w-4 text-red-400" />
                    </button>
                  </div>

                  {/* Cover Badge */}
                  {image.type === 'cover' && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-sky-500/20 border border-sky-500/30 rounded-lg text-xs text-sky-300 font-medium backdrop-blur-sm">
                      🖼️ Cover
                    </div>
                  )}
                </div>

                {/* Image Details */}
                <div className="p-4 space-y-3">
                  {/* Image Type */}
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1">Image Type</label>
                    <select
                      value={image.type}
                      onChange={(e) => updateImage(index, { type: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-sky-500/50 focus:bg-white/10 transition-all duration-300"
                    >
                      {imageTypes.map(type => (
                        <option key={type.value} value={type.value} className="bg-slate-800">
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-1">Caption</label>
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => updateImage(index, { caption: e.target.value })}
                      placeholder="Add image caption..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:border-sky-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAsCover(index)}
                      className={`
                        flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                        ${image.type === 'cover'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      {image.type === 'cover' ? '✓ Cover Image' : 'Set as Cover'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!formData.images || formData.images.length === 0) && (
        <div className="text-center py-12">
          <PhotoIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 mb-2">No images uploaded yet</p>
          <p className="text-sm text-white/40">Add images to showcase your project visually</p>
        </div>
      )}
    </div>
  );
};

export default MediaStep;