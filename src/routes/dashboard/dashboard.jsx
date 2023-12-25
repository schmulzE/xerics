// import { Outlet } from "react-router-dom"
// import DashboardLayout from "../../layout/dashboardLayout"

import KanbanBoard from "../../components/kanbanBoard"

const Dashboard = () => {
  return (
    // <>
    //   <DashboardLayout>
    //     <Outlet/>
    //   </DashboardLayout>
    // </>
    <div>
      <KanbanBoard/>
  </div>
  )
}

export default Dashboard

// import { useEffect, useState } from "react";
// import Board from "../../components/board/board.jsx";
// import "./Dashboard.css";
// import CustomInput from "../../components/customInput/customInput.jsx";
// import { fetchBoardList, updateLocalStorageBoards } from "../../Helper/ApiLayers";
// import Navbar from '../../components/navbar.jsx'
// import { useParams } from "react-router-dom";
// import supabase from "../../lib/supabase.js";

// function Dashboard() {
//   const { projectId} = useParams()
//   const [boards, setBoards] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   async function fetchData() {
//     const boards = await fetchBoardList();
//     setBoards(boards);
//   }


//   const [targetCard, setTargetCard] = useState({
//     boardId: '',
//     cardId: '',
//   });

//   useEffect(() =>{
//     const getBoards = async () => {
//     const {data, error} = await supabase
//     .from('boards')
//     .select(`*, cards:cards(*, labels!labels_card_id_fkey(*), tasks!tasks_card_id_fkey(*))`)
//     .order('created_at', { ascending: true})
//     if(error) console.log(error)
//     setBoards(data)
//     }
//     getBoards()
//   },[])

  
//   useEffect(() => {
//     const subscription =  supabase
//       .channel(`public:boards`)
//       .on('postgres_changes',
//       {
//         event: 'INSERT',
//         schema: 'public',
//         table: 'boards',
//         filter: `project_id=eq.${projectId}`
//       }, (payload) => {
      
//       let obj = payload.new
//       obj['cards'] = []
//       setBoards(current => [...current, payload.new])

//       })
//       .subscribe()
 
//      return () => supabase.removeChannel(subscription)
//    }, [projectId])


//   const addboardHandler = async (name) => {
//     const { error} = await supabase
//     .from('boards')
//     .insert({
//       title: name,
//       project_id: projectId,
//     })

//     if (error) console.log(error)
//   };
  
//   const removeBoard = async (boardId) => {
//     const { error }  = await supabase 
//     .from('boards')
//     .delete()
//     .eq('id', boardId)
    
//     if(error) console.log(error)
//     setBoards(current =>  current.filter(board => board.id !== boardId))

//   };

//   const addCardHandler = async (boardId , title) => {

//     const { data, error}  = await supabase 
//     .from('cards')
//     .insert({
//       title: title,
//       board_id: boardId 
//     })
//     .select(`*, labels!labels_card_id_fkey(*), tasks!tasks_card_id_fkey(*))`)

//     if (error) console.log(error)
//     const boardIndex = boards.findIndex((item) => item.id == boardId);
//     if (boardIndex < 0) return;
//     const tempBoardsList = [...boards];
//     tempBoardsList[boardIndex].cards.push(data[0])
//     setBoards(tempBoardsList)

//   };

//   const removeCard = async (boardId, cardId) => {

//     const { error }  = await supabase 
//     .from('cards')
//     .delete()
//     .eq('id', cardId)
    
//     if(error) console.log(error)
//     const boardIndex = boards.findIndex((item) => item.id === boardId);
//     if (boardIndex < 0) return;

//     const tempBoardsList = [...boards];
//     const cards = tempBoardsList[boardIndex].cards;

//     const cardIndex = cards.findIndex((item) => item.id === cardId);
//     if (cardIndex < 0) return;

//     cards.splice(cardIndex, 1);
//     setBoards(tempBoardsList);
//   };

//   const updateCard = (boardId, cardId, card) => {
//     const boardIndex = boards.findIndex((item) => item.id === boardId);
//     if (boardIndex < 0) return;

//     const tempBoardsList = [...boards];
//     const cards = tempBoardsList[boardIndex].cards;

//     const cardIndex = cards.findIndex((item) => item.id === cardId);
//     if (cardIndex < 0) return;

//     tempBoardsList[boardIndex].cards[cardIndex] = card;

//     setBoards(tempBoardsList);
//   };

//   const onDragEnd = async (boardId , cardId ) => {
    
//     const sourceBoardIndex = boards.findIndex(
//       (item ) => item.id === boardId,
//     );
//     if (sourceBoardIndex < 0) return;

//     const sourceCardIndex = boards[sourceBoardIndex].cards.findIndex(
//       (item) => item.id === cardId,
//     );
//     if (sourceCardIndex < 0) return;

//     const targetBoardIndex = boards.findIndex(
//       (item ) => item.id === targetCard.boardId,
//     );
//     if (targetBoardIndex < 0) return;

//     const targetCardIndex = boards[targetBoardIndex].cards.findIndex(
//       (item) => item.id === targetCard.cardId,
//     );
//     if (targetCardIndex < 0) return;

//     const tempBoardsList = [...boards];
//     const sourceCard = tempBoardsList[sourceBoardIndex].cards[sourceCardIndex];
//     console.log(sourceCard, targetCard.boardId, boardId)
//     tempBoardsList[sourceBoardIndex].cards.splice(sourceCardIndex, 1);
//     tempBoardsList[targetBoardIndex].cards.splice(
//       targetCardIndex,
//       0,
//       sourceCard,
//     );
    

//     const { error } = await supabase
//     .from('cards')
//     .update({
//       board_id: targetCard.boardId,
//     })
//     .match({
//       id: sourceCard.id,
//     })

//     if(error) console.log(error)
    
//     setBoards(tempBoardsList);

//     setTargetCard({
//       boardId: '',
//       cardId: '',
//     });
//   };
  
  
//   const onDragEnter = async (boardId, cardId ) => {
//     if (targetCard.cardId === cardId) return; 
//     setTargetCard({
//       boardId: boardId,
//       cardId: cardId,
//     });
//   };

  

//   useEffect(() => {
//     updateLocalStorageBoards(boards);
//   }, [boards]);

  
//   return (
//     <div className="app">
//       <Navbar/>
//       <div className="app-boards-container">
//         <div className="app-boards">
//           {boards.map((item) => (
//             <Board
//               key={item.id}
//               board={item}
//               addCard={addCardHandler}
//               removeBoard={() => removeBoard(item.id)}
//               removeCard={removeCard}
//               onDragEnd={onDragEnd}
//               onDragEnter={onDragEnter}
//               updateCard={updateCard}
//               setBoards={setBoards}
//             />
//           ))}
//           <div className="app-boards-last">
//             <CustomInput
//               displayClass="app-boards-add-board"
//               editClass="app-boards-add-board-edit"
//               placeholder="Enter Board Name"
//               text="Add Board"
//               buttonText="Add Board"
//               onSubmit={addboardHandler}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;