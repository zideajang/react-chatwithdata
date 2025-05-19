import React, { useContext, useState, useEffect } from "react";
import HomePageContext from "../../context/HomePageContext";
import { useForm } from 'react-hook-form';
import DataFrameTableComp from "./DataFrameTableComp";
import { FaFileDownload } from "react-icons/fa";

const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值

const HandleMissingValuesComp = () => {
  const {
    error,
    loading,
    setError,
    setLoading,
    filenames,
    setMcpMessages, // 注意这里，可能需要一个专门处理清洗消息的状态
    // imageData, // 清洗操作通常不直接返回图片
    // setImageData,
    refreshData // 假设 Context 中有刷新数据的函数
  } = useContext(HomePageContext);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      strategy: 'drop_rows', // 默认策略
      how_drop: 'any',
    },
  });
  const [availableColumns, setAvailableColumns] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const watchStrategy = watch('strategy');
  const watchApplyToAll = watch('applyToAll');

  // 模拟获取列名的函数，你需要替换为真实的 API 调用
  const fetchColumnNames = async () => {
    if (filenames && filenames.length > 0) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseURL}/api/mcp/data/columns`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data_source: {
              file_path: filenames[0],
            },
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "获取列名失败");
        }
        const result = await response.json();
        setAvailableColumns(result.columns);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    } else {
      setAvailableColumns([]);
    }
  };

  useEffect(() => {
    fetchColumnNames();
  }, [filenames]);

  const onSubmit = async (data) => {
    console.log("Handling Missing Values with:", data);
    setError(null);
    setLoading(true);
    try {
      const payload = {
        data_source: {
          file_path: filenames[0],
        },
        params: {
          columns: data.applyToAll ? null : data.columns,
          strategy: data.strategy,
          how_drop: (data.strategy === 'drop_rows' || data.strategy === 'drop_columns') ? data.how_drop : undefined,
          thresh_drop: (data.strategy === 'drop_rows' || data.strategy === 'drop_columns') ? parseInt(data.thresh_drop) || undefined : undefined,
          fill_strategy: data.strategy === 'fill' ? data.fill_strategy : undefined,
          fill_value: data.strategy === 'fill' && data.fill_strategy === 'constant' ? data.fill_value : undefined,
        },
      };

      const response = await fetch(`${baseURL}/api/mcp/clean/table/handle_missing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "处理缺失值失败");
      }

      const result = await response.json();
      setMcpMessages((prevMessages) => [...prevMessages, result.message]);
      // 处理成功后，可能需要刷新数据表格
      setApiResponse(result);
      if (refreshData) {
        refreshData();
      }

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    {apiResponse && apiResponse.dataframe_json && (
        <button className="button is-primary" onClick={openModal}>
        查看数据表
      </button>
      )}
      {isModalOpen && apiResponse && apiResponse.dataframe_json && (
        <DataFrameTableComp
          dataFrameJson={apiResponse.dataframe_json}
          dataFramePath={apiResponse.dataframe_path}
          onClose={closeModal}
          modalTitle="处理结果" // 自定义 Modal 标题
          defaultDownloadFilename="processed_data.csv" // 自定义默认下载文件名
        />
      )}
    <div className="box">
      <div className="level">
        <div className="level-left">
          <figure className="image is-32x32">
            <img src="./images/analysis.png" alt="handle missing" /> {/* 假设你有一个处理缺失值的图标 */}
          </figure>
        </div>
        <div className="level-item">
          处理缺失值 ({filenames[0]})
        </div>
        <div className="level-right">
          {/* 可以添加一些额外的控制元素 */}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input type="checkbox" {...register('applyToAll')} />
              <span className="ml-3">应用到所有列</span>
            </label>
          </div>
        </div>

        {!watchApplyToAll && (
          <div className="field">
            <label className="label" htmlFor="columns">
              选择列
            </label>
            <div className="control">
              <div className="select is-multiple is-info" >
                <select multiple {...register('columns')} style={{
                minWidth:'480px'
              }}>
                  {availableColumns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              {errors.columns && <p className="help is-danger">请选择要处理的列</p>}
            </div>
          </div>
        )}

        <div className="field">
          <label className="label" htmlFor="strategy">
            处理策略
          </label>
          <div className="control">
            <div className="select">
              <select {...register('strategy', { required: '请选择处理策略' })} style={{
                minWidth:'480px'
              }}>
                <option value="drop_rows">删除行</option>
                <option value="drop_columns">删除列</option>
                <option value="fill">填充</option>
              </select>
            </div>
            {errors.strategy && <p className="help is-danger">{errors.strategy.message}</p>}
          </div>
        </div>

        {(watchStrategy === 'drop_rows' || watchStrategy === 'drop_columns') && (
          <>
            <div className="field">
              <label className="label" htmlFor="how_drop">
                删除条件
              </label>
              <div className="control">
                <div className="select">
                  <select {...register('how_drop', { required: '请选择删除条件' })} style={{
                minWidth:'480px'
              }}>
                    <option value="any">包含任何缺失值</option>
                    <option value="all">所有值都是缺失值</option>
                  </select>
                </div>
                {errors.how_drop && <p className="help is-danger">{errors.how_drop.message}</p>}
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="thresh_drop">
                非缺失值阈值
              </label>
              <div className="control">
                <input
                  className={`input ${errors.thresh_drop ? 'is-danger' : ''}`}
                  type="number"
                  id="thresh_drop"
                  placeholder="保留至少具有多少个非缺失值的行/列"
                  {...register('thresh_drop', { valueAsNumber: true, min: 0 })}
                />
                {errors.thresh_drop && <p className="help is-danger">{errors.thresh_drop.message}</p>}
              </div>
            </div>
          </>
        )}

        {watchStrategy === 'fill' && (
          <>
            <div className="field">
              <label className="label" htmlFor="fill_strategy">
                填充策略
              </label>
              <div className="control">
                <div className="select">
                  <select {...register('fill_strategy', { required: '请选择填充策略' })}>
                    <option value="mean">均值</option>
                    <option value="median">中位数</option>
                    <option value="mode">众数</option>
                    <option value="constant">常量</option>
                    <option value="ffill">前向填充</option>
                    <option value="bfill">后向填充</option>
                  </select>
                </div>
                {errors.fill_strategy && <p className="help is-danger">{errors.fill_strategy.message}</p>}
              </div>
            </div>

            {watch('fill_strategy') === 'constant' && (
              <div className="field">
                <label className="label" htmlFor="fill_value">
                  常量值
                </label>
                <div className="control">
                  <input
                    className={`input ${errors.fill_value ? 'is-danger' : ''}`}
                    type="text"
                    id="fill_value"
                    placeholder="输入常量填充值"
                    {...register('fill_value', { required: '当选择常量填充时，此项是必需的' })}
                  />
                  {errors.fill_value && <p className="help is-danger">{errors.fill_value.message}</p>}
                </div>
              </div>
            )}
          </>
        )}

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" type="submit" disabled={loading}>
              {loading ? "正在处理..." : "处理缺失值"}
            </button>
          </div>
          <div className="control">
            <button className="button is-link is-light" type="button">
              取消
            </button>
          </div>
        </div>

        {error && <p className="help is-danger">错误: {JSON.stringify(error.message) || JSON.stringify(error)}</p>}
      </form>
    </div>
    </>
  );
};

export default HandleMissingValuesComp;