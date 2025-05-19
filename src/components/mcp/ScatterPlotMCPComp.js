import { useContext } from "react";
import HomePageContext from "../../context/HomePageContext";
import { getScatterPlot } from "../../api"; // Assuming you have a getScatterPlot API function
import { useForm } from 'react-hook-form';

const ScatterPlotMCPComp = () => {
  const {
    setError,
    setLoading,
    filenames,
    setMcpMessages,
    imageData,
    setImageData
  } = useContext(HomePageContext);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      const response = await getScatterPlot(filenames[0], data);
      setMcpMessages((preMessages) => [...preMessages, response.message]);
      setImageData({
        base64: response.plot_base64,
        mimeType: `image/${response.format}` // Assuming the API returns the format
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
            <img src="./images/scatter.png" alt="scatterplot" /> {/* Assuming you have a scatterplot icon */}
          </figure>
        </div>
        <div className="level-item">
          get_scatter_plot({filenames[0]})
        </div>
        <div className="level-right">

        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label" htmlFor="x_column">
            X 轴列名
          </label>
          <div className="control">
            <input
              className={`input ${errors.x_column ? 'is-danger' : ''}`}
              type="text"
              id="x_column"
              placeholder="请输入 X 轴列名"
              {...register('x_column', { required: 'X 轴列名是必需的' })}
            />
            {errors.x_column && <p className="help is-danger">{errors.x_column.message}</p>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="y_column">
            Y 轴列名
          </label>
          <div className="control">
            <input
              className={`input ${errors.y_column ? 'is-danger' : ''}`}
              type="text"
              id="y_column"
              placeholder="请输入 Y 轴列名"
              {...register('y_column', { required: 'Y 轴列名是必需的' })}
            />
            {errors.y_column && <p className="help is-danger">{errors.y_column.message}</p>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="hue_column">
            Hue 列名 (可选)
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="hue_column"
              placeholder="请输入用于着色的列名 (可选)"
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

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" type="submit">
              绘制散点图
            </button>
          </div>
          <div className="control">
            <button className="button is-link is-light" type="button">
              取消
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ScatterPlotMCPComp;