import React, { useContext } from "react";
import HomePageContext from "../../context/HomePageContext";
import { useForm } from 'react-hook-form';
const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值

const SwarmPlotMCPComp = () => {
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
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log(data)
    data['figure_size'] = [12,6]
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/mcp/visualize/swarm_plot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_source: {
            // 这里假设数据源类型为文件上传，你需要根据实际情况修改
            file_path: filenames[0], // 假设文件名已经存储在 filenames 数组中
          },
          params: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "生成群集图失败");
      }

      const result = await response.json();
      setMcpMessages((preMessages) => [...preMessages, result.message]);
      setImageData({
        base64: result.plot_base64,
        mimeType: `image/png`, // 这里假设返回的是 PNG 格式，你需要根据实际情况修改
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
            <img src="./images/chart.png" alt="swarmplot" /> {/* 假设你有一个 swarmplot 的图标 */}
          </figure>
        </div>
        <div className="level-item">
          生成群集图 ({filenames[0]})
        </div>
        <div className="level-right">
          {/* 可以添加一些额外的控制元素 */}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label" htmlFor="x_column">
            X 轴列名 (类别)
          </label>
          <div className="control">
            <input
              className={`input ${errors.x_column ? 'is-danger' : ''}`}
              type="text"
              id="x_column"
              placeholder="请输入用于 X 轴的类别列名"
              {...register('x_column', { required: 'X 轴列名是必需的' })}
            />
            {errors.x_column && <p className="help is-danger">{errors.x_column.message}</p>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="y_column">
            Y 轴列名 (数值)
          </label>
          <div className="control">
            <input
              className={`input ${errors.y_column ? 'is-danger' : ''}`}
              type="text"
              id="y_column"
              placeholder="请输入用于 Y 轴的数值列名"
              {...register('y_column', { required: 'Y 轴列名是必需的' })}
            />
            {errors.y_column && <p className="help is-danger">{errors.y_column.message}</p>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="hue_column">
            Hue 列名 (可选, 类别)
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="hue_column"
              placeholder="请输入用于着色的类别列名 (可选)"
              {...register('hue_column')}
            />
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
            图形尺寸 (可选, 例如: 12,6)
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="figure_size"
              value={[12,6]}
              placeholder="例如: 12,6"
              {...register('figure_size')}
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input type="checkbox" {...register('enable_xticks_range')} />
              启用自定义 X 轴刻度范围
            </label>
          </div>
        </div>

        {watch('enable_xticks_range') && (
          <>
            <div className="field">
              <label className="label" htmlFor="xticks_range_start">
                X 轴刻度起始值
              </label>
              <div className="control">
                <input type="number" className="input" id="xticks_range_start" placeholder="起始值" {...register('xticks_range_start')} />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="xticks_range_stop">
                X 轴刻度结束值 (不包含)
              </label>
              <div className="control">
                <input type="number" className="input" id="xticks_range_stop" placeholder="结束值" {...register('xticks_range_stop')} />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="xticks_range_step">
                X 轴刻度步长
              </label>
              <div className="control">
                <input type="number" className="input" id="xticks_range_step" placeholder="步长" {...register('xticks_range_step')} />
              </div>
            </div>
          </>
        )}

        <div className="field">
          <div className="control">
            <label className="checkbox">
              <input type="checkbox" {...register('dodge')} />
              Dodge (当使用 Hue 时分离点)
            </label>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" type="submit" disabled={loading}>
              {loading ? "正在绘制..." : "绘制群集图"}
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
            <h3 className="subtitle">生成的群集图</h3>
            <img src={`data:${imageData.mimeType};base64,${imageData.base64}`} alt="群集图" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </form>
    </div>
  );
};

export default SwarmPlotMCPComp;