import { RxCross1 } from "react-icons/rx";



const  ProjectItem = (props) => {
   
    //destructing the props
    const {details, projectClicked, applyStylingProject, projectDeletedRerender} = props;
    const {title, id} = details

    //styling according to the props received
    let styling = "w-100 rounded-lg flex justify-between"
    if(applyStylingProject===id) styling = "w-100 bg-slate-200 rounded-lg flex justify-between"


    //function that triggers when a project is deleted successfully and re-renders the component in TaskBoard
    const onSuccessProjectDeleted = () =>projectDeletedRerender()
    

    //function that deletes a project with its ID
    const deleteProjectBtnClicked = async() =>{

        const url = `https://track-pro-backend-fastapi.onrender.com/projects/${id}`
            const options = {
                method: 'DELETE',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            }
            const response = await fetch(url, options)
        
            if (response.ok) onSuccessProjectDeleted()
            else onFailureHomeApi()
    }

    
    //project opted triggers this function for getting the tasks associated with that project
    const projectSelectedCalled = () => projectClicked(id)
    

        return(
            <li className={styling}>
                <button type="button" className="p-2 flex justify-start text-start w-100 font-sans font-normal ml-2" onClick={projectSelectedCalled}>{title}</button>
                {applyStylingProject===id ?  <button type="button" onClick={deleteProjectBtnClicked}> <RxCross1 className="text-xs mr-6"/></button>: ""}
            </li>
        )
}


export default ProjectItem