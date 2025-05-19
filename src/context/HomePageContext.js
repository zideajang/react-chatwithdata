import { createContext, useState, useEffect,useRef } from "react";
import { getUser,fetchAgents,getAgentList } from "../api";
import { ToastContainer, toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值


const HomePageContext = createContext({});


export const HomePageProvider = ({ children }) => {

    const websocket = useRef(null);
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [currentAgentStatus,setCurrentAgentStatus] = useState("请上传要分析的数据")
    
    // user
    const [user,setUser] = useState(null);
    const [isEditMode,setIsEditMode] = useState(false);

    // messages
    const [messages,setMessages] = useState([{
        role:"assistant",
        content:"我已经准备好了"
    }])

    // agent
    const [agents, setAgents] = useState([]);
    const [currentAgent, setCurrentAgent] = useState(null);

    const [tools,setTools] = useState([]);
    const [availableTools,setAvailableTools] = useState([])
    const [resultType,setResultType] = useState(null)
    const [availableResultType,setAvailableResultType] = useState([])
    const [isOnConversation,setIsOnConversation] = useState(false);


    // title
    const [title,setTitle] = useState('');
    const [topic,setTopic] = useState('');
    const [tags,setTags] = useState([]);
    const [references,setReferences] = useState([]);
    const [instructions,setInstructions] = useState([]);
    const [toneStyle,setToneStyle] = useState([]);
    const [targetAudience,setTargetAudience] = useState([]);

    const [reportContent,setReportContent] = useState(null);
    const [reportSections,setReportSections] = useState([])
    // message
    const [newMessage,setNewMessage] = useState(null)
    const [response,setResponse] = useState(null);
    const [filenames,setFilenames] = useState([]);
    const [infoResponse,setInfoResponse] = useState(null);

    // mcp 相关
    const [mcpMessages,setMcpMessages] = useState([])
    const [imageData, setImageData] = useState(null);
    const [responseData, setResponseData] = useState(null);
    // isExpandUserRequest
    const [isExpandUserRequest,setIsExpandUserRequest] = useState(false);
    const [currentMCP,setCurrentMCP] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const mcp = {
        "get_histogram":'/visualize/histogram',
        "get_dataframe_info":"/info",
        "get_missing_values_summary":"/clean/missing_summary",
        "get_scatter_plot":"/visualize/scatter",
        "get_dataframe_description":"/describe"
    }

    const executeCommand = async(result)=>{

            
            console.log("execute command...")
            const requestData = result.content?.arguments
            try {
                console.log(`${baseURL}${mcp[result.content?.name]}`)
                 const response = await fetch(`${baseURL}/api/mcp${mcp[result.content?.name]}`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: requestData,
                });


                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                // plot_base64
                // format

                // console.log(responseData)
                // console.log(mcp[result.content?.name].includes("visualize"))
                // console.log(typeof(mcp[result.content?.name]))
                if(mcp[result.content?.name].includes("visualize")){
                    setReportSections((prevSections)=>[...prevSections,{
                        role:"image",
                        content:{
                            base64:responseData.plot_base64,
                            title:responseData.message,
                            mimeType:`image/${responseData.format}`
                        }
                    }])
                }if(mcp[result.content?.name].includes("table")){

                }else{
                    setReportSections((prevSections)=>[...prevSections,{
                        role:"content",
                        title:responseData.message,
                        content:responseData.result_json
                    }])
                }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        websocket.current = new WebSocket('ws://localhost:8000/ws');

        websocket.current.onopen = () => {
        toast('WebSocket 已经连接');
        };

        websocket.current.onclose = () => {
        toast('WebSocket 已断开');
        };

        websocket.current.onmessage = async (event) => {
            try {
                const result = JSON.parse(JSON.parse(event.data))
                console.log(result.content)
                setMessages((preMessages)=>[
                    ...preMessages,
                    result
                ]);
                const  doSomthing = async()=>{
                    console.log("do something...")
                    await executeCommand(result)
                }
                await doSomthing();
                setIsOnConversation(false);
                
                // setMessages((prevMessages) => [...prevMessages, result]);
            } catch (error) {
                console.error("Error parsing modified JSON:", error);
            }finally{
                console.log(isOnConversation)
                if(isOnConversation === true){
                    setIsOnConversation(false);
                }
            }
        };

        websocket.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        };

        return () => {
        if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            websocket.current.close();
        }
        };
    }, []);


   useEffect(() => {
        let isMounted = true; // 添加一个标志来处理组件卸载的情况

        const fetchAgents = async () => {
            setLoading(true);
            setError(null); // 重置错误状态

            try {
                const response = await getAgentList();
                if (isMounted) {
                    response.data.data.forEach(agent => {
                        agent.iconUrl = `${baseURL}${agent.iconUrl}`
                        return agent
                    });
                    setAgents(response.data.data); // 根据你的后端返回结构调整
                    setCurrentAgent(response.data.data[0])
                    setLoading(false);

                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    setLoading(false);
                    console.error("获取 Agent 列表失败:", err);
                }
            }
        };

        const fetchUser = async () => {
            try {
                const userData = await getUser();
                if (isMounted) {
                    userData.data.iconUrl = `${baseURL}${userData.data.iconUrl}`
                    setUser(userData.data);
                    console.log("用户信息获取成功:", userData.data.name);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    console.error("获取用户信息失败:", err);
                }
            }
        };

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([fetchAgents(), fetchUser()]);
            
            if (isMounted) {
                setLoading(false);
            }
        };

        fetchData();

        // cleanup function 在组件卸载时执行
        return () => {
            isMounted = false;
        };
    }, []); // 空依赖数组表示 effect 只在组件挂载和卸载时执行一次

    


    const sendMessage = async (data) => {

        console.log("send message");
        console.log(data.query)

        setError(null);
        setResponse(null);

        try {
            if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                
                    const humanMessage = {
                        userId:user.id,
                        agentId:currentAgent.id,
                        role:"user",
                        content:data.query,
                        filePath:filenames[0]
                    }
                    if(isOnConversation === false){
                        setIsOnConversation(true);
                    }
                    setMessages((prevMessages) => [...prevMessages, humanMessage]);
                    websocket.current.send(JSON.stringify(humanMessage));
                    setNewMessage(null);
                }

        } catch (err) {
            console.log(err)
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <HomePageContext.Provider value={{
            loading, setLoading,
            error, setError,
            notification, setNotification,
            isEditMode,setIsEditMode,
            user,setUser,
            agents, setAgents,
            currentAgent, setCurrentAgent,
            tools,setTools,

            messages,setMessages,
            isExpandUserRequest,setIsExpandUserRequest,
            reportContent,setReportContent,
            reportSections,setReportSections,

            title,setTitle,
            topic,setTopic,
            tags,setTags,
            references,setReferences,
            instructions,setInstructions,
            toneStyle,setToneStyle,
            targetAudience,setTargetAudience,
            isOnConversation,setIsOnConversation,

            availableTools,setAvailableTools,
            resultType,setResultType,
            availableResultType,setAvailableResultType,
            filenames,
            setFilenames,
            sendMessage,
            toast,
            currentAgentStatus,setCurrentAgentStatus,
            mcpMessages,setMcpMessages,
            infoResponse,setInfoResponse,
            responseData, setResponseData,
            currentMCP,setCurrentMCP,
            setImageData,
            imageData, 
            fileInputRef,
            selectedFiles, setSelectedFiles

     }}>
        <ToastContainer />
            {children}
        </HomePageContext.Provider>
    )
}

export default HomePageContext;