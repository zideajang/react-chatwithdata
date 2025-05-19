import axios from 'axios';

// 设置 Axios 的 baseUrl
// const baseURL = '/api'; // 假设你的后端 API 服务的基础路径是 /api
const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值

const instance = axios.create({
  baseURL: baseURL,
  timeout: 100000, // 可选: 设置请求超时时间 (毫秒)
  // headers: { 'Authorization': 'Bearer YOUR_AUTH_TOKEN' } // 可选: 设置全局请求头
});



/**
 * 获取 agent 列表
 * @returns {Promise<AxiosResponse>}
 */
export const getAgentList = async () => {
  return await instance.get('/api/agents');
};

// 获取 用户
export const getUser = async () => {
  console.log("getUser")
  return await instance.get('/api/users/2738b3a4-8928-417f-94ec-e6567a1092ff');
};

export const uploadFiles = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file); // FastAPI 接口期望字段名为 'files'
    });

    const response = await instance.post(`/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 上传文件必须设置此请求头
      },
    });

    return response.data; // 返回包含上传文件名的对象，例如 { filenames: ['hash1.jpg', 'hash2.png'] }
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error; // 抛出错误以便组件处理
  }
};

export const getDataInfo = async(file_path) =>{
    try {
        const response =  await instance.post("/api/mcp/info",{
            data_source:{
                file_path:file_path
            }
        })
        return response.data
    } catch (error) {
        console.error(error);        
    }
}

export const getDataDecribe = async(file_path) =>{
    try {
        const response =  await instance.post("/api/mcp/describe",{
            data_source:{
                file_path:file_path
            }
        })
        return response.data
    } catch (error) {
        console.error(error);        
    }
}
export const cleanMissingSummary = async(file_path) =>{
    try {
        const response =  await instance.post("/api/mcp/clean/missing_summary",{
            data_source:{
                file_path:file_path
            }
        })
        return response.data
    } catch (error) {
        console.error(error);        
    }
}

export const convert_chat = async (value,targetFormat)=>{
    const payload = {
        value: value,
        target_format: targetFormat,
        // Add any other fields required by your ConversionPayload model
    };

    try {
      // Make the POST request using fetch
        const response = await instance.post("/api/convert",payload)
        const responseData = response.data;


      // Update the result state with the converted text from the response
      // Based on your backend code, the result is in 'converted_output_placeholder'
      if (responseData && responseData.converted_output_placeholder) {
         return responseData.converted_output_placeholder
      } else {
         // Handle unexpected response structure
         console.warn('Received unexpected response structure:', responseData);
      }


    } catch (err) {
      // Catch network errors, JSON parsing errors, or errors thrown above
      console.error('Error during conversion:', err);
      return err
    }

}

export const getTableHead  = async (filePath,rowNumber) => {
  try {
    const response = await instance.post('/api/mcp/table/head',{
      data_source:{
        file_path:filePath
      },
      params:{
        n:rowNumber
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const getHistogram = async (filePath,params) =>{
  try {
    const response = await instance.post('/api/mcp/visualize/histogram',{
      data_source:{
        file_path:filePath
      },
      params:params
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const getScatterPlot = async (filePath,params) =>{
  try {
    const response = await instance.post('/api/mcp/visualize/scatter',{
      data_source:{
        file_path:filePath
      },
      params:params
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}