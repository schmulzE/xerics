import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import supabase from "../../../lib/supabase";
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from "../../../components/ui/use-toast";
import { updateTaskDesc, updateTaskTitle } from "../taskThunk";
import { openModal, closeModal } from '../../modal/modalSlice.js';
import { fetchTaskLabels, addTasksLabel, deleteTasksLabel } from "../../tasksLabel/tasksLabelThunks";
import { addSubtasks, fetchSubtasks, deleteSubtasks, updateSubtasks } from "../../tasksSubtasks/tasksSubtasksThunks";

export const useTaskCard = ({ task }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [taskCard, setTaskCard] = useState(task);
  const [selectedColor, setSelectedColor] = useState("");
  
  let uuid = uuidv4();
  const toast = useToast();
  const dispatch = useDispatch();
  const labels = useSelector(state => state.tasksLabel.labels);
  const subtasks = useSelector(state => state.tasksSubtasks.subtasks);
  const isOpen = useSelector((state) => state.modal.modals['task']?.isOpen);
  const [taskSubtasks, setTaskSubtasks] = useState(subtasks);

  useEffect(() => {
    const fetchLabelAndSubtasks = async (taskId) => {
      await Promise.all([
        dispatch(fetchTaskLabels(taskId)),
        dispatch(fetchSubtasks(taskId))
      ]);
    };
    fetchLabelAndSubtasks(task.id);
  }, [dispatch, task.id]);

  const updateTitle = async (value) => {
    setTaskCard(prev => ({ ...prev, title: value }));
    await dispatch(updateTaskTitle({title: value, taskId: taskCard.id})).unwrap();
  };

  const updateDesc = (value) => {
    setTaskCard(prev => ({ ...prev, description: value }));
    dispatch(updateTaskDesc({description: value, id: taskCard.id}));
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
      toast({
        variant: "destructive",
        description: "Error calling RPC function. Please try again.",
      });
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

  const closeTaskModal = () => {
    dispatch(closeModal({ id: 'task' }));
  };

  return {
    mouseIsOver,
    taskCard,
    selectedColor,
    labels,
    subtasks,
    taskSubtasks,
    isOpen,
    setMouseIsOver,
    setSelectedColor,
    setTaskSubtasks,
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
  };
};