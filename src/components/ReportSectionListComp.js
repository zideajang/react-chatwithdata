import { useContext } from "react";
import HomePageContext from "../context/HomePageContext";
import ReportSectionComp from "./ReportSectionComp";


const ReportSectionListComp = ()=>{
    const {
        reportSections
    } = useContext(HomePageContext)

    return (
        <div className="box">
            { reportSections.length > 0?(
                reportSections.map((section,idx)=>(
                    <ReportSectionComp section={section} key={`section-${idx}`}/>
                ))
            ):(
                <div className="notificaion">
                    暂时没有内容
                </div>
            )

            }  
        </div>
    )
}

export default ReportSectionListComp;