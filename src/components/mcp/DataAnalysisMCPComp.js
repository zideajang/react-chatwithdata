import { useCallback, useContext, useState } from "react"
import HomePageContext from "../../context/HomePageContext"
import { convert_chat, getDataInfo,getDataDecribe,cleanMissingSummary } from "../../api"
import DescribeTableComp from "../DescribeTableComp";
import { cleanup } from "@testing-library/react";
const DataAnalysisMCPComp = ({method})=>{

    const  {
        setLoading,
        setError,
        filenames,
        reportSections,setReportSections,
        setInfoResponse,
        mcpMessages,setMcpMessages
    } = useContext(HomePageContext);

    const [describeResponse,setDescribeResponse] = useState(null)

    const methodMap = {
        'get_dataframe_info':getDataInfo,
        'get_dataframe_describe':getDataDecribe,
        'get_missing_values_summary':cleanMissingSummary,
    }


    const handleDataMethod = useCallback(async ()=>{
    
        const info = async()=>{
            setError(null);
            setLoading(true)
            console.log(method)
            try {
                console.log(filenames[0])
                const response = await methodMap[method](filenames[0]);
                setMcpMessages((preMessages)=>[...preMessages,response.message])
                if(method==="get_dataframe_describe"){
                    
                    const result_data = JSON.parse(response.result_json);
                    
                    setDescribeResponse(result_data)
                }else if(method==="get_missing_values_summary"){
                    
                    setInfoResponse(response.result_json)
                }else if(method==="get_dataframe_info"){
                    console.log(111)

                    const covertedResponse = await convert_chat(
                        JSON.parse(response.result_json),"json")
                    setInfoResponse(
                        covertedResponse
                    )

                }
                

            } catch (error) {
                console.log(error)
                setError(error)
                
            }finally{
                setLoading(false);
            }
        }
        await info()
    
        },[filenames])


        return (
            <>
            {
                describeResponse && (<div className="box" style={{
                }}><DescribeTableComp data={describeResponse}/></div>)
            }
            { filenames && filenames?.length > 0 &&<div className="box" >
                    <div className="level">
                        <div className="level-left" 
                            onClick={(event)=>{handleDataMethod()}}>
                            <figure class="image is-32x32">
                                <img src={`/images/${method}.png`} alt={method}/>
                            </figure>
                        </div>
                        <div className="level-item">
                            {method}({filenames[0]})(MCP 方法)
                        </div>
                        <div className="level-right">
                            <div className="field">
                                <div className="control">
                                    <input className="input" disabled  value={filenames[0]}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

 export default DataAnalysisMCPComp