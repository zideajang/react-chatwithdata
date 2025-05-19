import React, { useState, useEffect, useCallback, useContext } from "react";
import HomePageContext from "../../context/HomePageContext";
import { useForm } from 'react-hook-form';

const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值

const DropDuplicatesComp = () => {
  const {
    error,
    loading,
    setError,
    setLoading,
    filenames,
    setMcpMessages,
    refreshData,
  } = useContext(HomePageContext);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      keep: 'first',
    },
  });
  const [availableColumns, setAvailableColumns] = useState([]);
  const watchSubset = watch('subset');

  // 模拟获取列名的函数，你需要替换为真实的 API 调用
  const fetchColumnNames = async () => {
    if (filenames && filenames.length > 0) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseURL}/api/data/columns`, {
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
    console.log("Dropping Duplicates with:", data);
    setError(null);
    setLoading(true);
    try {
      const payload = {
        data_source: {
          file_path: filenames[0],
        },
        params: {
          subset: data.subset && data.subset.length > 0 ? data.subset : null,
          keep: data.keep,
        },
      };

      const response = await fetch(`${baseURL}/api/clean/table/drop_duplicates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "删除重复行失败");
      }

      const result = await response.json();
      setMcpMessages((prevMessages) => [...prevMessages, result.message]);
      if (refreshData) {
        refreshData();
      }

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <div className="level">
        <div className="level-left">
          <figure className="image is-32x32">
            <img src="./images/copy.png" alt="drop duplicates" /> {/* 假设你有一个去重的图标 */}
          </figure>
        </div>
        <div className="level-item">
          删除重复行 ({filenames[0]})
        </div>
        <div className="level-right">
          {/* 可以添加一些额外的控制元素 */}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label" htmlFor="subset">
            子集 (可选)
          </label>
          <div className="control">
            <div className="select is-multiple">
              <select multiple {...register('subset')}>
                {availableColumns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            {errors.subset && <p className="help is-danger">请选择用于识别重复项的列</p>}
          </div>
          <p className="help">选择用于确定哪些行是重复的列。如果留空，则考虑所有列。</p>
        </div>

        <div className="field">
          <label className="label" htmlFor="keep">
            保留
          </label>
          <div className="control">
            <div className="select">
              <select {...register('keep')}>
                <option value="first">第一个</option>
                <option value="last">最后一个</option>
                <option value={false}>不保留 (删除所有重复项)</option>
              </select>
            </div>
            {errors.keep && <p className="help is-danger">{errors.keep.message}</p>}
          </div>
          <p className="help">确定要保留哪个重复项。</p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" type="submit" disabled={loading}>
              {loading ? "正在处理..." : "删除重复项"}
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
  );
};

export default DropDuplicatesComp;