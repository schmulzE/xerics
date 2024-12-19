/* eslint-disable no-unused-vars */
import TaskCard from "./taskCard";
import { v4 as uuidv4 } from 'uuid';
import { createPortal } from "react-dom";
import { useDispatch } from 'react-redux';
import { createTask } from '../taskThunk.js';
import { useParams } from "react-router-dom";
import supabase from "../../../lib/supabase.js";
import Board from '../../boards/components/board';
import { updateTaskBoard } from "../taskThunk.js";
import { useToast } from "@/components/ui/use-toast";
import { useMemo, useState, useEffect } from "react";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { addProjectEvent } from "../../projectEvents/projectEventsThunks.js";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

const TaskBoard = ({
  user, 
  boards, 
  setBoards, 
  tasks, 
  setTasks, 
  loading, 
  setProjectEvents, 
  projectContributors
}) => {
  let uuid = uuidv4();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const boardsId = useMemo(() => boards.map((col) => col.id), [boards]);
  

  async function updateProjectStatus(projectId) {
    try {
      const { data, error } = await supabase
        .rpc('update_project_status', { project_id: projectId })
  
      if (!error){
        toast({variant: 'success', description: 'Project status updated successfully'})
      }else{
        toast({variant: 'destructive', description: 'Error updating project status. Please try again'})
      }
  
      return data
    } catch (error) {
      throw new Error('Error updating project status:', error.message)
    }
  }
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  
  useEffect(() =>{
    const getUsername = (profileId) => {
      let username;
      const user = projectContributors.find(contributor => contributor.profiles.id === profileId)
      if(user) {
        username = user.profiles.username.replace(/['"]+/g, '')
      }
      return username
    }
    
    const getBoardName = (boardId) => {
      let boardName;
      const board = boards.find(board => board.id === boardId)
      if(board) {
        boardName = board.title
      }
      return boardName;
    }

    const subscription = supabase
      .channel(`tasks:project_id=eq.${projectId}`)
      .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
      }, (payload) => {
        const newTask = payload.new;
        setTasks((tasks) => [...tasks, {...newTask, labels: [], tasks: []}])
        setProjectEvents(
          timelines => [...timelines, 
            {
            task_id: payload.new.id, 
            eventType: payload.eventType, 
            board: getBoardName(payload.new.board_id), 
            taskname: payload.new.title,
            user: getUsername(payload.new.profile_id),
            timestamp: payload.commit_timestamp,
            project_id: payload.new.project_id
          }
        ])
        dispatch(addProjectEvent({
          task_id: payload.new.id, 
          eventType: payload.eventType, 
          board: getBoardName(payload.new.board_id), 
          taskname: payload.new.title,
          user: getUsername(payload.new.profile_id),
          timestamp: payload.commit_timestamp,
          project_id: payload.new.project_id
        }))
      })
      
      .on('postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
      }, (payload) => {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === payload.new.id)
          const updatedTask = {
            ...tasks[activeIndex], // Copy the original task object
            board_id: payload.new.board_id // Update the board_id property
          };
          const updatedTasks = [...tasks]; // Create a copy of the tasks array
          updatedTasks[activeIndex] = updatedTask;  
          return arrayMove(updatedTasks, activeIndex, activeIndex);
        });
        setProjectEvents(
          timelines => [...timelines, 
            {
              task_id: payload.new.id, 
              eventType: payload.eventType, 
              board: getBoardName(payload.new.board_id), 
              taskname: payload.new.title,
              user: getUsername(payload.new.profile_id),
              timestamp: payload.commit_timestamp,
              project_id: payload.new.project_id
            }
        ]);
        dispatch(addProjectEvent({
          task_id: payload.new.id,
          eventType: payload.eventType, 
          board: getBoardName(payload.new.board_id), 
          taskname: payload.new.title,
          user: getUsername(payload.new.profile_id),
          timestamp: payload.commit_timestamp,
          project_id: payload.new.project_id
        }))
      })
      .subscribe()
      return () => subscription.unsubscribe()
  },[projectContributors, boards, dispatch, projectId, setProjectEvents, setTasks])


  const addNewTask = (boardId ,value) =>{
    try {
      const task = { id: uuid, board_id:boardId, title:value, project_id: projectId, profile_id: user.id }
      dispatch(createTask(task)); // This will send the task to the server
    } catch (error) {
      throw new Error(error);
    }
  }

  async function deleteTask(id) {
    const { error }  = await supabase 
    .from('tasks')
    .delete()
    .eq('id', id)
    if(!error) {
      toast({variant: 'success', description: 'task deleted successfully!'})
    }
    const deletedTask = tasks.filter((task) => task.id !== id);
    setTasks(deletedTask);
  }

  function updateTask(taskId, task){

    const taskIndex = tasks.findIndex((item) => item.id === taskId);
    if (taskIndex < 0) return;

    const tempTask = [...tasks]
    tempTask[taskIndex] = task;

    setTasks(tempTask);
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Board") {
      setActiveColumn(event.active.data.current.board);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  async function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    // console.log("DRAG END");

    setBoards((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });


  }

  async function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // I'm dropping a Task over another Task
    if (isActiveATask && isOverATask) {

      setTasks((tasks) => {
        const tasksCopy = tasks.map(task => ({ ...task })); // Create a shallow copy of the tasks array
      
        const activeIndex = tasksCopy.findIndex((t) => t.id === activeId);
        let overIndex = tasksCopy.findIndex((t) => t.id === overId);
      
        // If overIndex is -1 (dropped below the last task), set it to the last index
        if (overIndex === -1) {
          overIndex = tasksCopy.length - 1;
        }
      
        if (tasksCopy[activeIndex].board_id !== tasksCopy[overIndex].board_id) {
          // Fix introduced after video recording
          tasksCopy[activeIndex].board_id = tasksCopy[overIndex].board_id;
          return arrayMove(tasksCopy, activeIndex, overIndex);
        }
      
        return arrayMove(tasksCopy, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // I am dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const updatedTask = {
          ...tasks[activeIndex], // Copy the original task object
          board_id: overId // Update the board_id property
        };
        const updatedTasks = [...tasks]; // Create a copy of the tasks array
        updatedTasks[activeIndex] = updatedTask;
        return arrayMove(updatedTasks, activeIndex, activeIndex);
      });

      await dispatch(updateTaskBoard({overId, activeId})).unwrap()
      await updateProjectStatus(projectId)
    }
  }

  if(loading) return <div className="flex justify-center content-center items-center"><span className="block loading loading-spinner"></span></div>

  return (
    <div>
      <div className="mx-auto min-h-screen w-full mt-4 overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={boardsId}>
            {boards.map(board => (
              <Board 
                key={board.id} 
                board={board}
                createTask={addNewTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.board_id === board.id)}
                setTasks={setTasks}
                projectContributors={projectContributors}
                user={user}
              />
            ))}
            </SortableContext>
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Board
                column={activeColumn}
                createTask={addNewTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                projectContributors={projectContributors}
                user={user}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                projectContributors={projectContributors}
                user={user}
              />
            )}
          </DragOverlay>,
          document.body
        )}
        </DndContext>
    </div>
    </div>
  )
}

export default TaskBoard