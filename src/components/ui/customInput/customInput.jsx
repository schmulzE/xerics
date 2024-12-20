import "./customInput.css";
import { useState } from "react";

function CustomInput({
  text,
  onSubmit,
  displayClass = "",
  editClass = "",
  placeholder,
  defaultValue = "",
  buttonText = "Add"
}) {
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputText, setInputText] = useState(defaultValue || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText && onSubmit) {
      onSubmit(inputText);
      setInputText("");
    }
    setIsCustomInput(false);
  };

  const renderInput = () => {
    if (placeholder === "Enter description") {
      return (
        <textarea 
          placeholder={placeholder}
          className="outline-none border p-2 text-sm w-full"
          name="comment" 
          id="comment" 
          rows="2"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      );
    }
    return (
      <input
        type="text"
        value={inputText}
        placeholder={placeholder || text}
        onChange={(e) => setInputText(e.target.value)}
        autoFocus
        className="input bg-base-100 w-full input-sm rounded-sm"
      />
    );
  };

  return (
    <div className="w-full">
      {isCustomInput ? (
        <form className={`form-control ${editClass}`} onSubmit={handleSubmit}>
          {renderInput()}
          <div className="flex space-x-2 mt-4">
            <button className="btn btn-sm px-8" type="submit">{buttonText}</button>
            <button type="button" onClick={() => setIsCustomInput(false)} className="btn btn-sm px-8">Cancel</button>
          </div>
        </form>
      ) : (
        <button
          className={`p-1 ${displayClass}`}
          onClick={() => setIsCustomInput(true)}
        >
          {text}
        </button>
      )}
    </div>
  );
}

export default CustomInput;