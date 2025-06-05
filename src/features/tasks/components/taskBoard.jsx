import { createPortal } from "react-dom";
import TaskCard from "./taskCard";
import Board from "../../boards/components/board";
import { SortableContext } from "@dnd-kit/sortable";
import { useTaskBoard } from "../hooks/useTaskBoard"; // adjust the path as needed
import { DndContext, DragOverlay } from "@dnd-kit/core";

const TaskBoard = (props) => {
  const {
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
  } = useTaskBoard(props);

  if (props.loading) {
    return (
      <div className="flex justify-center content-center items-center">
        <span className="block pi pi-spin pi-spinner"></span>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full mt-4 overflow-x-auto overflow-y-hidden">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="flex gap-4">
          <SortableContext items={boardsId}>
            {props.boards.map((board) => (
              <Board
                key={board.id}
                board={board}
                createTask={addNewTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={props.tasks.filter((task) => task.board_id === board.id)}
                setTasks={props.setTasks}
                projectContributors={props.projectContributors}
                user={props.user}
              />
            ))}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Board
                board={activeColumn}
                createTask={addNewTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={props.tasks.filter((task) => task.board_id === activeColumn.id)}
                projectContributors={props.projectContributors}
                user={props.user}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                projectContributors={props.projectContributors}
                user={props.user}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default TaskBoard;