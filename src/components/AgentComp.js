import { useContext } from "react";
import HomePageContext from "../context/HomePageContext";

import { motion } from 'framer-motion';

const AgentComp = ({agent,clickOnAgent})=>{
    const {
        currentAgent,
        isOnConversation,setIsOnConversation,
        currentAgentStatus,setCurrentAgentStatus
    } = useContext(HomePageContext)

    return (
  <div class={`box ${currentAgent.name===agent.name?"has-background-primary-10 has-text-primary-10-invert":""}`} onClick={clickOnAgent(agent)}>
    <div className="is-flex pt-3 is-justify-content-center ">
        <figure class="image is-64x64 is-1by1 mb-3">
            {isOnConversation ? (<motion.img
                        className="is-rounded"
                        src={agent.iconUrl}
                        alt={agent.name}
                        animate={{
                        scale: [0.85, 1.2, 0.85], // Define the scale keyframes (start, slightly larger, back to start)
                        }}
                        transition={{
                        duration: 1.5, // Adjust the duration of one loop cycle (in seconds)
                        ease: "easeInOut", // Choose an easing function for smoother animation
                        repeat: Infinity, // Set the animation to repeat infinitely for a loop
                        repeatType: "loop", // Ensure it loops smoothly from the last keyframe to the first
                        }}
                    />):(<img src={agent?.iconUrl} className="is-rounded" alt={agent.name}/>)}
            
            </figure>
    </div>
      <p className="is-size-5 has-text-centered">{agent.name} <span></span></p>
      <br />
      {currentAgentStatus && <p className="is-size=7">{currentAgentStatus}</p>}
</div>
    )
}

export default AgentComp;