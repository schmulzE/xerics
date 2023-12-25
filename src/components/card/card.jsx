import { useState } from "react";
import { AlignLeft } from "react-feather";
import { formatDate } from "../../Helper/Utils";
import Dropdown from "../dropdown/dropdown";
import CardInfo from "./cardInfo/cardInfo";
import Chip from "../chip";
import "./card.css"; 


function Card(props) {
  const { card, boardId, removeCard, onDragEnd, onDragEnter, updateCard } = props;
  const { id, title, desc, date, tasks, labels } = card;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cardTasks, setCardTasks] = useState([])  

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={card}
          cardTasks={cardTasks}
          setCardTasks={setCardTasks}
          boardId={boardId}
          updateCard={updateCard}
        />
     )}

    <div
      className="card w-full rounded-md bg-base-100 shadow-md relative cursor-grab group"
      key={card.id}
      draggable
      onDragEnd={() => onDragEnd(boardId, id)}
      onDragEnter={() => onDragEnter(boardId, id)}
      onClick={() => setShowModal(true)}
      >
        <figure>
          <img className="w-full h-36" src={'https://images.pexels.com/photos/992734/pexels-photo-992734.jpeg?auto=compress&cs=tinysrgb&w=600'} alt="flowers" />
        </figure>
        <button onClick={(event) => {event.stopPropagation(); setShowDropdown(curr =>  curr = !curr)}} className="btn absolute -top-1 right-4 opacity-0 p-0 bg-transparent hover:bg-transparent border-0 group-hover:opacity-80">
          <i className="pi pi-ellipsis-h text-sm text-gray-500"></i>
        </button>
        {showDropdown && (
        <Dropdown
          class="board-dropdown absolute top-1 -right-2"
          onClose={() => setShowDropdown(false)}
        >
          <p onClick={(event) => {event.stopPropagation(); removeCard(boardId, id)}}>Delete card</p>
        </Dropdown>
      )}
        <div className="card-body p-3 gap-x-2">
        {labels.map((item, index) => (
          <Chip key={index} item={item} />
        ))}
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
    </>
  );
}

export default Card;