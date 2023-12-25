import { useMemo, useState, useEffect } from "react";
import ColumnContainer from "./columnContainer";
import supabase from "../lib/supabase.js";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./taskCard";
import { useParams } from "react-router-dom";
import { CustomInput } from './columnContainer'
// import Avatar from "./avatar";

function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isCustomInput, setIsCustomInput] = useState(false);
  const { projectId} = useParams()

  // console.log(projectId);
  useEffect(() =>{
    const getBoards = async () => {
    const {data, error} = await supabase
    .from('boards')
    .select('*')
    .order('created_at', { ascending: true})
    if(error) console.log(error)
    console.log(data)
    setColumns(data)
    }
    getBoards()
  },[])

  useEffect(() => {
    const subscription = supabase
      .channel(`public:boards`)
      .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'boards',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
      
      setColumns(current => [...current, payload.new])

      })
      .subscribe()
 
     return () => supabase.removeChannel(subscription)
   }, [projectId])


  useEffect(() =>{
    const getCards = async () => {
    const {data, error} = await supabase
    .from('cards')
    .select(`*, labels!labels_card_id_fkey(*), tasks!tasks_card_id_fkey(*)`)
    .order('created_at', { ascending: true})
    if(error) console.log(error)
    setTasks(data)
    }
    getCards()
  },[])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  async function createTask(columnId ,value) {
    const { data, error} = await supabase
    .from('cards')
    .insert({
      title: value,
      board_id: columnId,
      project_id: projectId,
    })
    .select(`*, labels!labels_card_id_fkey(*), tasks!tasks_card_id_fkey(*))`)
    setTasks(current => [...current, data[0]])
    if(error) console.log(error)

  }

  async function deleteTask(id) {
    const { error }  = await supabase 
    .from('cards')
    .delete()
    .eq('id', id)
    if(error) console.log(error)
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(taskId, task){

    const taskIndex = tasks.findIndex((item) => item.id === taskId);
    if (taskIndex < 0) return;

    const tempTask = [...tasks]
    tempTask[taskIndex] = task;

    setTasks(tempTask);
  }

  async function createNewColumn(value) {
    const {error} = await supabase
    .from('boards')
    .insert({
     title:  value,
     project_id: projectId
    })
    console.log('hey!!!')
    if(error) console.log(error)
  }

  async function deleteColumn(id) {
    const { error }  = await supabase 
    .from('boards')
    .delete()
    .eq('id', id)
    
    if(error) console.log(error)

    setColumns(current =>  current.filter(col => col.id !== id))
  }


  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
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

    console.log("DRAG END");

    setColumns((columns) => {
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

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].board_id != tasks[overIndex].board_id) {
          // Fix introduced after video recording
          tasks[activeIndex].board_id = tasks[overIndex].board_id;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].board_id = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });

        const { error } = await supabase
        .from('cards')
        .update({
          board_id: overId,
        })
        .match({
          id: activeId,
        })

        if(error) console.log(error)
    }
  }


  return (
    <>
    <div className="flex justify-between mx-8 mt-4 w-[1180px]">
      <div className=" text-blue-500 text-5xl capitalize">the taco truck</div>
      <div className="w-36">
      {/* <Avatar/> */}
      {/* {projects.map(project => ( */}
        <div className="avatar-group inline-flex placeholder capitalize mx-2">
           <div className="bg-neutral-focus hover:bg-blue-500 text-neutral-content rounded-full w-10 p-2 tooltip tooltip-right">
            <span className="text-md uppercase">WS</span>
          </div>
        </div>
        {/* ))} */}
      <div className="mt-4 avatar placeholder tooltip tooltip-bottom" data-tip="invite user">
        <button className="bg-neutral-focus text-neutral-content rounded-full btn-circle h-10 w-10" onClick={()=>document.getElementById('my_modal_2').showModal()}>
          <i className="pi pi-plus text-sm text-blue-500"></i>
        </button>
        <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h1 className="uppercase my-2 font-medium text-left">insert user name</h1>
              <form method="dialog" onSubmit={''}>
                <input className="input bg-mainBackgroundColor focus:outline-blue-500 w-full"/>
                <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                  <button className="btn bg-pink-400 hover:bg-pink-500 text-white" type="submit">invite user</button>
                  <button className="btn">Close</button>
                </div>
              </form>
            </div>
          </dialog>
      </div>
      </div>
    </div>
    
    <div
      className="
        mx-auto      
        min-h-screen
        w-full
        mt-4
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    > 
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.board_id === col.id)}
                />
              ))}
            </SortableContext>
          </div>
         {!isCustomInput ? (<button
            onClick={() => {
              setIsCustomInput(true);
            }}
            className="
            h-[60px]
            w-[300px]
            min-w-[300px]
            cursor-pointer
            rounded-lg
            bg-mainBackgroundColor
            border-2
            border-columnBackgroundColor
            p-4
            ring-blue-500
            hover:ring-2
            flex
            gap-2
          "
          >
            <i className='pi pi-plus text-md mt-1'></i>
            Add Column
          </button>) :
           <CustomInput 
           setIsCustomInput={setIsCustomInput}
           text="+ Add Card"
           placeholder="Enter Board Title"
           onSubmit={(value) => createNewColumn(value)}
           />}
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
    </>
  );
}
 


export default KanbanBoard;