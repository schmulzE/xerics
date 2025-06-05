import PropTypes from 'prop-types';
import { CSS } from "@dnd-kit/utilities";
import Chip from "../../../components/ui/chip";
import { useSortable } from "@dnd-kit/sortable";
import Modal from "../../modal/components/modal";
import Avatar from "../../users/components/avatar";
import { useTaskCard } from '../hooks/useTasksCard.js';
import TaskCardInfo from "./taskCardInfo/taskCardInfo";
import { formatDate } from "../../../utils/dateFormatter.js";

function TaskCard({ task, deleteTask, updateTask, user }) {
  const {
    mouseIsOver,
    taskCard,
    selectedColor,
    isOpen,
    setMouseIsOver,
    setSelectedColor,
    updateTitle,
    updateDesc,
    addLabel,
    removeLabel,
    addSubTask,
    removeSubtask,
    updateSubtask,
    updateDate,
    openTaskModal,
    closeTaskModal
  } = useTaskCard({ task, user });

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const renderTaskCardInfo = (contentProps) => (
    <TaskCardInfo
      onClose={closeTaskModal}
      {...contentProps}
      updateTitle={updateTitle}
      updateDesc={updateDesc}
      updateSubtask={updateSubtask}
      removeSubtask={removeSubtask}
      addTask={addSubTask}
      removeLabel={removeLabel}
      addLabel={addLabel}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
      updateCard={updateTask}
      updateDate={updateDate}
    />
  );

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-base-300 p-2.5 h-[90px] min-h-[100px] item-center flex text-left rounded-xl border-2 border-gray-500 cursor-grab relative"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={"bg-base-100 h-auto items-center flex text-left rounded-xl border border-base-300 hover:border-0 hover:shadow-lg cursor-grab relative task"}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      {isOpen && (
        <Modal
          id={'task'}
          titleClass={'px-2 text-md'}
          renderContent={renderTaskCardInfo}
          modalClass="max-w-xl shadow-xl h-auto rounded-md overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 rounded-md -translate-x-1/2 -translate-y-1/2 bg-white z-[1000]"
        />
      )}
      
      <div
        className="w-full card rounded-md shadow-sm relative cursor-grab group"
        onClick={openTaskModal}
      >
        <div className="card-body p-3">
          <h2 className=" text-sm font-medium first-letter:uppercase">{taskCard.title}</h2>
          <div className="flex items-center gap-x-2">
            <p className="text-xs">{taskCard.description}</p>
          </div>
          <div className="flex gap-x-2">
            {taskCard.labels && taskCard.labels.map((item, index) => (
              <Chip key={index} item={item} />
            ))}
          </div>
          <div className="card-actions justify-between items-center">
            <div className="flex items-center justify-center content-center gap-x-2">
              {taskCard.date && (
                <div className="text-xs text-gray-600 font-medium">
                  <i className="pi pi-clock mr-1"></i>
                  {formatDate(taskCard.date)}
                </div>
              )}
              {taskCard.subtasks && (
                <div className="text-xs text-gray-600 font-medium">
                  <i className="pi pi-check-square mr-1"></i>
                  {taskCard.subtasks.filter((item) => item.completed).length}/{taskCard.subtasks.length}
                </div>
              )}
            </div>
            <Avatar avatar={user.avatar_url} firstname={user.firstname} className={'w-5 h-5 text-sm'} backgroundClass={'pb-1'}/>
          </div>
        </div>
      </div>

      {taskCard.profile_id == user.id && mouseIsOver ? (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-8 -translate-y-1/2 p-2 rounded opacity-60"
        >
          <i className="pi pi-trash"></i>
        </button>
      ): null}
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  projectContributors: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default TaskCard;