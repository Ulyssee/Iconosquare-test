import React from 'react';
import {Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer} from 'recharts';
import { useLiveChartContext } from '../utils/hooks/useLiveChartContext';

const LiveChart = () => {
  const { data, dispatch } = useLiveChartContext();
  const { events, paused, offset, chartSize } = data;

  const total = events.length;
  const start = Math.max(0, total - offset - chartSize);
  const end = Math.max(0, total - offset);
  const eventsFiltered = events.slice(start, end);

  const handleTogglePause = () => {
    dispatch({ type: 'toggle_pause' });
  };

  const handleReset = () => {
    dispatch({ type: 'reset_values' });
  };

  const handleChartClick = (e: any) => {
    const indexInFiltered = e?.activeTooltipIndex;
    if (indexInFiltered != null) {
      const clickedEvent = eventsFiltered[indexInFiltered];
      if (clickedEvent) {
        dispatch({ type: 'start_edit', payload: { index: clickedEvent.index, key: 'value1' } });
      }
    }
  };
  
  const maxOffset = Math.max(0, total - chartSize);
  const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'set_offset', payload: Number(e.target.value) });
  };

  const handleChartSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'set_chart_size', payload: Number(e.target.value) });
  };

  return (
    <div className="mb-8">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleTogglePause}
          className="px-4 py-2 border rounded bg-gray-100"
        >
          {paused ? 'Play' : 'Pause'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded bg-gray-100"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="range"
          min={5}
          max={100}
          value={chartSize}
          onChange={handleChartSizeChange}
        />
        <span>Chart Size: {chartSize} index</span>
      </div>

      <ResponsiveContainer height={250}>
        <AreaChart
          data={eventsFiltered}
          onClick={handleChartClick}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="index" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="value1"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="value2"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={maxOffset}
          value={offset}
          onChange={handleOffsetChange}
        />
      </div>
    </div>
  );
};

export default LiveChart;
