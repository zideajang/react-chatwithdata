import { useContext } from "react";
import HomePageContext from "../context/HomePageContext";



const ProgressComp = ()=>{
    const {
        loading
    } = useContext(HomePageContext)

    return (
        <>
        {loading?(
            <progress class="progress is-small is-primary" max="100">15%</progress>
        ):(
            <></>
        )}
        </>
    )
}

export default ProgressComp;