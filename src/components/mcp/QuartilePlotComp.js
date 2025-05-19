import React, { useContext } from "react";
import HomePageContext from "../../context/HomePageContext";
import { useForm } from 'react-hook-form';

const QuartilePlotComp = () => {
  const {
    error,
    loading,
    setError,
    setLoading,
    filenames,
    setMcpMessages,
    imageData,
    setImageData
  } = useContext(HomePageContext);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      quantile_labels: "Low,Med-Low,Med-High,High" // Default for quartiles
    }
  });
  const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值

  const onSubmit = async (data) => {
    console.log(data);
    data['figure_size'] = [12,6]
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/mcp/visualize/quartile_plot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_source: {
            file_path: filenames[0], // 假设文件名已经存储在 filenames 数组中
          },
          params: {
            ...data,
            quantile_labels: data.quantile_labels.split(',').map(label => label.trim())
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "生成分位数图失败");
      }

      const result = await response.json();
      setMcpMessages((preMessages) => [...preMessages, result.message]);
      setImageData({
        base64: result.plot_base64,
        mimeType: `image/png`, // 假设返回的是 PNG 格式
      });
      console.log(imageData);

    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box" >
      <div className="level">
        <div className="level-left">
          <figure className="image is-32x32">
            <img src="./images/chart2.png" alt="quartile plot" /> {/* 替换为你的图标 */}
          </figure>
        </div>
        <div className="level-item">
          生成分位数图 ({filenames[0]})
        </div>
        <div className="level-right">
          {/* 可选的控制元素 */}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label" htmlFor="feature_column">
            特征列名 (数值)
          </label>
          <div className="control">
            <input
              className={`input ${errors.feature_column ? 'is-danger' : ''}`}
              type="text"
              id="feature_column"
              placeholder="请输入要进行分位数切割的数值列名"
              {...register('feature_column', { required: '特征列名是必需的' })}
            />
            {errors.feature_column && <p className="help is-danger">{errors.feature_column.message}</p>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="target_column">
            目标列名 (数值)
          </label>
          <div className="control">
            <input
              className={`input ${errors.target_column ? 'is-danger' : ''}`}
              type="text"
              id="target_column"
              placeholder="请输入要计算均值的数值列名"
              {...register('target_column', { required: '目标列名是必需的' })}
            />
            {errors.target_column && <p className="help is-danger">{errors.target_column.message}</p>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="quantile_labels">
            分位数标签 (逗号分隔)
          </label>
          <div className="control">
            <input
              className={`input ${errors.quantile_labels ? 'is-danger' : ''}`}
              type="text"
              id="quantile_labels"
              placeholder="例如: 低,中低,中高,高"
              {...register('quantile_labels', {
                required: '分位数标签是必需的',
                validate: value => value.split(',').length >= 2 || '至少需要两个分位数标签'
              })}
            />
            {errors.quantile_labels && <p className="help is-danger">{errors.quantile_labels.message}</p>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="title">
            标题 (可选)
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="title"
              placeholder="请输入图表标题 (可选)"
              {...register('title')}
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="figure_size">
            图形尺寸 (可选, 例如: 7,5)
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="figure_size"
              placeholder="例如: 7,5 (宽度, 高度)"
              {...register('figure_size')}
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" type="submit" disabled={loading}>
              {loading ? "正在绘制..." : "生成分位数图"}
            </button>
          </div>
          <div className="control">
            <button className="button is-link is-light" type="button">
              取消
            </button>
          </div>
        </div>

        {error && <p className="help is-danger">错误: {JSON.stringify(error.message) || JSON.stringify(error)}</p>}

        {imageData && (
          <div>
            <h3 className="subtitle">生成的分位数图</h3>
            <img src={`data:${imageData.mimeType};base64,${imageData.base64}`} alt="分位数图" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </form>
    </div>
  );
};

export default QuartilePlotComp;