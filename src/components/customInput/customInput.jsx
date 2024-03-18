import { useState } from "react";

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
    <div className="w-full">
      {isCustomInput ? (
        <form
          className={`form-control ${editClass ? editClass : ""}`}
          onSubmit={submission}
        >
          {placeholder == "Enter description" ? (
            <textarea 
            placeholder={placeholder}
            className="outline-none border p-2 text-sm w-full" 
            name="comment" 
            id="comment" 
            rows="2"
            defaultValue={inputText}
            >
          </textarea>
          ) :(<input
            type="text"
            defaultValue={inputText}
            placeholder={placeholder || text}
            onChange={(event) => setInputText(event.target.value)}
            autoFocus
            className="input bg-base-100 w-full input-sm rounded-sm"
          />)}
          <div className="flex space-x-2 mt-4">
            <button className="btn btn-sm px-8" type="submit">{buttonText || "Add"}</button>
            <a onClick={() => setIsCustomInput(false)} className="btn btn-sm  px-8">cancel</a>
          </div>
        </form>
      ) : (
        <button
          className={`p-1 ${displayClass ? displayClass : ""}`}
          onClick={() => setIsCustomInput(true)}
        >
          {text}
        </button>
      )}
    </div>
  );
}

export default CustomInput;