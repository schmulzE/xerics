import Newboard from '../components/newBoard';
// import CreateBoard from '../components/createBoard';
import { useEffect, useState } from 'react';
import { DragDropContext } from "react-beautiful-dnd";
import supabase from '../lib/supabase';
import { useParams } from 'react-router-dom';


const CreateButton = ({ setIsShowing }) => {
  return (
    <>
      <div className="card rounded-none shadow-md h-fit w-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 my-6">
        <div className="card-body p-2">
          <button className="text-md text-left font-medium" onClick={(e) => {e.preventDefault(); setIsShowing(true)}}> 
            <i className="pi pi-plus"></i>
            Add another board
          </button>
        </div>
      </div>
    </>
  )
}
const initialColumns = {
  // todo: {
  //   id: 'todo',
  //   list: ['item 1', 'item 2', 'item 3']
  // },
  // doing: {
  //   id: 'doing',
  //   list: []
  // },
  // done: {
  //   id: 'done',
  //   list: []
  // }
}

const Project = () => {
  const [columns, setColumns] = useState(initialColumns)
  // const [isShowing, setIsShowing] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [boards, setBoards] = useState([])
  const {projectName} = useParams()

  useEffect(() => {
    const getProjectId = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id')
        .match({
          name: projectName,
        })
        .single()

        setProjectId(data?.id)
        // console.log(data.id)
    
    }

    if (projectName) {
      getProjectId()
    }
  }, [projectName])

  // console.log(boards)


  useEffect(() => {
    const getBoards = async () => {
      const { data } = await supabase
      .from('boards')
      .select('*, card:cards(*)')
      .match({project_id: projectId})
      .order('created_at', { ascending: true })
          
      
      if (data) {
        const result = Object.assign.apply(null, data.map(x => ({ [x.name]: { 'id': x.name, 'list': x.card} })));
      //   const testArr = data.map( (x,) => {
      //     return {[x.name]: { "id": x.name, "list": x.card}}        
      // });
      setColumns(result)
        // setColumns(prev => ({...prev, ...testArr}))
        setBoards(data)
      }
    }
    
    getBoards()
    
  }, [projectId])
  
  useEffect(() => {
    supabase
      .channel(`boards:room_id=eq.${projectId}`)
      .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
      }, (payload) => {
        // TODO: add new user to cache if their profile doesn't exist

        setBoards(current => [...current, payload.new])
        // console.log({[payload.new.name]: {"name": payload.new.name, 'list': payload.new.card}})
        setColumns(current => ({...current, [payload.new.name]: {'id': payload.new.name, 'list': []}}))
      })
      .subscribe()
      
      return () => supabase.removeChannel(supabase)
    }, [])

  //     useEffect(() => {
  //   supabase
  //   .channel(`cards:board_id=eq.${boardId}`)
  //   .on('postgres_changes',
  //     {
  //       event: 'INSERT',
  //       schema: 'public',
  //     }, (payload) => {
  //       // TODO: add new user to cache if their profile doesn't exist
  //       newCard(current => [...current, payload.new]);
  //     })
  //     .subscribe()
  //     console.log('boardID:',boardId)
      
  //     return () => supabase.removeChannel(supabase)
  //   }, [boardId])
  // console.log(id)
    

  const onDragEnd = ({ source, destination }) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null

    // Set start and end variables
    const start = columns[source.droppableId]
    const end = columns[destination.droppableId]

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_, idx) => idx !== source.index
      )

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index])

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList
      }

      // Update the state
      setColumns(state => ({ ...state, [newCol.id]: newCol }))
      return null
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (_, idx) => idx !== source.index
      )

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList
      }

      // Make a new end list array
      const newEndList = end.list

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index])

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList
      }

      // Update the state
      setColumns(state => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }))
      return null
    }
  }

  console.log(columns)

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-6 p-4">
          {Object.values(columns).map((col) => ( 
            <Newboard list={col.list} id={col.id} key={col.id}/>
          ))}
          hello
          {/* {boards.map((col) => ( 
            <NewBoard list={col.card} id={col.name} key={col.id}/>
          ))} */}
          {/* { isShowing ? <CreateBoard columns={columns} projectId={projectId} setColumns={setColumns} setBoard={setBoards} setIsShowing={setIsShowing}/> : <CreateButton isShowing={isShowing} setIsShowing={setIsShowing}/>} */}
        </div>
      </DragDropContext>
    </>
  )
}

export default Project