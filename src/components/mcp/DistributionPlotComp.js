import React, { useContext } from "react";
import HomePageContext from "../../context/HomePageContext";
import { useForm } from 'react-hook-form';

const DistributionPlotComp = () => {
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
  const { register, handleSubmit, formState: { errors } } = useForm();
  const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值

  const onSubmit = async (data) => {
    console.log(data);
    data['figure_size'] = [12,6]
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/mcp/visualize/distribution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_source: {
            file_path: filenames[0], // 假设文件名已经存储在 filenames 数组中
          },
          params: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "生成分布图失败");
      }

      const result = await response.json();
      setMcpMessages((preMessages) => [...preMessages, result.message]);
      setImageData({
        base64: result.plot_base64,
        mimeType: `image/png`, // 假设返回的是 PNG 格式，你需要根据实际情况修改
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
            <img src="./images/histogram.png" alt="distribution" /> {/* 假设你有一个分布图的图标 */}
          </figure>
        </div>
        <div className="level-item">
          生成分布图 ({filenames[0]})
        </div>
        <div className="level-right">
          {/* 可以添加一些额外的控制元素 */}
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
              placeholder="请输入要分析的数值列名"
              {...register('feature_column', { required: '特征列名是必需的' })}
            />
            {errors.feature_column && <p className="help is-danger">{errors.feature_column.message}</p>}
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
          <label className="label" htmlFor="bins">
            Bins 数量 (可选)
          </label>
          <div className="control">
            <input
              className="input"
              type="number"
              id="bins"
              placeholder="请输入直方图的 bins 数量 (可选, 默认为 30)"
              {...register('bins', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input type="checkbox" {...register('show_hist')} />
              显示直方图
            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input type="checkbox" {...register('show_kde')} />
              显示 KDE
            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input type="checkbox" {...register('show_rug')} />
              显示 Rug Plot
            </label>
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
              {loading ? "正在绘制..." : "绘制分布图"}
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
            <h3 className="subtitle">生成的分布图</h3>
            <img src={`data:${imageData.mimeType};base64,${imageData.base64}`} alt="分布图" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </form>
    </div>
  );
};

export default DistributionPlotComp;