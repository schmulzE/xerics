import { useMemo, useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
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
    <>
     <form
      className={`form-control w-72 bg-base-100 p-2 rounded-md`}
      onSubmit={submission}
      >
      <input
        type="text"
        value={inputText}
        placeholder={placeholder || text}
        onChange={(event) => setInputText(event.target.value)}
        autoFocus
        className="input input-sm bg-base-100"
      />
      <div className="flex gap-x-4 p-2">
        <button className="btn btn-md bg-base-100 px-8" type="submit">{buttonText || "Add"}</button>
        <a onClick={() => setIsCustomInput(false)} className="btn btn-md bg-base-100 hover:bg-base-300 px-8">cancel</a>
      </div>
    </form>
    </>
  )
}

// eslint-disable-next-line no-unused-vars
function Board({board, createTask, tasks, deleteTask, updateTask, projectContributors}) {
  const [isCustomInput, setIsCustomInput] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {setNodeRef, attributes, listeners, transform, transition  } = useSortable({id: board.id, data: { type: "Column", board } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 h-[350px] max-h-[500px] rounded-2xl flex flex-col mt-4">
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
 
        className="text-md bg-base-100 h-[60px] cursor-default rounded-md rounded-b-none p-3 font-medium capitalize flex items-center justify-between">
        <div className="flex justify-between w-full">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span>{ board.title}</span>
            <div className="px-1.5 bg-orange-200 text-orange-600 text-xs rounded-sm">
              <span className="">{tasks.length}</span>
            </div>
          </div>
          <div>
            <button>
              <i className="pi pi-plus text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-3 overflow-x-hidden overflow-y-auto bg-base-100">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
              projectContributors={projectContributors}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      {!isCustomInput ?  (<button
        className="
        flex 
        gap-2 
        items-center 
        border-dashed 
        border-2 
        rounded-md
        mt-4
        p-2 
        bg-base-100 
        hover:text-blue-500 
        text-sm 
        justify-center 
        content-center"
        onClick={() => {
          setIsCustomInput(true)
        }}
      >
      <i className='pi pi-plus text-sm'></i>
        Add task
      </button>) :
      <CustomInput 
      setIsCustomInput={setIsCustomInput}
      text="+ Add Card"
      placeholder="Enter Card Title"
      displayClass="board-add-card"
      editClass="board-add-card-edit"
      onSubmit={(value) => createTask(board.id, value)}
      />}
    </div>
  );
}

export default Board;