import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadMovie, uploadTrailer } from "../../api/movie";
import { useNotification } from "../../hooks";
import ModalContainer from "../models/ModalContainer";
import MovieForm from "./MovieForm";

// Component for uploading movies, including trailer selection and form submission
export default function MovieUpload({ visible, onClose }) {
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState({});
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  const resetState = () => {
    setVideoSelected(false);
    setVideoUploaded(false);
    setUploadProgress(0);
    setVideoInfo({});
  };

  // Handle error when an unsupported file type is selected
  const handleTypeError = (error) => {
    updateNotification("error", `File type not supported: ${error}`);
  };

  // Handle the asynchronous upload of the trailer
  const handleUploadTrailer = async (data) => {
    const { error, url, public_id } = await uploadTrailer(
      data,
      setUploadProgress
    );
    if (error) return updateNotification("error", error);

    setVideoUploaded(true);
    setVideoInfo({ url, public_id });
  };

  // Handle change when a file is selected for the trailer
  const handleChange = (file) => {
    const formData = new FormData();
    formData.append("video", file);

    setVideoSelected(true);
    handleUploadTrailer(formData);
  };

  // Get the display value for the upload progress
  const getUploadProgressValue = () => {
    if (!videoUploaded && uploadProgress >= 100) {
      return "Processing";
    }

    return `Upload progress ${uploadProgress}%`;
  };

  // Handle form submission, including the uploaded trailer information
  const handleSubmit = async (data) => {
    if (!videoInfo.url || !videoInfo.public_id)
      return updateNotification("error", "Trailer is missing!");

    setBusy(true);
    data.append("trailer", JSON.stringify(videoInfo));
    const { error } = await uploadMovie(data);
    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", "Movie upload successfully.");
    resetState();
    onClose();
  };

  // Render the modal container with either the trailer selector or the movie form
  return (
    <ModalContainer visible={visible}>
      <div className="mb-5">
        {/* Display the upload progress */}
        <UploadProgress
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
          width={uploadProgress}
        />
      </div>
      {!videoSelected ? (
        // Render the trailer selector when a video is not yet selected
        <TrailerSelector
          visible={!videoSelected}
          onTypeError={handleTypeError}
          handleChange={handleChange}
        />
      ) : (
        // Render the movie form when the video is selected
        <MovieForm
          btnTitle="Upload"
          busy={busy}
          onSubmit={!busy ? handleSubmit : null}
        />
      )}
    </ModalContainer>
  );
}

// Component for selecting a trailer file
const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;

  return (
    <div className="h-full flex items-center justify-center">
      {/* Use the FileUploader component to handle file selection */}
      <FileUploader
        handleChange={handleChange}
        onTypeError={onTypeError}
        types={["mp4", "avi"]}
      >
        {/* Display the upload area */}
        <label className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex flex-col items-center justify-center dark:text-dark-subtle text-secondary cursor-pointer">
          <AiOutlineCloudUpload size={80} />
          <p>Drop your file here!</p>
        </label>
      </FileUploader>
    </div>
  );
};

// Component for displaying the upload progress
const UploadProgress = ({ width, message, visible }) => {
  if (!visible) return null;

  return (
    <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
      {/* Display the progress bar */}
      <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
        <div
          style={{ width: width + "%" }}
          className="h-full absolute left-0 dark:bg-white bg-secondary"
        />
      </div>
      {/* Display the progress message */}
      <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1">
        {message}
      </p>
    </div>
  );
};
