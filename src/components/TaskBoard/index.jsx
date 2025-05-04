import {Component} from "react"
import { v4 as uuidv4 } from 'uuid';
import Popup from 'reactjs-popup'
import { RxCross1 } from "react-icons/rx";
import ProjectItem from "../ProjectItem"
import TaskStatus from "../TaskStatus"
import ClipLoader from "react-spinners/ClipLoader";
import { getAuth, signOut } from "firebase/auth";
import {handlePermissionGrantedForFcmToken} from "../../integrations/firebase/fcm_token_generation"


// todo status details, add more if necessary!!
const todoStatusItems = [
    {id: uuidv4(),name : "To Do",namedb:"not_started", color: "text-blue-600",bgColor : "bg-blue-100"},
    {id: uuidv4(),name : "In Progress",namedb:"in_progress", color: "text-pink-400",bgColor : "bg-pink-100"},
    {id: uuidv4(),name : "In Review",namedb:"on_hold", color: "text-blue-400",bgColor : "bg-blue-100"},
    {id: uuidv4(),name : "Completed",namedb:"completed", color: "text-green-400",bgColor : "bg-green-100"},
];

class TaskBoard extends Component {

    // state object that holds the initial values
    state = {projectsItems: [],projectSelected:'',todoTasksList:[],newProject: '', todoLoading: true,
    errProjectPara: false,currentProject:"",search:'',showModal:false, loading: true}


    //Build in function that calls the below function as the page loads
    componentDidMount = () => {
        this.projectItemsFunctionAPI()
        const notificationPermission = localStorage.getItem('pushNotificationPermission');

        if (!notificationPermission) {  
          this.showNotification("Can this website send you notifications?", "info");
        }
    }

    // Function to show the notification
    showNotification(message) {
      
        const notification = window.confirm(message);

        // If the user accepts, store their response in localStorage
        if (notification) {
            localStorage.setItem('pushNotificationPermission', true);
            handlePermissionGrantedForFcmToken();
            console.log('User allowed notifications');
        } else {
            localStorage.setItem('pushNotificationPermission', false);
            console.log('User denied notifications');
        }
    }
    
    //function that triggers when a project is opted from the list
    onSuccessProjectSelectedTodos = (data,projectId)=>{
        if(data.length!==0) this.setState({todoTasksList: data,projectSelected: projectId});
        else this.setState({todoTasksList: data,projectSelected: projectId});
    }


