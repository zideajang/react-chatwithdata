import { useContext } from "react";
import HomePageContext from "../context/HomePageContext";
import AgentComp from "./AgentComp";



const AgentListComp = ()=>{
    const {
        agents
    } = useContext(HomePageContext)

    const clickOnAgent = (agent)=>{

    }
    return (
        <div className="columns">
        {agents.length > 0 && agents.map((agent,idx)=>(
            <div className="column">
                <AgentComp agent={agent} key={agent.id} clickOnAgent={clickOnAgent}/>
            </div>
        ))
            
        }
        </div>
    )
}

export default AgentListComp;