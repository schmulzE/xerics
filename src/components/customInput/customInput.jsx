import { useState } from "react";

// import { X } from "react-feather";

import "./customInput.css";

function CustomInput(props) {
  const {
    text,
    onSubmit,
    displayClass,
    editClass,
    placeholder,
    defaultValue,
    buttonText,
  } = props;
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputText, setInputText] = useState(defaultValue || "");

  const submission = (e) => {
    e.preventDefault();
    if (inputText && onSubmit) {
      setInputText("");
      onSubmit(inputText);
    }
    setIsCustomInput(false);
  };

  return (
    <div className="custom-input">
      {isCustomInput ? (
        <form
          className={`custom-input-edit ${editClass ? editClass : ""}`}
          onSubmit={submission}
        >
          <input
            type="text"
            value={inputText}
            placeholder={placeholder || text}
            onChange={(event) => setInputText(event.target.value)}
            autoFocus
            className="bg-mainBackgroundColor border-mainBackgroundColor hover:bg-mainBackgroundColor"
          />
          <div className="flex space-x-2">
            <button className="btn btn-md bg-columnBackgroundColor hover:bg-columnBackgroundColor text-gray-100 px-8" type="submit">{buttonText || "Add"}</button>
        <a onClick={() => setIsCustomInput(false)} className="btn btn-md bg-columnBackgroundColor hover:bg-columnBackgroundColor text-gray-100 px-8">cancel</a>
          </div>
        </form>
      ) : (
        <p
          className={`custom-input-display ${displayClass ? displayClass : ""}`}
          onClick={() => setIsCustomInput(true)}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export default CustomInput;