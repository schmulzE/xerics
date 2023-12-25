import { ApiMockResponse } from "../dummyData";
// import supabase from '../lib/supabase';

const LocalStorageKeyName = "kanban-boards";
//Data Layer
export class BoardAPI {
  async fetchBoardList() {
    // const { data } = await supabase
    // .from('boards')
    // .select('*, card:cards(*)')
    // .match({project_id: projectId})
    // .order('created_at', { ascending: true })
    
    const apiData= ApiMockResponse;
    // const apiData = data;
    let BoardList= [];
    //first check local storage if local storage is empty then add api mock data as seed
    if (localStorage.getItem(LocalStorageKeyName)) {
      const localStorageData = JSON.parse(
        localStorage.getItem(LocalStorageKeyName) ?? "",
        );
      BoardList = [...localStorageData];
    } else {
      BoardList = [...apiData];
      updateLocalStorageBoards(BoardList);
    }
    
    console.log(BoardList)  
    return BoardList;
    //TODO:integrate API module when got API from backend team :)
    /*
      private readonly api = new Api();//it will have all Restful verbs functions
      return axios.get(`ENDPOINT_GOES_HERE`)
      .then((res: { data: any; }) => {
        return res.data;
      });
      */
  }
} //BoardAPI Class End

//Business Layer
export async function fetchBoardList(){
  const api = new BoardAPI();
  return api.fetchBoardList();
}
export function updateLocalStorageBoards(boards) {
  localStorage.setItem(LocalStorageKeyName, JSON.stringify(boards));
}