    //function that get all todo tasks details from TODO table with a given projectId
    projectSelectedItemsAPI = async (projectId) => {
        this.setState({ todoLoading: true });
      
        if (projectId !== '' && projectId !== undefined) {
          const token = localStorage.getItem('authToken');
          const url = `http://127.0.0.1:8000/projects/${projectId}/tasks`;
          const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
          };
      
          try {
            const response = await fetch(url, options);
            const data = await response.json();
      
            if (response.ok) {
              this.onSuccessProjectSelectedTodos(data, projectId);
            } else {
              this.onFailureProjectSelectedTodos();
            }
          } catch (error) {
            console.error('API Error:', error);
            this.onFailureProjectSelectedTodos();
          } finally {
            this.setState({ todoLoading: false });
          }
        } else {
          this.setState({ todoLoading: false });
        }
      };
      

    //function triggers when fetching projects details from table is successfull
    onSuccessGetProjectsItemsApi = (data) => {

        if(data!==undefined && data.length !== 0  ) {
            let projectNameforIndex0 =data[0].title
            this.projectSelectedItemsAPI(data[0].id)
            this.setState({projectsItems: data,projectSelected: data[0].id,currentProject: projectNameforIndex0})    
        }
        else this.setState({projectsItems:[],currentProject:''})
    }

    onFailureGetProjectsItemsApi = () => {

    }


    //function that gets all the project details from the PROJECTS table
    projectItemsFunctionAPI =async () =>{
        this.setState({ loading: true }) // set loading before API call
        const token = localStorage.getItem('authToken');
        console.log(token,")))))))))))))))))")
        const url = "http://127.0.0.1:8000/projects"
        const options = {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        }
        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok) {
            this.onSuccessGetProjectsItemsApi(data);
            } else {
            this.onFailureGetProjectsItemsApi();
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            this.setState({ loading: false }); // done loading
        }
    }

    //function triggers when a new project opted
    newProjectChanged = (event)=> this.setState({newProject: event.target.value})
    

    //function that gives the opted project name
    projectClicked = (projectId) =>{

        const {projectsItems} = this.state
        let clickedProjectName=""
        projectsItems.map(each=>{
            if(each.id===projectId) clickedProjectName = each.title
        })
        this.setState({currentProject: clickedProjectName})
        this.projectSelectedItemsAPI(projectId)
    } 
    

    //function that give popup for adding new project
    reactPopUpNewProject = () => {
        const {errProjectPara,newProject} =this.state
        return(
          <Popup
            modal
            trigger={
              <button type="button" className="text-blue-400 p-2 pl-4 text-xs">
                + Add new Project
              </button>
            }>
            {close=>(
                
                <div className="bg-white h-66  grid grid-rows-2 pt-6 pb-6 w-96 rounded-lg shadow-2xl">
                   <div className="flex justify-between pl-4 pr-4 mb-4">
                        <h1>Add new Project</h1>
                        <RxCross1  onClick={() => close()} className="cursor-pointer" />
                    </div>
                    <hr className="bg-gray-400"/>
                    <div className="pb-10 pl-4 pr-4">
                        <form >
                            <div>
                                <label htmlFor="projectId" className="pb-4 font-large text-xs text-gray-600">Name of the Project</label>
                                <input type="text" id="projectId"  placeholder="Project" onChange={this.newProjectChanged} className="w-full p-2 mt-3 font-normal text-gray-500 text-xs border-2  border-gray-200 rounded-lg" required/>
                                {errProjectPara ? <p className="text-red-400 text-xs font-sans text-normal">Please Enter the Project!!</p>: ""}
                            </div>
                            <div className="flex justify-end mt-3">
                                <button type="button" className="text-blue-400 bg-blue-100 rounded-md p-1 pl-2 pr-2 mr-3 font-medium text-xs" onClick={() => close()}>Cancel </button>
                                <button type="button" className="text-white bg-blue-400 rounded-md p-1 pl-2 pr-2 font-medium text-xs" 
                                onClick={
                                    () =>{
                                        this.newProjectAddBtnClicked()
                                        if(newProject!=="") close()
                                    }
                                }>Add</button>
                            </div>
                        </form>
                    </div>  
                </div>
              
            )}
          </Popup>
       )
    }


    //called when a project is added successfully and calls below function for immediate re-rendering
    onSubmitSuccessNewProject = ()=> this.projectItemsFunctionAPI()
    

    //function to add a new project into the table PROJECTS
    newProjectAddBtnClicked =async () =>{

        const {newProject} = this.state
    
        if(newProject!==''){
            const token = localStorage.getItem('authToken');
            const url = "http://127.0.0.1:8000/projects"
            const options = {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: `{
                    "title" : "${newProject}"
                }`,
            }
            const response = await fetch(url, options)
            const data = await response.json()
            
            if (response.ok === true) this.onSubmitSuccessNewProject(data)
            else  this.onSubmitFailure(data.error_msg)
        } 
        else this.setState({errProjectPara: true})
    }

    logoutBtnClicked = () =>{
        const auth = getAuth();
        signOut(auth)
        .then(() => {
            console.log("User signed out successfully.");
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
    }

    
    searchChanged = (event) =>{
        this.setState({search : event.target.value})
    }

    //after deleting a project, below func re-renders
    projectDeletedRerender = ()=> this.projectItemsFunctionAPI()
    

    //after deleting a todo task, below func re-renders 
    deletedTodoTaskRerender=(projectId)=> this.projectSelectedItemsAPI(projectId)
    
  
    //after adding a new todo, below function re-renders
    newtodoAddedRerender = (projectId)=> this.projectSelectedItemsAPI(projectId)

    render(){
        const {projectsItems,todoTasksList,projectSelected,currentProject,search,loading, todoLoading} = this.state
        return(
            <div className="grid  h-screen w-screen grid-cols-6 grid-flow-row gap-0.5 bg-slate-200  ">
                <div className=" bg-gray-100  col-span-1  flex justify-start items-center gap-x-2 pl-4 p-6">
                    <img src="./logo.png" alt="logo" className="h-6"/>
                    <h2 className="font-sans font-medium flex  max-md:hidden">Task boards</h2>
                </div>
                <div className="  bg-gray-100 col-span-5 pl-8 flex items-center font-sans font-medium justify-around">
                    <h1 className=" flex  max-md:hidden ">My Projects / <span className="text-blue-500 ml-2">{currentProject}</span></h1>
                    <div className="flex bg-gray-300 rounded-md p-2 color-red">
                    <button type="button p-2" onClick={this.logoutBtnClicked} className="text-red-500">Logout</button>
                </div>
                </div>
                    <div className="bg-gray-100 col-span-1 row-span-12 min-md:flex  max-md:hidden">
                   
                        {loading ? 
                            <div className="grid gap-y-3 w-100 p-2 pl-4 pt-6 pb-6 justify-center">
                                <ClipLoader
                                    color="#14aee8"
                                    size={20}
                                    />  
                            </div> : 
                            <ul className="grid gap-y-3 w-100 p-2 pl-4 pt-6 pb-6">                         
                                {projectsItems.lenth===0 ? '' : projectsItems.map(each=>(
                                <ProjectItem key={each.project_id} details={each} projectClicked={this.projectClicked} 
                                applyStylingProject={projectSelected} projectDeletedRerender={this.projectDeletedRerender}
                                />))}
                            </ul> 
                        }
                        <hr/>
                    <div>
                        {this.reactPopUpNewProject()}
                </div>
                </div>
                <div  className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 bg-gray-200 col-span-5 max-md:col-span-6  row-span-12 gap-x-0.5 overflow-x-auto justify-center">
                    {todoLoading ? <ClipLoader
                                    color="#14aee8"
                                    size={20}
                                    />  :   <ul className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 bg-gray-200 col-span-5 max-md:col-span-6  row-span-12 gap-x-0.5 overflow-x-auto">
                                    {todoStatusItems.map(each=>(<TaskStatus key={each.id} details={each} todoTasks={todoTasksList} todoLoading={todoLoading}
                                    projectSelected={projectSelected} newtodoAddedRerender={this.newtodoAddedRerender} 
                                    deletedTodoTaskRerender={this.deletedTodoTaskRerender} searchTodo={search}/>))}
                                </ul>}
                </div>
              
            </div>
        )
    }
}

export default TaskBoard