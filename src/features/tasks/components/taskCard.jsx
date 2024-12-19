import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import supabase from "../../../lib/supabase";
import Chip from "../../../components/ui/chip";
import { useSortable } from "@dnd-kit/sortable";
import Modal from "../../modal/components/modal";
import Avatar from "../../users/components/avatar";
import { useDispatch, useSelector } from 'react-redux';
import TaskCardInfo from "./taskCardInfo/taskCardInfo";
import { useToast } from "../../../components/ui/use-toast";
import { formatDate } from "../../../utils/dateFormatter.js";
import { updateTaskDesc, updateTaskTitle } from "../taskThunk";
import { openModal, closeModal } from '../../modal/modalSlice.js';
import { fetchTaskLabels, addTasksLabel, deleteTasksLabel } from "../../tasksLabel/tasksLabelThunks";
import { addSubtasks, fetchSubtasks, deleteSubtasks, updateSubtasks } from "../../tasksSubtasks/tasksSubtasksThunks";
// eslint-disable-next-line no-unused-vars
function TaskCard({ task, deleteTask, updateTask, projectContributors, user }) {
  let uuid = uuidv4();
  const toast = useToast();
  const dispatch = useDispatch();
  const labels = useSelector(state => state.tasksLabel.labels);
  const subtasks = useSelector(state => state.tasksSubtasks.subtasks);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [taskCard, setTaskCard] = useState(task);
  const [taskSubtasks, setTaskSubtasks] = useState(subtasks);
  const [selectedColor, setSelectedColor] = useState("");
  const isOpen = useSelector((state) => state.modal.modals['task']?.isOpen);


  const fetchLabelAndSubtasks = async (dispatch, taskId) => {
    await dispatch(fetchTaskLabels(taskId));
    await dispatch(fetchSubtasks(taskId));
  };

  useEffect(() => {
    fetchLabelAndSubtasks(dispatch, task.id);
  }, [dispatch, task.id]);

  const updateTitle = async (value) => {
    setTaskCard(prev => ({ ...prev, title: value }));
    await dispatch(updateTaskTitle({title: value, taskId: taskCard.id})).unwrap();
  };

  const updateDesc = (value) => {
    setTaskCard(prev => ({ ...prev, desc: value }));
    dispatch(updateTaskDesc({desc: value, id: taskCard.id}));
  };

  const addLabel = (label) => {
    if (taskCard.labels.some(item => item.text === label.text)) return;
    dispatch(addTasksLabel({ id: uuid, text: label.text, color: label.color, task_id: taskCard.id}));
    setSelectedColor("");
    setTaskCard(prev => ({
      ...prev,
      labels: [...prev.labels, label],
    }));
  };

  const removeLabel = async (label) => {
    await dispatch(deleteTasksLabel(label.id)).unwrap();
    setTaskCard(prev => ({
      ...prev,
      labels: prev.labels.filter(item => item.text !== label.text),
    }));
  };

  const addSubTask = (value) => {
    const newSubtask = { id: uuid, text: value, completed: false, task_id: taskCard.id};
    setTaskSubtasks(prev => [...prev, newSubtask])
    dispatch(addSubtasks(newSubtask));
    setTaskCard(prev => ({
      ...prev,
      tasks: [...prev.subtasks, newSubtask],
    }));
  };
  
  const removeSubtask = (id) => {
    const subtaskToRemove = taskCard.subtasks.find(st => st.id === id);
    setTaskSubtasks(prevSubtasks => prevSubtasks.filter(item => item.id !== id));

    try {
      dispatch(deleteSubtasks(id));
    } catch (error) {
      setTaskSubtasks(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, subtaskToRemove],
      }));
      toast({
        variant: "destructive",
        description: "Failed to remove subtask. Please try again.",
      });
    }
  };

  const updateSubtask = async(id, value) => {
    dispatch(updateSubtasks({completed: value, id: id}));
    setTaskCard(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(item => 
        item.id === id ? { ...item, completed: value } : item
      ),
    }));

    const { error: rpcError } = await supabase.rpc('update_task_status', { task_id: taskCard.id });

    if (rpcError) {
      // console.error('Error calling RPC function:', rpcError);
      toast({
        variant: "destructive",
        description: "Error calling RPC function. Please try again.",
      });
      return;
    }
  };

  const updateDate = async (date) => {
    if (!date) return;
    await dispatch(updateDate({date, id: taskCard.id})).unwrap();
    setTaskCard(prev => ({ ...prev, date }));
  };

  const openTaskModal = () => {
    dispatch(openModal({
      id: 'task',
      title: 'Task Details',
      contentProps: {
        taskCard,
        subtasks: taskSubtasks,
        labels,
      }
    }));
  };

  const renderTaskCardInfo = (contentProps) => (
    <TaskCardInfo
      onClose={() => dispatch(closeModal({ id: 'task' }))}
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
        modalClass="max-w-xl shadow-xl h-auto rounded-md overflow-y-auto overflow-x-hidden fixed top-1/2 left-1/2 rounded-md -translate-x-1/2 -translate-y-1/2 bg-white z-[1000]"/>
      )}
      
      <div
        className="w-full card rounded-md shadow-sm relative cursor-grab group"
        onClick={openTaskModal}
      >
        <div className="card-body p-3">
          <h2 className=" text-sm font-medium first-letter:uppercase">{taskCard.title}</h2>
          <div className="flex items-center gap-x-2">
            <p className="text-xs">{taskCard.desc}</p>
          </div>
          <div className="flex gap-x-2">
            {taskCard.labels.map((item, index) => (
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
              {taskCard.subtasks && taskCard.subtasks.length > 0 && (
                <div className="text-xs text-gray-600 font-medium">
                  <i className="pi pi-check-square mr-1"></i>
                  {taskCard.subtasks.filter((item) => item.completed).length}/{taskCard.subtasks.length}
                </div>
              )}
            </div>
            <Avatar avatar={user.avatar_url} firstname={user.firstname} className={'w-6 text-sm'} backgroundClass={'p-1'}/>
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
};

export default TaskCard;