import { useContext } from "react";
import HomePageContext from "../context/HomePageContext";
import MessageComp from "./MessageComp";



const MessageListComp = ()=>{
    const {
        messages
    } = useContext(HomePageContext)

    return (
        <div className="box">
        {messages && messages.map((message,idx)=>(
            <MessageComp key={`message-${idx}`} message={message}/>
        ))}
        </div>
    )
}

export default MessageListComp;