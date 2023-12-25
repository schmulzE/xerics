import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDate } from "../Helper/Utils";
import { AlignLeft } from "react-feather";
import Chip from "./chip";
import CardInfo from "./card/cardInfo/cardInfo";

function TaskCard({ task, deleteTask, updateTask }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { title, desc, date, tasks, labels, } = task;
  const [cardTasks, setCardTasks] = useState([])
  // const [editMode, setEditMode] = useState(false);
  // const [showDropdown, setShowDropdown] = useState(true);


  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
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
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[90px] min-h-[100px] item-center flex text-left rounded-xl border-2 border-blue-500 cursor-grab relative
      "
      />
    );
  }


  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-mainBackgroundColor h-auto items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
       {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={task}
          cardTasks={cardTasks}
          setCardTasks={setCardTasks}
          // boardId={boardId}
          updateCard={updateTask}
        />
     )}
      
      <div
      className=" w-full card rounded-md text-gray-100 shadow-md relative cursor-grab group"
      onClick={() => {setShowModal(true)}}
      >
        {/* <figure>
          <img className="w-full p-1 rounded-lg" src={'https://images.pexels.com/photos/992734/pexels-photo-992734.jpeg?auto=compress&cs=tinysrgb&w=600'} alt="flowers" />
        </figure> */}
        <div className="card-body p-3">
          <div className="flex gap-x-2">

        {labels.map((item, index) => (
          <Chip key={index} item={item} />
        ))}
          </div>
        <h2 className="card-title text-sm font-bold">
          <AlignLeft />
          {title}
        </h2>
          <div>
          <p title={desc}>
          </p>
        </div>
        <div className="card-actions justify-start gap-3">
         {date && (<div className="text-xs text-gray-600 font-medium">
            <i className="pi pi-clock mr-1"></i>
            {formatDate(date)}
          </div>)}
          {tasks && tasks.length > 0 && (<div className="text-xs text-gray-600 font-medium">
            <i className="pi pi-check-square mr-1"></i>
            {tasks.filter((item) => item.completed).length}/{tasks.length}
          </div>)}
        </div>
        </div>
      </div>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-8 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <i className="pi pi-trash"></i>
        </button>
      )}
    </div>
  );
}

export default TaskCard;