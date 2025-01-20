import React from 'react';
import { MultiSelect } from './components/MultiSelect';

const App: React.FC = () => {
  const options = [
    { label: 'Line chart', value: 'line-chart' },
    { label: 'Area chart', value: 'area-chart' },
    { label: 'Column chart', value: 'column-chart' },
    { label: 'Bar chart', value: 'bar-chart' },
    { label: 'Pie chart', value: 'pie-chart' },
    { label: 'Scatter chart', value: 'scatter-chart' },
    { label: 'Bubble chart', value: 'bubble-chart' },
  ];

  const handleChange = (selectedOptions: { label: string; value: string }[]) => {
    console.log('Seçilen değerler:', selectedOptions);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-[500px] bg-white p-8 rounded">
        <label className="block text-[14px] text-gray-600 mb-2">
          Chart type
        </label>
        <MultiSelect
          options={options}
          onChange={handleChange}
          placeholder="chart"
        />
      </div>
    </div>
  );
};

export default App;