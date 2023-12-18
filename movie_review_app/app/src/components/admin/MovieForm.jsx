import React, { useEffect, useState } from "react";
import { useNotification } from "../../hooks";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";
import { commonInputClasses } from "../../utils/theme";
import { validateMovie } from "../../utils/validator";
import DirectorSelector from "../DirectorSelector";
import CastForm from "../form/CastForm";
import Submit from "../form/Submit";
import GenresSelector from "../GenresSelector";
import Label from "../Label";
import LabelWithBadge from "../LabelWithBadge";
import CastModal from "../models/CastModal";
import GenresModal from "../models/GenresModal";
import WritersModal from "../models/WritersModal";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import TagsInput from "../TagsInput";
import ViewAllBtn from "../ViewAllButton";
import WriterSelector from "../WriterSelector";

// Default movie information to reset the form
const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

// Main component for Movie Form
export default function MovieForm({ busy, initialState, onSubmit, btnTitle }) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");
  const [showGenresModal, setShowGenresModal] = useState(false);

  const { updateNotification } = useNotification();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification("error", error);

    // cast, tags, genres, writers
    const { tags, genres, cast, writers, director, poster } = movieInfo;

    const formData = new FormData();
    const finalMovieInfo = {
      ...movieInfo,
    };

    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    if (director.id) finalMovieInfo.director = director.id;
    if (poster) finalMovieInfo.poster = poster;

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    onSubmit(formData);
  };

  // Update UI with selected poster
  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };

  // Handle form input change
  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === "poster") {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }

    setMovieInfo({ ...movieInfo, [name]: value });
  };

  // Update tags state
  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };

  // Update director state
  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };

  // Update cast state
  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  // Update genres state
  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };

  // Update writers state
  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          "warning",
          "This profile is already selected!"
        );
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  // Hide and display modal functions
  const hideWritersModal = () => {
    setShowWritersModal(false);
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  // Handle writer removal
  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter(({ id }) => id !== profileId);
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  // Handle cast removal
  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  // Effect to populate form with initial state
  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        releseDate: initialState.releseDate.split("T")[0],
        poster: null,
      });
      setSelectedPosterForUI(initialState.poster);
    }
  }, [initialState]);

  const {
    title,
    storyLine,
    writers,
    cast,
    tags,
    releseDate,
    genres,
    type,
    language,
    status,
  } = movieInfo;

  return (
    <>
      <div onSubmit={handleSubmit} className="flex space-x-3">
        <div className="w-[70%] space-y-5">
          {/* Input for movie title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              value={title}
              onChange={handleChange}
              name="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl"
              }
              placeholder="Titanic"
            />
          </div>

          {/* Textarea for movie storyline */}
          <div>
            <Label htmlFor="storyLine">Story line</Label>
            <textarea
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              id="storyLine"
              className={commonInputClasses + " border-b-2 resize-none h-24"}
              placeholder="Movie storyline..."
            ></textarea>
          </div>

          {/* Tags input */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div>

          {/* Director selector */}
          <DirectorSelector onSelect={updateDirector} />

          {/* Writers section */}
          <div className="">
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllBtn>
            </div>
            <WriterSelector onSelect={updateWriters} />
          </div>

          {/* Cast section */}
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>

          {/* Release date input */}
          <input
            type="date"
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
            onChange={handleChange}
            name="releseDate"
            value={releseDate}
          />

          {/* Submit button */}
          <Submit
            busy={busy}
            value={btnTitle}
            onClick={handleSubmit}
            type="button"
          />
        </div>
        {/* Right side section for poster and selectors */}

        <div className="w-[30%] space-y-5">
          {/* Poster selector */}
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            lable="Select poster"
            accept="image/jpg, image/jpeg, image/png"
          />
          {/* Genres selector */}
          <GenresSelector badge={genres.length} onClick={displayGenresModal} />
          {/* Type, language, and status selectors */}
          <Selector
            onChange={handleChange}
            name="type"
            value={type}
            options={typeOptions}
            label="Type"
          />
          <Selector
            onChange={handleChange}
            name="language"
            value={language}
            options={languageOptions}
            label="Language"
          />
          <Selector
            onChange={handleChange}
            name="status"
            value={status}
            options={statusOptions}
            label="Status"
          />
        </div>
      </div>
      {/* Modals for writers, cast, and genres */}
      <WritersModal
        onClose={hideWritersModal}
        visible={showWritersModal}
        profiles={writers}
        onRemoveClick={handleWriterRemove}
      />

      <CastModal
        onClose={hideCastModal}
        casts={cast}
        visible={showCastModal}
        onRemoveClick={handleCastRemove}
      />
      <GenresModal
        onSubmit={updateGenres}
        visible={showGenresModal}
        onClose={hideGenresModal}
        previousSelection={genres}
      />
    </>
  );
}
