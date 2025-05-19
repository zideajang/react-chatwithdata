import { useCallback, useContext, useEffect, useState,useMemo } from "react";

import HomePageContext from "../context/HomePageContext";

import Markdown from "react-markdown"
import Base64ImageComp from "./Base64ImageComp";
import HistogramMCPComp from "./mcp/HistogramMCPComp";
import DataAnalysisMCPComp from "./mcp/DataAnalysisMCPComp";
import DataHeadMCPComp from "./mcp/DataHeadMCPComp";
import ScatterPlotMCPComp from "./mcp/ScatterPlotMCPComp";
import SwarmPlotMCPComp from "./mcp/SwarmPlotMCPComp";
import DistributionPlotComp from "./mcp/DistributionPlotComp";
import QuartilePlotComp from "./mcp/QuartilePlotComp";
import CompareCountPlotComp from "./mcp/CompareCountPlotComp";
import HandleMissingValuesComp from "./mcp/HandleMissingValuesComp";


const ToolsetComp= ()=>{

    const  {
        filenames,
        error,
        setReportSections,
        mcpMessages,
        imageData,
        responseData, setResponseData,
        infoResponse,setInfoResponse,
        setImageData,
        currentMCP,setCurrentMCP,
        triggerFileInput, 
        handleFileUploadFromContext, 
        selectedFiles 
    } = useContext(HomePageContext)

    const handleUploadButtonClick = () => {
        if (selectedFiles.length > 0) {
            handleFileUploadFromContext(selectedFiles);
        } else {
        console.warn('No files selected.');
        // Optionally provide user feedback
        }
    };

    const dataframeData = useMemo(() => {
    if (responseData && responseData.dataframe_json) {
      try {
        // Parse the nested JSON string
        const parsedData = JSON.parse(responseData.dataframe_json);
        // Basic validation
        if (parsedData && Array.isArray(parsedData.columns) && Array.isArray(parsedData.data)) {
          return parsedData;
        }
      } catch (e) {
        console.error("Failed to parse dataframe_json:", e);
        // Handle parse error if necessary, maybe set a specific parse error state
      }
    }
    return null; // Return null if data is not available or parsing failed
  }, [responseData]); // Depend on responseData
    
    return (
        <>
        {error && <div className="notification">
            {JSON.stringify(error)}
            </div>}
        {imageData && (
            <div className="box">
                <div className="level">
                    <div className="level-left">
                        <label className="label">{`预览列的直方图`}</label>
                    </div>
                    <div className="level-right">
                        <div className="buttons">
                            <button className="button" onClick={(event)=>{
                                setReportSections((prevSections)=>[
                                    ...prevSections,
                                    {
                                        role:"image",
                                        content:imageData
                                    }
                                ])

                            }} >添加</button>
                        <button className="delete" onClick={(event)=>setImageData(null)}/>
                        </div>
                    </div>
                </div>
        <Base64ImageComp
          base64String={imageData.base64}
          mimeType={imageData.mimeType}
          altText="Image from API"
          style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }} // Example styling
        />
            </div>
        )}
        {responseData && (
            <div className="box">
                <div className="level">
                    <div className="level-left">
                        <label className="label">数据表预览</label>
                    </div>
                    <div className="level-right">
                        <button className="button" onClick={(event)=>{
                                setReportSections((prevSections)=>[
                                    ...prevSections,
                                    {
                                        role:"table",
                                        title:"数据表预览",
                                        content:dataframeData
                                    }
                                ])

                            }}>添加</button>
                        <button className="delete" onClick={(event)=>setResponseData(null)}/>
                    </div>
                </div>
        <div className="response-section">
          
          <p>Message: {responseData.message}</p>
          <p>Shape: [{responseData.shape ? responseData.shape.join('x') : 'N/A'}]</p> {/* Display shape */}

          {/* Render the DataFrame data as a table */}
          {dataframeData ? (
            <div className="dataframe-table-container"> {/* Added a table container */}
              <h4>DataFrame Head:</h4>
              <table>
                <thead>
                  <tr>
                    {/* Render table headers */}
                    {dataframeData.columns.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Render table rows */}
                  {dataframeData.data.map((row, rowIndex) => (
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
          ) : (
            // Show message if parsing failed or data structure is unexpected
            <p>Could not display DataFrame table. Invalid data received.</p>
          )}
        </div>
        </div>
      )}
        {
            filenames && filenames?.length === 0 && 
            <div className="notification is-warning">
                <p className="is-size-7">请选择要分析的数据文件</p>
                <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
                    <ul>
                        <li>
                            <button  className="tag is-link"
                                onClick={triggerFileInput}
                                >选择文件</button>
                        </li>
                        <li><button className="tag is-link">上传文件</button></li>
                    </ul>
                </nav>
            </div>
        }
        {infoResponse && (
    <div className="box">
        <div className="level">
            <div className="level-left">
                <label className="label">表的基本信息</label>
            </div>
            <div className="level-right">
                <button className="button" onClick={(event)=>{
                     setReportSections((prevSections)=>[
                                    ...prevSections,
                                    {
                                        role:"content",
                                        content:infoResponse,
                                        title:"基本信息"
                                    }
                                ])
                }} >添加</button>
                <button className="delete" onClick={(event)=>setInfoResponse(null)}/>
            </div>
        </div>
    <div  style={{
    }}>
        <Markdown style={{
            width:'360px'
            
        }}>{infoResponse}</Markdown>

    </div>
    </div>
    )}
        {   
            <div className="content">

        {    mcpMessages && mcpMessages.map((message,idx)=>(
                <li key={`message-${idx}`}>{message}</li>
                ))}
            </div>
        }
        {
            currentMCP === "info"&&(
                <DataAnalysisMCPComp method={'get_dataframe_info'}/>
            )
        }
        {
            currentMCP === "/clean/missing_summary"&&(
                <DataAnalysisMCPComp method={'get_missing_values_summary'}/>
            )
        }
        {
            currentMCP === "describe"&&(
                <DataAnalysisMCPComp method={'get_dataframe_describe'}/>
            )
        }
        {
            currentMCP === "histogram"&&(
                <HistogramMCPComp/>
            )
        }
        {
            currentMCP === "table/head"&&(
                <DataHeadMCPComp/>
            )
        }
        {
            currentMCP === "scatter"&&(
                <ScatterPlotMCPComp/>
            )
        }
        {
            currentMCP === "visualize/swarm_plot"&&(
                <SwarmPlotMCPComp/>
            )
        }
        {
            currentMCP === "visualize/distribution"&&(
                <DistributionPlotComp/>
            )
        }
        {
            currentMCP === "visualize/quartile_plot"&&(
                <QuartilePlotComp/>
            )
        }
        {
            currentMCP === "visualize/compare_countplot"&&(
                <CompareCountPlotComp/>
            )
        }
        {
            currentMCP === "clean/table/handle_missing"&&(
                <HandleMissingValuesComp/>
            )
        }
        {
            filenames.length > 0 && (
                <>
                <div className="grid">
                    <div class="cell">
                        <div className="box" onClick={(event)=>setCurrentMCP("info")}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/get_dataframe_info.png" alt="简要摘要信息" />
                            </figure>
                            <div className="label">摘要信息</div>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <div className="box" onClick={(event)=>setCurrentMCP("describe")}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/get_dataframe_describe.png" alt="初步了解数值型数据的分布" />
                            </figure>
                            <div className="label">数据分布</div>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <div className="box" onClick={(event)=>setCurrentMCP("/clean/missing_summary")}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/get_missing_values_summary.png" alt="初步了解数值型数据的分布" />
                            </figure>
                            <div className="label">检索数据缺失</div>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <div className="box" onClick={(event)=>{
                            setCurrentMCP("histogram")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/histogram.png" alt="直方图"/>
                            </figure>
                            <div className="label">直方图</div>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <div className="box" onClick={(event)=>{
                            setCurrentMCP("scatter")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/scatter.png" alt="散点图"/>
                            </figure>
                            <div className="label">散点图</div>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <div className="box" onClick={(event)=>{
                            setCurrentMCP("visualize/swarm_plot")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/chart.png" alt="蜂群图"/>
                            </figure>
                            <div className="label">蜂群图</div>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <div className="box" onClick={(event)=>{
                            setCurrentMCP("visualize/distribution")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/distribution.png" alt="分布图"/>
                            </figure>
                            <div className="label">分布图</div>
                            </div>
                        </div>
                    </div>
                     <div class="cell">
                        <div className="box" onClick={(event)=>{
                            setCurrentMCP("visualize/quartile_plot")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/chart2.png" alt="分布图"/>
                            </figure>
                            <div className="label">分位数图</div>
                            </div>
                        </div>
                    </div>
                     <div class="cell">
                        <div className="box" onClick={(event)=>{
                            setCurrentMCP("clean/table/handle_missing")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/analysis.png" alt="缺失值处理"/>
                            </figure>
                            <div className="label">缺失值处理</div>
                            </div>
                        </div>
                    </div>
                     <div class="cell">
                        <div className="box" onClick={(event)=>{
                            setCurrentMCP("visualize/quartile_plot")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/chart2.png" alt="分布图"/>
                            </figure>
                            <div className="label">对比比较图</div>
                            </div>
                        </div>
                    </div>
                     <div class="cell">
                        <div className="box" onClick={(event)=>{
                            setCurrentMCP("visualize/compare_countplot")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/chart.png" alt="分布图"/>
                            </figure>
                            <div className="label">对比计数图</div>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <div className="box"onClick={(event)=>{
                            setCurrentMCP("table/head")
                            
                            }}>
                            <div className="is-flex is-justify-content-center 
                            is-align-self-center
                            is-align-items-center	
                            is-flex-direction-column">

                            <figure class="image is-64x64">
                            <img src="./images/table.png" alt="预览"/>
                            </figure>
                            <div className="label">预览</div>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <div className="box">

                        </div>
                    </div>
                </div>
                </>
            )
        }
        
        </>
    )
}

export default ToolsetComp;