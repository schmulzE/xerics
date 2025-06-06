import "./taskCardInfo.css";
import { useEffect, useState } from "react";
import Chip from "../../../../components/ui/chip";
import { colorsList } from "../../../../utils/dateFormatter";
import CustomInput from "../../../../components/ui/customInput/customInput";


function TaskCardInfo(props) {
  const { 
    updateCard, 
    updateTitle,
    // labels, 
    cardTask, 
    updateDesc, 
    removeLabel, 
    addLabel,
    addTask,
    updateSubtask, 
    removeSubtask,
    updateDate,
    selectedColor,
    setSelectedColor,
    // subtasks
  } = props;
  const [showLabel, setShowLabel] = useState(false);

  const calculatePercent = () => {
    if (!Array.isArray(cardTask.subtasks) || cardTask.subtasks.length === 0) return 0;
  
    const completed = cardTask.subtasks.filter((item) => item && item.completed).length;
    return Math.round((completed / cardTask.subtasks.length) * 100);
  };

  useEffect(() => {
    if (updateCard) updateCard(cardTask.id, cardTask);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardTask]);

  const calculatedPercent = calculatePercent();

  return (
    <div className="bg-base-100 overflow-hidden w-80 max-w-xl p-4">
      <div className="label">
        <span className="label-text">Title</span>
      </div>
      <CustomInput
        defaultValue={cardTask.title}
        text={cardTask.title}
        placeholder="Enter Title"
        onSubmit={updateTitle}
        displayClass={'border w-full text-left text-sm'}
      />

      <div className="label">
        <span className="label-text">Description</span>
      </div>
      <CustomInput
        defaultValue={cardTask.description}
        text={cardTask.description || "Add a Description"}
        placeholder="Enter description"
        onSubmit={updateDesc}
        displayClass={'border w-full max-w-xs text-left text-sm pb-8'}
      />
      <button type="button" className="btn btn-sm btn-primary mt-4 font-normal rounded-sm" onClick={() => setShowLabel(current => current = !current)}>Labels</button>
      {showLabel && (<div className="cardinfo-box">
        <div className="">
          {cardTask.labels.map((item, index) => (
            <Chip key={index} item={item} removeLabel={removeLabel} />
          ))}
        </div>
        <ul>
          {colorsList.map((item, index) => (
            <li
              key={index}
              style={{ backgroundColor: item, width: '12px', height: '12px' }}
              className={selectedColor === item ? "li-active" : ""}
              onClick={() => {setSelectedColor(item)}}
            />
          ))}
        </ul>
        <CustomInput
          text="Add Label"
          placeholder="Enter label text"
          onSubmit={(value) =>
            addLabel({ color: selectedColor, text: value })
          }
          displayClass={'bg-base-200'}
        />
      </div>)}

      <div className="my-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm">Tasks</p>
        </div>
        <div className="cardinfo-box-progress-bar">
          <div className="cardinfo-box-progress"
            style={{
              width: `${calculatedPercent}%`,
              backgroundColor: calculatedPercent === 100 ? "limegreen" : "",
            }}
          />
        </div>
        <div className="cardinfo-box-task-list mb-2">
          {cardTask && cardTask.subtasks?.map((item) => (
            <div key={item?.id} className="flex justify-between px-1">
              <div className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  defaultChecked={item?.completed}
                  onChange={(event) =>
                    updateSubtask(item?.id, event.target.checked)
                  }
                  />
                <p className={item?.completed ? " line-through text-sm text-gray-400" : " text-sm"}>{item?.text}</p>
              </div>
              <button onClick={() => removeSubtask(item.id)}><i className="pi pi-trash text-sm"/></button>
            </div>
          ))}
        </div>
        <CustomInput
          text={"Add a Task"}
          placeholder="Enter task"
          onSubmit={addTask}
          displayClass={'btn-primary btn-sm'}
        />
      </div>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Due Date</span>
        </div>
        <input
          type="date"
          defaultValue={cardTask.date}
          min={new Date().toISOString().substr(0, 10)}
          onChange={(event) => updateDate(event.target.value)}
          className='w-full p-1.5 input input-bordered input-sm rounded-none'
          />
      </label>
    </div>
  );
}

export default TaskCardInfo;