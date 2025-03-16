import React from 'react';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useLiveChartContext } from '../utils/hooks/useLiveChartContext';

const LiveChart = () => {
  const { data, dispatch } = useLiveChartContext();
  const nbTotalEvents = data.events.length;
  const eventsFiltered = data.events.slice(Math.max(nbTotalEvents - 20, 0), nbTotalEvents);

  const handleTogglePause = () => {
    dispatch({ type: 'toggle_pause' });
  };

  return (
    <div className="mb-8">
      <button
        onClick={handleTogglePause}
        className="mb-4 px-4 py-2 border rounded bg-gray-100"
      >
        {data.paused ? 'Play' : 'Pause'}
      </button>

      <ResponsiveContainer height={250}>
        <AreaChart
          onClick={(e) => console.log(e.activeTooltipIndex)}
          data={eventsFiltered}
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
    </div>
  );
};

export default LiveChart;
