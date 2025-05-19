import { useContext,useState } from "react";
import HomePageContext from "../context/HomePageContext";
import { uploadFiles } from "../api";
import { FaUpload } from "react-icons/fa";


const UserProfileComp = () => {
    const {
        user,
        filenames,
        setFilenames,
        setLoading,
        toast,
        setError,
        fileInputRef,
        setMessages,
        selectedFiles, setSelectedFiles
    } = useContext(HomePageContext);

    
    const [uploadedFilenames, setUploadedFilenames] = useState([]);
    

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      setError(null);
      setLoading(true);
      try {
          const data = await uploadFiles(selectedFiles);
          setUploadedFilenames(data.filenames);
          setFilenames(data.filenames)
          setMessages((prevMessages)=>[...prevMessages,{
            role:"assistant",
            content:`已经完成文件上传 ${data.filenames[0].name}`
          }])
        } catch (error) {
            setError('文件上传失败，请重试。');
        }finally{
            setLoading(false);
      }
    } else {
      console.log('请先选择文件。');
    }
  };

    return (
        <div className="level">
            <div className="level-left">
                {user ? (<article className="media" >
                    <figure className="media-left">
                        <p className="image is-48x48 is-1by1">
                            <img className="is-rounded" src={user.iconUrl} alt={user.name} />
                        </p>
                    </figure>
                    <div className="media-content">
                        <div className="content">
                            <p>
                                <strong>{user.name}</strong>
                                <br />
                                {user.description}
                            </p>
                        </div>

                    </div>
                </article>

                ) : (
                    <div className="notifiction is-warning">
                        <p>没有找到任何用户，请登录</p>
                    </div>

                )}
            </div>
            <div className="level-item">
                <p className="tags">
                    {filenames.length > 0?(
                            filenames.map((file,idx)=>(
                            <span className="tag is-warning is-medium" key={`filename-${idx}`}>
                                已上传文件{file}
                                <button class="delete is-small" onClick={(event)=>setFilenames([])}></button>
                            </span>
                        ))
                    ):(
                        <>
                        {selectedFiles.length > 0? (
                            <div className="tags">
                            
                            <span className="tag is-medium">点击上传</span>
                            {selectedFiles &&
                                selectedFiles.map((file,idx)=>(
                                    <span className="tag is-warning is-medium" key={`filename-${idx}`}>
                                        {file.name}
                                        <button class="delete is-small" onClick={(event)=>setSelectedFiles([])}></button>
                                    </span>
                            ))
                        }
                        </div>
                        ):(
                            <span className="tag is-medium">请选择要分析的数据文件(格式仅支持 csv )</span>
                        )}
                        </>
                    )}
                </p>
            </div>
            <div className="level-right">
                <div className="file">
                    <label className="file-label">
                        <input className="file-input" 
                            type="file" 
                            name="resume" 
                            multiple // 允许选择多个文件
                            onChange={handleFileChange}
                            ref={fileInputRef} 
                            />
                        <span className="file-cta">
                            <span className="file-icon">
                                <FaUpload/>
                            </span>
                            <span className="file-label"> 选择文件 </span>
                        </span>
                    </label>
                </div>
            </div>
            <div className="leve-item">
                <button className="button is-primary" onClick={handleUpload}>
                    上传
                </button>
            </div>
        </div>
    )
}

export default UserProfileComp;