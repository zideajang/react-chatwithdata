import Markdown from "react-markdown"
import Base64ImageComp from "./Base64ImageComp"
import { useContext, useState } from "react";
import HomePageContext from "../context/HomePageContext";
import { convert_chat } from "../api";
import { guessStringType } from "../common";



const ReportSectionComp = ({section})=>{

  const {
    setLoading,
    setError,
    currentAgentStatus,
    setCurrentAgentStatus,
    setIsOnConversation
  } = useContext(HomePageContext);

  const [covertedContent,setCovertedContent] = useState(null);
  
  const handleExplain = async (content)=>{
    console.log(content);
    try {
      setCurrentAgentStatus("开始尝试解释这些内容")
      setIsOnConversation(true);
      const covertedResponse = await convert_chat({
        value:JSON.stringify(content),
        target_format:guessStringType(content)
      });
      console.log(covertedResponse)
      setCovertedContent(covertedResponse)
    } catch (error) {
      setError(error)
      console.log(error)
    }finally{
      setIsOnConversation(false);
      setCurrentAgentStatus(null)
    }
    
  }
    
    if (section.role === "content") {
        return (<div className="box">

            <label className="label">{section?.title}</label>
            {covertedContent?(
              <Markdown>{covertedContent}</Markdown>
            ):(
              <Markdown>{section.content}</Markdown>
            )}
            {
              guessStringType(section.content) === "json"?(

              <button className="button" 
                disabled={!setIsOnConversation}
                onClick={(event)=>handleExplain(section.content)}>
                解释说明
              </button>
              ):(
                <></>
              )
            }
        </div>)
    }

    if (section.role === 'image'){
        return (<div className="box">

        <Base64ImageComp
            base64String={section.content.base64}
            mimeType={section.content.mimeType}
            altText={section?.title?section?.title:"default"}
            style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }} // Example styling
            />
        </div>)
    }
    if (section.role === "table"){
        return (<div className="box">
            <div className="table"> {/* Added a table container */}
              <h4>DataFrame Head:</h4>
              <table>
                <thead>
                  <tr>
                    {/* Render table headers */}
                    {section.content.columns.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Render table rows */}
                  {section.content.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {/* Render table cells */}
                      {row.map((cell, cellIndex) => (
                         // Display null or undefined as empty string or 'null'
                        <td key={cellIndex}>{cell !== null && cell !== undefined ? cell.toString() : ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>)
    }
}

export default ReportSectionComp;