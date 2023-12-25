import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./taskCard";

 export const CustomInput = ({onSubmit, placeholder, text, defaultValue, buttonText, setIsCustomInput }) => {
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
    <div className="">
     <form
      className="form-control w-[300px] bg-columnBackgroundColor p-2 rounded-md"
      onSubmit={submission}
        >
      <input
        type="text"
        value={inputText}
        placeholder={placeholder || text}
        onChange={(event) => setInputText(event.target.value)}
        autoFocus
        className="input text-gray-400 bg-mainBackgroundColor"
      />
      <div className="flex gap-x-4 p-2">
        <button className="btn btn-md bg-columnBackgroundColor hover:bg-mainBackgroundColor text-gray-100 px-8" type="submit">{buttonText || "Add"}</button>
        <a onClick={() => setIsCustomInput(false)} className="btn btn-md bg-columnBackgroundColor hover:bg-mainBackgroundColor text-gray-100 px-8">cancel</a>
    
      </div>
    </form>
    </div>
  )
}

function ColumnContainer({
  column,
  deleteColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}) {
  // const [editMode, setEditMode] = useState(false);
  const [isCustomInput, setIsCustomInput] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    // disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-columnBackgroundColor
      opacity-40
      border-2
      border-blue-500
      w-[300px]
      rounded-md
      h-[350px]
      max-h-[350px]
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
    bg-columnBackgroundColor
      w-[300px]
      h-[350px]
      max-h-[500px]
      rounded-2xl
      flex
      flex-col
      "
        >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
 
        className="
      bg-mainBackgroundColor
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-columnBackgroundColor
        border-4
        flex
        items-center
        justify-between
        "
        >
        <div className="flex gap-2">
          <div
            className="
        flex
        justify-center
        items-center
        
        px-2
        py-1
        text-sm
        rounded-full
        "
          >
            {tasks.length}
          </div>
          { column.title}

        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
          hover:opacity-100
        stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px-1
        py-2
        "
        
        >
          <i className='pi pi-trash text-md mt-1'></i>
        </button>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-3 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
   {!isCustomInput ?  (<button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-blue-500 text-gray-600 active:bg-black"
        onClick={() => {
          setIsCustomInput(true)
        }}
      >
      <i className='pi pi-plus text-md'></i>
        Add task
      </button>) :
      <CustomInput 
      setIsCustomInput={setIsCustomInput}
      text="+ Add Card"
      placeholder="Enter Card Title"
      displayClass="board-add-card"
      editClass="board-add-card-edit"
      onSubmit={(value) => createTask(column.id, value)}
      />}
    </div>
  );
}

export default ColumnContainer;