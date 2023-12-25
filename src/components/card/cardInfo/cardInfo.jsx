import { useEffect, useState } from "react";
import { CheckSquare, List, Trash, Type } from "react-feather";
import { colorsList } from "../../../Helper/Utils";
import Modal from "../../modal/modal";
import CustomInput from "../../customInput/customInput";
// import TextEditor from "../../texteditor";

import "./cardInfo.css";
import Chip from "../../chip";
import supabase from "../../../lib/supabase";

function CardInfo(props) {
  const { onClose, card, updateCard, } = props;
  const [selectedColor, setSelectedColor] = useState("");
  const [comments, setComments] = useState("");
  const [cardValues, setCardValues] = useState({
    ...card,
  });
  const [showDesc, setShowDesc] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const [showTask, setShowTask] = useState(false)


  useEffect(() => {
    const subscription =  supabase
       .channel(`comments:card_id=eq.${cardValues.id}`)
       .on('postgres_changes',
       {
         event: 'INSERT',
         schema: 'public',
       }, (payload) => {
         setComments((current) => [...current, payload.new])
       })
       .subscribe()
 
     return () => supabase.removeChannel(subscription)
   }, [cardValues.id])


  const updateTitle = async (value) => {
    setCardValues({ ...cardValues, title: value });
    const { error } = await supabase
    .from('cards')
    .update({
      title: value,
    })
    .match({
      id: cardValues.id
    })

    if(error) console.log(error)
  };

  const updateDesc = async(value) => {
    const { error } = await supabase
    .from('cards')
    .update({
      desc: value,
    })
    .match({
      id: cardValues.id
    })

    if(error) console.log(error)
    setCardValues({ ...cardValues, desc: value });
  };

  const addLabel = async(label) => {
    const index = cardValues.labels.findIndex(
      (item) => item.text === label.text,
    );
    if (index > -1) return; //if label text already exist then return
    
    const { error } = await supabase
    .from('labels')
    .insert({
      text: label.text,
      color: label.color,
      card_id: cardValues.id
    })

    if(error) console.log(error)

    setSelectedColor("");
    setCardValues({
      ...cardValues,
      labels: [...cardValues.labels, label],
    });
  };

  const removeLabel = async(label) => {
    const { error } = await supabase
    .from('labels')
    .delete()
    .match({id: label.id})

    if(error) console.log(error)
    
    const tempLabels = cardValues.labels.filter(
      (item) => item.text !== label.text,
    );

    setCardValues({
      ...cardValues,
      labels: tempLabels,
    });
  };

  const addTask = async (value) => {
    const { data, error} = await supabase
    .from('tasks')
    .insert({
      completed: false,
      text: value,
      card_id: cardValues.id
    })
    .select('*')

    if(error) console.log(error)
    const task = data[0]
    setCardValues({
      ...cardValues,
      tasks: [...cardValues.tasks, task],
    });
  };

  const removeTask = async (id) => {
    const tasks = [...cardValues.tasks];

    const tempTasks = tasks.filter((item) => item.id !== id);
    setCardValues({
      ...cardValues,
      tasks: tempTasks,
    });

    const { error} = await supabase
    .from('tasks')
    .delete()
    .match({
      id: id
    })
    if(error) console.log(error)
  };

  const updateTask = async (id, value) => {

    const { error } = await supabase
    .from('tasks')
    .update({
      completed: value,
    })
    .match({id: id})


    if(error) console.log(error)

    const tasks = [...cardValues.tasks];

    const index = tasks.findIndex((item) => item.id === id);
    if (index < 0) return;

    tasks[index].completed = Boolean(value);

    setCardValues({
      ...cardValues,
      tasks,
    });
  };

  const calculatePercent = () => {
    if (!cardValues.tasks?.length) return 0;
    const completed = cardValues.tasks?.filter(
      (item) => item.completed,
    )?.length;
    return (completed / cardValues.tasks?.length) * 100;
  };

  const updateDate = async (date) => {
    if (!date) return;
    const {error} =  await supabase
    .from('cards')
    .update({
      date: date
    })
    .match({
      id: cardValues.id
    })
    if(error) console.log(error)
    setCardValues({
      ...cardValues,
      date,
    });
  };

  useEffect(() => {
    // if (updateCard) updateCard(boardId, cardValues.id, cardValues);
    if (updateCard) updateCard(cardValues.id, cardValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardValues]);

  const calculatedPercent = calculatePercent();

  return (
    <Modal onClose={onClose}>
       <div className="flex h-40 py-4 justify-between capitalize px-6 bg-no-repeat bg-center bg-cover bg-[url('https://images.pexels.com/photos/992734/pexels-photo-992734.jpeg?auto=compress&cs=tinysrgb&w=600')]"/>
        <div className="grid grid-cols-3 bg-columnBackgroundColor overflow-hidden">
        <div className="col-span-2">
        <div className="p-3">
          <div className="cardinfo">
          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
            <Type />
              <p>{cardValues.title}</p>
            </div>
            <CustomInput
              defaultValue={cardValues.title}
              text={cardValues.title}
              placeholder="Enter Title"
              onSubmit={updateTitle}
              displayClass={'bg-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100'}
            />
          </div>

          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <List />
              <p className="text-xl">Description</p>
              <button onClick={() => setShowDesc(current =>  current = !current)} className="btn btn-ghost btn-xs rounded-none bg-columnBackgroundColor border-0 hover:bg-mainBackgroundColor text-gray-100"><i className="pi pi-pencil text-md"></i></button>
            </div>
            {showDesc ? (<p className="">
              {cardValues.desc}
            </p>)
            : (
              // <TextEditor content={cardValues.desc}/>
              <CustomInput
                defaultValue={cardValues.desc}
                text={cardValues.desc || "Add a Description"}
                placeholder="Enter description"
                onSubmit={updateDesc}
                displayClass={'bg-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100'}
              />
            )}
          </div>

        {showTask && ( <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <CheckSquare />
              <p>Tasks</p>
            </div>
            <div className="cardinfo-box-progress-bar">
              <div
                className="cardinfo-box-progress"
                style={{
                  width: `${calculatedPercent}%`,
                  backgroundColor: calculatedPercent === 100 ? "limegreen" : "",
                }}
              />
            </div>
            <div className="cardinfo-box-task-list">
              {cardValues.tasks?.map((item) => (
                <div key={item.id} className="cardinfo-box-task-checkbox">
                  <input
                    type="checkbox"
                    defaultChecked={item.completed}
                    onChange={(event) =>
                      updateTask(item.id, event.target.checked)
                    }
                  />
                  <p className={item.completed ? "completed" : ""}>{item.text}</p>
                  <Trash onClick={() => removeTask(item.id)} />
                </div>
              ))}
            </div>
            <CustomInput
              text={"Add a Task"}
              placeholder="Enter task"
              onSubmit={addTask}
              displayClass={'bg-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100'}
            />
          </div>)}
            <form className="form-control" onSubmit="submitComment">
            <label htmlFor="comment" className="text-xl font-medium mb-2">Comments</label>
              <textarea placeholder="add a comment..." className="textarea" name="comment" id="comment" cols="30" rows="2"></textarea>
              <div className="my-2">
                <button type="submit" className="btn bg-mainBackgroundColor hover:bg-mainBackgroundColor">add comment</button>
              </div>
            </form>
            </div>
            </div>
          </div>

          <div className="p-8 w-3/4">
            <div className="uppercase font-medium mb-4 text-center">add to card</div>
            <div className="flex flex-col justify-center content-center gap-y-3">
            <button className="btn bg-mainBackgroundColor border-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100" onClick={() => setShowLabel(current => current = !current)}>Labels</button>
              {showLabel && (<div className="cardinfo-box">
              <div className="cardinfo-box-labels">
                {cardValues.labels.map((item, index) => (
                  <Chip key={index} item={item} removeLabel={removeLabel} />
                ))}
              </div>
              <ul>
                {colorsList.map((item, index) => (
                  <li
                    key={index}
                    style={{ backgroundColor: item, width: '12px', height: '12px' }}
                    className={selectedColor === item ? "li-active" : ""}
                    onClick={() => setSelectedColor(item)}
                  />
                ))}
              </ul>
              <CustomInput
                text="Add Label"
                placeholder="Enter label text"
                onSubmit={(value) =>
                  addLabel({ color: selectedColor, text: value })
                }
                displayClass={'bg-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100'}
              />
            </div>)}
            <button className="btn bg-mainBackgroundColor border-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100" onClick={() => setShowTask(current => current = !current)}>Checklist</button>
            <button className="btn bg-mainBackgroundColor border-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100" onClick={() => setShowDate(current => current = !current)}>Due date</button>
            {showDate && (
              <>
                <input
                type="date"
                defaultValue={cardValues.date}
                min={new Date().toISOString().substr(0, 10)}
                onChange={(event) => updateDate(event.target.value)}
                className={'bg-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100 p-1.5'}
                />
              </>
            )}
            <button className="btn bg-mainBackgroundColor border-mainBackgroundColor hover:bg-mainBackgroundColor text-gray-100">Cover</button>
            </div>
          </div>
        </div>
      </Modal>
  );
}

export default CardInfo;