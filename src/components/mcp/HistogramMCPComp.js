import { useCallback, useContext, useState } from "react";
import HomePageContext from "../../context/HomePageContext";
import { getHistogram } from "../../api";
import { useForm } from 'react-hook-form';

const HistogramMCPComp = () => {
    const {
        setError,
        setLoading,
        filenames,
        setMcpMessages,
        imageData,
        setImageData
    } = useContext(HomePageContext);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit  = async (data) => {
            setError(null);
            setLoading(true)
            try {
                const response = await getHistogram(filenames[0], data);
                setMcpMessages((preMessages) => [...preMessages, response.message])
                setImageData({
                  base64: response.plot_base64,
                  mimeType: `image/${response.format}`
                })
                console.log(imageData)

            } catch (error) {
                setError(error)
            } finally {
                setLoading(false);
            }
        }

    
    return (
        <div className="box" >
            <div className="level">
                <div className="level-left">
                    <figure class="image is-32x32">
                        <img src="./images/histogram.png" alt="histogram" />
                    </figure>
                </div>
                <div className="level-item">
                    get_histogram({filenames[0]})(MCP 方法)

                </div>
                <div className="level-right">
                    
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
        <label className="label" htmlFor="column">
          列名称
        </label>
        <div className="control">
          <input
            className={`input ${errors.column ? 'is-danger' : ''}`}
            type="text"
            id="column"
            placeholder="请输出要绘制直方图列名"
            {...register('column', { required: 'Column is required' })}
          />
          {errors.column && <p className="help is-danger">{errors.column.message}</p>}
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="bins">
          Bins (可选)
        </label>
        <div className="control">
          <input
            className="input"
            type="number"
            id="bins"
            placeholder="请输入 bins (可选项)"
            {...register('bins', { valueAsNumber: true, min: 1 })}
          />
          {errors.bins && errors.bins.type === 'min' && (
            <p className="help is-danger">Number of bins must be at least 1.</p>
          )}
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
            placeholder="请输出 plot 标题 (可选)"
            {...register('title')}
          />
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="xlabel">
          X-轴名称 (可选)
        </label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="xlabel"
            placeholder="输入 x 轴名称(可选)"
            {...register('xlabel')}
          />
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="ylabel">
          Y-轴名称
        </label>
        <div className="control">
          <input
            className="input"
            type="text"
            id="ylabel"
            value="频率"
            readOnly // Y-axis label is fixed as "Frequency" based on your model
            {...register('ylabel')}
          />
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" type="submit">
            绘制直方图
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

export default HistogramMCPComp;