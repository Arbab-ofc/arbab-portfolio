import { useState } from 'react';
import { HiDocumentDownload, HiTrash, HiEye, HiCloudUpload, HiCheckCircle, HiXCircle, HiDocument } from 'react-icons/hi';
import { resumeAPI } from '../../utils/api';

// Resume upload component with PDF management functionality

const ResumeUpload = ({ resumes, onRefresh }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = {
      title: `Resume - ${new Date().toLocaleDateString()}`,
      description: '',
      resume: file,
    };

    try {
      await resumeAPI.upload(formData);
      setSuccess('Resume uploaded successfully!');
      event.target.value = ''; // Clear file input
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeAPI.delete(id);
      setSuccess('Resume deleted successfully!');
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await resumeAPI.toggleStatus(id);
      setSuccess('Resume status updated successfully!');
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update resume status');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-4 xs:p-5 sm:p-6 backdrop-blur-xl shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <HiCloudUpload className="mr-2 text-sky-200" />
          Upload Resume
        </h3>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-4 xs:p-6 text-center bg-white/5">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className={`cursor-pointer inline-flex items-center px-4 xs:px-6 py-2.5 xs:py-3 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Uploading...' : 'Choose PDF File'}
            </label>
            <p className="mt-3 text-xs sm:text-sm text-white/60">
              Only PDF files up to 5MB are allowed
            </p>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-sky-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="flex items-center text-rose-300 text-sm bg-rose-500/10 rounded-xl p-3">
              <HiXCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center text-emerald-300 text-sm bg-emerald-500/10 rounded-xl p-3">
              <HiCheckCircle className="mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>
      </div>

      {/* Resume List */}
      <div className="rounded-3xl border border-white/10 bg-white/10 p-4 xs:p-5 sm:p-6 backdrop-blur-xl shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Uploaded Resumes
        </h3>

        {resumes.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <HiDocument className="mx-auto h-12 w-12 text-white/40 mb-3" />
            <p className="text-sm">No resumes uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className={`rounded-2xl border p-4 xs:p-5 ${
                  resume.isActive
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <HiDocument className="h-5 w-5 text-white/40 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-white truncate">
                          {resume.title}
                        </h4>
                        <p className="text-sm text-white/60 mt-1">
                          {resume.fileName} • {formatFileSize(resume.fileSize)}
                        </p>
                        {resume.description && (
                          <p className="text-sm text-white/50 mt-2 line-clamp-2">
                            {resume.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {resume.isActive && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                      <span className="text-xs text-white/50">
                        {new Date(resume.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 xs:gap-3 xs:ml-4">
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-sky-200 hover:text-sky-100 hover:bg-sky-500/20 rounded-xl transition-all duration-200"
                      title="View Resume"
                    >
                      <HiEye className="h-4 w-4" />
                    </a>
                    <a
                      href={resume.fileUrl}
                      download
                      className="p-2.5 text-emerald-200 hover:text-emerald-100 hover:bg-emerald-500/20 rounded-xl transition-all duration-200"
                      title="Download Resume"
                    >
                      <HiDocumentDownload className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleToggleActive(resume._id)}
                      className={`p-2.5 rounded-xl transition-all duration-200 ${
                        resume.isActive
                          ? 'text-white/60 hover:text-white hover:bg-white/10'
                          : 'text-emerald-200 hover:text-emerald-100 hover:bg-emerald-500/20'
                      }`}
                      title={resume.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {resume.isActive ? (
                        <HiXCircle className="h-4 w-4" />
                      ) : (
                        <HiCheckCircle className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="p-2.5 text-rose-200 hover:text-rose-100 hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                      title="Delete Resume"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;