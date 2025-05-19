
const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值


const MessageComp = ({message})=>{
    if(message.role === "tool"){
        return (
            <article class="media">
                <figure class="media-left">
                    <p class="image is-64x64">
                    <img src={`${baseURL}/static/Peter.jpg`} 
                        className="is-rounded"
                        alt={message.agentId} />
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                        <span>tool</span>
                    <p>
                        方面名称: {message.content?.name}<br/> 
                        {message.content?.arguments}
                    </p>
                    </div>
                </div>
                <div class="media-right">
                    <button class="delete"></button>
                </div>
            </article>
        )
    }
    if(message.role === "user"){
        return (
<article class="media">
                <figure class="media-left">
                    <p class="image is-64x64">
                    <img img src={`${baseURL}/static/zidea.jpg`} 
                        className="is-rounded" alt={message.userId}/>
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                        <span>user</span>
                    <p>
                        {message.content}
                    </p>
                    </div>
                </div>
                <div class="media-right">
                    <button class="delete"></button>
                </div>
            </article>
        )
    }
    if(message.role === "assistant"){
        return (
<article class="media">
        <figure class="media-left">
                    <p class="image is-64x64">
                    <img className="is-rounded" 
                    src={`${baseURL}/static/Peter.jpg`}  alt={message.agentId}/>
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                        <span>assistant</span>
                    <p>
                        {message.content}
                    </p>
                    </div>
                </div>
                <div class="media-right">
                    <button class="delete"></button>
                </div>
            </article>
        )
    }
}
export default MessageComp;
