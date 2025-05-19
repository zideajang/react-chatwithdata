import { useCallback, useContext, useState } from "react";
import HomePageContext from "../../context/HomePageContext";
import { getTableHead } from "../../api";


const DataHeadMCPComp = () => {
    const {
        filenames,
        setError,
        setLoading,
        setMcpMessages,
        setResponseData
    } = useContext(HomePageContext);

    const [rowNumber, setRowNumber] = useState(null);

    const handleTableHead = useCallback(async () => {
        const head = async () => {
            setError(null);
            setLoading(true)
            try {
                const response = await getTableHead(filenames[0], rowNumber);
                setMcpMessages((preMessages) => [...preMessages, response.message])
                setResponseData(response);
                console.log(response)

            } catch (error) {
                setError(error)
            } finally {
                setLoading(false);
            }
        }

        await head()
    })

    return (
        <div className="box" >
            <div className="level">
                <div className="level-left" onClick={(event) => { handleTableHead() }}>
                    <figure class="image is-32x32">
                        <img src="./images/table.png" alt="histogram" />
                    </figure>
                </div>
                <div className="level-item">
                    get_dataframe_head({filenames[0]})(MCP 方法)
                </div>
                <div className="level-right">
                    <div className="field">
                        <div className="control">

                            <input className="input"
                                type="number"
                                value={rowNumber}
                                defaultValue="请输入列名"
                                onChange={(event) => {
                                    event.preventDefault();
                                    setRowNumber(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DataHeadMCPComp;