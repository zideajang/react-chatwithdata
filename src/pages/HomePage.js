import AgentListComp from "../components/AgentListComp";
import ChatInputComp from "../components/ChatInputComp";
import MessageListComp from "../components/MessageListComp";
import ReportSectionListComp from "../components/ReportSectionListComp";
import ReportToolSetComp from "../components/ReportToolSetComp";
import ToolsetComp from "../components/ToolsetComp";
import UserProfileComp from "../components/UserProfileComp";
import { HomePageProvider } from "../context/HomePageContext";


const HomePage = ()=>{
    return (
        <HomePageProvider>
            <div className="mt-6 ml-3 mr-3">
                <div className="columns">
                    <div className="column is-one-third">
                        <ReportToolSetComp/>
                        <ReportSectionListComp/>
                    </div>
                    <div className="column is-one-third">
                        <ToolsetComp/>
                    </div>
                    <div className="column is-one-third " >
                        <div className="is-flex is-flex-direction-column" style={{
                        height:'93vh'
                    }}>
                        <div className="is-flex-grow-0" style={{
                            height:'225px'
                        }}>
                            <AgentListComp/>
                        </div>
                        <div className="is-flex-grow-1">
                            <MessageListComp/>
                        </div>
                        <div className="is-flex-grow-0" style={{
                            height:'200px'
                        }}>
                            <UserProfileComp/>
                            <ChatInputComp/>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomePageProvider>
    )
}

export default HomePage