import React, { useState, useEffect, useCallback } from 'react';
import { FaFileDownload } from "react-icons/fa";


const baseURL = process.env.REACT_APP_BASE_URL || '/api'; // 如果环境变量未设置，提供一个默认值

const DataFrameTableComp = ({ dataFrameJson, dataFramePath, onClose, modalTitle = "DataFrame", defaultDownloadFilename = "dataframe.csv" }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [downloadFilename, setDownloadFilename] = useState(defaultDownloadFilename);

  const parseDataFrame = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.columns && parsed.data) {
        setColumns(parsed.columns);
        setRows(parsed.data);
      } else {
        console.error('Invalid DataFrame JSON format:', parsed);
        setColumns([]);
        setRows([]);
      }
    } catch (error) {
      console.error('Error parsing DataFrame JSON:', error);
      setColumns([]);
      setRows([]);
    }
  }, []);

  useEffect(() => {
    if (dataFrameJson) {
      parseDataFrame(dataFrameJson);
    }
  }, [dataFrameJson, parseDataFrame]);

  const handleDownloadFilenameChange = (event) => {
    setDownloadFilename(event.target.value);
  };

  const downloadCsv = useCallback(() => {
    if (dataFramePath) {
      const link = document.createElement('a');
      link.href = `${baseURL}/api/mcp/download/${dataFramePath}`;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('DataFrame path is not available for download.');
    }
  }, [dataFramePath, downloadFilename]);

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{modalTitle}</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          {rows.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table is-bordered is-striped is-fullwidth">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p>暂时没有数据</p>
          )}
        </section>
        <footer className="modal-card-foot" style={{ justifyContent: 'space-between' }}>
          <div>
            {dataFramePath && (
              <div className="field is-grouped">
                <div className="control">
                  <input
                    className="input is-small"
                    type="text"
                    placeholder="下载文件名"
                    value={downloadFilename}
                    onChange={handleDownloadFilenameChange}
                  />
                </div>
                <div className="control">
                  <button className="button is-link is-small" onClick={downloadCsv}>
                    <span className="icon is-small">
                      <FaFileDownload/>
                    </span>
                    <span>下载 CSV</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="button" onClick={onClose}>
            关闭
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DataFrameTableComp;