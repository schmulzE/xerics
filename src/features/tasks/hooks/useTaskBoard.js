import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import supabase from "../../../lib/supabase";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createTask, updateTaskBoard } from "../taskThunk";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { addProjectEvent } from "../../projectEvents/projectEventsThunks";

export function useTaskBoard({ user, boards, setBoards, tasks, setTasks, setProjectEvents, projectContributors }) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { projectId } = useParams();

  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const boardsId = useMemo(() => boards.map((col) => col.id), [boards]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  useEffect(() => {
    const getUsername = (profileId) => {
      const contributor = projectContributors.find((c) => c.profiles.id === profileId);
      return contributor?.profiles.username.replace(/['"]+/g, '');
    };

    const getBoardName = (boardId) => boards.find((b) => b.id === boardId)?.title;

    const subscription = supabase
      .channel(`tasks:project_id=eq.${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public' }, (payload) => {
        const newTask = payload.new;
        const enriched = {
          task_id: newTask.id,
          eventType: payload.eventType,
          board: getBoardName(newTask.board_id),
          taskname: newTask.title,
          user: getUsername(newTask.profile_id),
          timestamp: payload.commit_timestamp,
          project_id: newTask.project_id,
        };

        setTasks((prev) => [...prev, { ...newTask, labels: [], tasks: [] }]);
        setProjectEvents((prev) => [...prev, enriched]);
        dispatch(addProjectEvent(enriched));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public' }, (payload) => {
        const updated = payload.new;
        setTasks((prev) => {
          const index = prev.findIndex((t) => t.id === updated.id);
          const updatedTask = { ...prev[index], board_id: updated.board_id };
          const copy = [...prev];
          copy[index] = updatedTask;
          return arrayMove(copy, index, index);
        });

        const enriched = {
          task_id: updated.id,
          eventType: payload.eventType,
          board: getBoardName(updated.board_id),
          taskname: updated.title,
          user: getUsername(updated.profile_id),
          timestamp: payload.commit_timestamp,
          project_id: updated.project_id,
        };

        setProjectEvents((prev) => [...prev, enriched]);
        dispatch(addProjectEvent(enriched));
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [boards, dispatch, projectContributors, projectId, setProjectEvents, setTasks]);

  const addNewTask = (boardId, value) => {
    const task = {
      id: uuidv4(),
      board_id: boardId,
      title: value,
      project_id: projectId,
      profile_id: user.id,
    };
    dispatch(createTask(task));
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) toast({ variant: "success", description: "task deleted successfully!" });
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = (taskId, newTask) => {
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return;
    const updated = [...tasks];
    updated[index] = newTask;
    setTasks(updated);
  };

  const updateProjectStatus = async (projectId) => {
    const { data, error } = await supabase.rpc("update_project_status", { project_id: projectId });
    if (!error) {
      toast({ variant: "success", description: "Project status updated successfully" });
    } else {
      toast({ variant: "destructive", description: "Error updating project status" });
    }
    return data;
  };

  const onDragStart = (event) => {
    const type = event.active.data.current?.type;
    if (type === "Board") setActiveColumn(event.active.data.current.board);
    if (type === "Task") setActiveTask(event.active.data.current.task);
  };

  const onDragEnd = (event) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (active.data.current?.type !== "Column") return;

    setBoards((cols) => {
      const from = cols.findIndex((c) => c.id === active.id);
      const to = cols.findIndex((c) => c.id === over.id);
      return arrayMove(cols, from, to);
    });
  };

  const onDragOver = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverCol = over.data.current?.type === "Column";

    if (!isTask) return;

    if (isOverTask) {
      setTasks((prev) => {
        const copy = prev.map((t) => ({ ...t }));
        const from = copy.findIndex((t) => t.id === active.id);
        const to = copy.findIndex((t) => t.id === over.id);
        if (copy[from].board_id !== copy[to].board_id) {
          copy[from].board_id = copy[to].board_id;
        }
        return arrayMove(copy, from, to);
      });
    }

    if (isOverCol) {
      const boardId = over.id;
      const index = tasks.findIndex((t) => t.id === active.id);
      const updatedTask = { ...tasks[index], board_id: boardId };
      const updatedTasks = [...tasks];
      updatedTasks[index] = updatedTask;
      setTasks(arrayMove(updatedTasks, index, index));

      await dispatch(updateTaskBoard({ overId: boardId, activeId: active.id })).unwrap();
      await updateProjectStatus(projectId);
    }
  };

  return {
    sensors,
    boardsId,
    activeTask,
    activeColumn,
    onDragStart,
    onDragEnd,
    onDragOver,
    addNewTask,
    deleteTask,
    updateTask,
  };
}
