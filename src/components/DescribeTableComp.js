import React from 'react';

const DescribeTableComp = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p>没有找到数据</p>;
  }

  const stats = Object.keys(data);
  const columnNames = Object.keys(data[stats[0]]);

  const formatValue = (value) => {
    if (typeof value === 'number' && !Number.isInteger(value)) {
      return value.toFixed(2);
    }
    return value;
  };

  return (
    <table className='table' style={{
      width: '600px',
      overflow: 'auto',
      tableLayout: 'fixed'

    }}>
      <thead>
        <tr>
          <th></th>
          {columnNames.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {stats.map((stat) => (
          <tr key={stat}>
            <th>{stat}</th>
            {columnNames.map((column) => (
              <td key={`${stat}-${column}`}>{formatValue(data[stat][column])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DescribeTableComp;