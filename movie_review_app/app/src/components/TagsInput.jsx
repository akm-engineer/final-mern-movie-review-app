import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

// TagsInput Component
export default function TagsInput({ name, value, onChange }) {
  // State for the currently typed tag
  const [tag, setTag] = useState("");

  // State for the list of tags
  const [tags, setTags] = useState([]);

  // Ref for the input element
  const input = useRef();

  // Ref for the tags input container
  const tagsInput = useRef();

  // Function to handle changes in the input value
  const handleOnChange = ({ target }) => {
    const { value } = target;
    if (value !== ",") setTag(value);

    // Calling the parent's onChange function with the current tags
    onChange(tags);
  };

  // Function to handle key events in the input
  const handleKeyDown = ({ key }) => {
    if (key === "," || key === "Enter") {
      if (!tag) return;

      if (tags.includes(tag)) return setTag("");

      // Adding the new tag to the list of tags
      setTags([...tags, tag]);

      // Clearing the input for the next tag
      setTag("");
    }

    if (key === "Backspace" && !tag && tags.length) {
      // Removing the last tag when Backspace is pressed and the input is empty
      const newTags = tags.filter((_, index) => index !== tags.length - 1);
      setTags([...newTags]);
    }
  };

  // Function to remove a tag when clicked
  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags([...newTags]);
  };

  // Function to handle focus on the input
  const handleOnFocus = () => {
    tagsInput.current.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.add("dark:border-white", "border-primary");
  };

  // Function to handle blur on the input
  const handleOnBlur = () => {
    tagsInput.current.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.remove("dark:border-white", "border-primary");
  };

  // useEffect to initialize tags from the external value
  useEffect(() => {
    if (value.length) setTags(value);
  }, [value]);

  // useEffect to scroll into view when a new tag is added
  useEffect(() => {
    input.current?.scrollIntoView(false);
  }, [tag]);

  // Rendering the TagsInput component
  return (
    <div>
      {/* Container for the tags input */}
      <div
        ref={tagsInput}
        onKeyDown={handleKeyDown}
        className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
      >
        {/* Rendering individual tags */}
        {tags.map((t) => (
          <Tag onClick={() => removeTag(t)} key={t}>
            {t}
          </Tag>
        ))}
        {/* Input for typing new tags */}
        <input
          ref={input}
          type="text"
          id={name}
          className="h-full flex-grow bg-transparent outline-none dark:text-white"
          placeholder="Tag one, Tag two"
          value={tag}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
}

// Tag Component
const Tag = ({ children, onClick }) => {
  return (
    <span className="dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1 whitespace-nowrap">
      {/* Displaying the tag text */}
      {children}
      {/* Button to remove the tag */}
      <button onClick={onClick} type="button">
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};
