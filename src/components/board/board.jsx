import { useState } from "react";
import { MoreHorizontal } from "react-feather";
// import supabase from "../../lib/supabase";
import Card from "../card/card";
import Dropdown from "../dropdown/dropdown";
import CustomInput from "../customInput/customInput";

import "./board.css";


function Board(props) {

  const {
    board,
    addCard,
    removeBoard,
    removeCard,
    onDragEnd,
    onDragEnter,
    updateCard,
  } = props;

  const [showDropdown, setShowDropdown] = useState(false);


  return (
    <div className="board">
      <div className="board-inner" key={board?.id}>
        <div className="board-header">
          <p className="board-header-title">
            {board.title}
            <span>{board.cards.length || 0}</span>
          </p>
          <div
            className="board-header-title-more relative"
            onClick={() => setShowDropdown(prev => prev = !prev)}
          >
            <MoreHorizontal/>
            {showDropdown && (
              <Dropdown
                class="board-dropdown absolute -right-2"
              >
                <p onClick={() => removeBoard(board?.id)}>Delete Board</p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="board-cards custom-scroll">
          {board.cards.map((item) => (
            <Card
              key={item.id}
              card={item}
              boardId={board.id}
              removeCard={removeCard}
              onDragEnter={onDragEnter}
              onDragEnd={onDragEnd}
              updateCard={updateCard}
            />
          ))}
          <CustomInput
            text="+ Add Card"
            placeholder="Enter Card Title"
            displayClass="board-add-card"
            editClass="board-add-card-edit"
            onSubmit={(value) => addCard(board.id, value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Board;