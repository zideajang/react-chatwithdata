
import { useContext } from "react";
import HomePageContext from "../context/HomePageContext"

import { useForm } from "react-hook-form";

import { IoIosSend } from "react-icons/io";
import UserProfileComp from "./UserProfileComp";

const ChatInputComp = () => {

    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm();

    const {
        sendMessage,
        error,
        setError,
        loading,
    } = useContext(HomePageContext)
    return (
        <>  
        
        
            <form onSubmit={handleSubmit(sendMessage)}>
                <div className='box'>
                    <div className='field'>
                        <div className='control'>
                            <input
                                disabled={loading}
                                className={`input ${errors.query ? 'is-danger' : ''}`}
                                {...register("query", { required: "query 不能为空" })}
                            />
                        </div>
                        {errors.query && <p className='help is-danger'>{errors.query.message}</p>}
                    </div>
                    <div className="level">
                        <div className="level-right">
                            <div className='field'>
                                <div className='control'>
                                    <div className="buttons">

                                    <button type="submit" className={`button is-primary ${isSubmitting ? 'is-loading' : ''}`}>
                                        <span className="icon">
                                            <IoIosSend />
                                        </span>
                                        <span>
                                            发送
                                        </span>
                                    </button>
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className='notification is-warning'>
                        <p>错误信息: {error.message}</p>
                        <button className="delete" onClick={(event)=>{setError(null)}}></button>
                    </div>
                )}
            </form>
        </>
    )
}

export default ChatInputComp