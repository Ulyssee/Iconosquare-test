import React, { useState } from 'react';
import { useLiveChartContext } from '../utils/hooks/useLiveChartContext';

const COLUMN_LIMIT = 10;

const LiveTable: React.FC = () => {
  const { data, dispatch } = useLiveChartContext();
  const total = data.events.length;
  const start = Math.max(0, total - data.offset - data.chartSize);
  const end = Math.max(0, total - data.offset);
  const eventsFiltered = data.events.slice(start, end);

  const [tempValue, setTempValue] = useState<string>('');
  const editingCell = data.editingCell;

  const chunkArray = (array: any[], size: number) =>
    array.reduce((acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]), []);

  const groupedEvents = chunkArray(eventsFiltered, COLUMN_LIMIT);

  const handleCellClick = (eventIndex: number, key: 'value1' | 'value2', currentValue: number) => {
    dispatch({ type: 'start_edit', payload: { index: eventIndex, key } });
    setTempValue(String(currentValue));
  };

  const finishEdit = () => {
    if (!data.editingCell) return;
    dispatch({ type: 'edit_value', payload: { newValue: parseFloat(tempValue) || 0 } });
    setTempValue('');
  };

  return (
    <div className="border border-gray-300 rounded p-4">
      <div className="overflow-x-auto">
        {groupedEvents.map((group, rowIndex) => (
          <div key={rowIndex} className="mb-4">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-4 py-2 text-center">Index</th>
                  {group.map(event => (
                    <th key={event.index} className="border border-gray-400 px-4 py-2 text-center">{event.index}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['value1', 'value2'].map(key => (
                  <tr key={key}>
                    <td className="border border-gray-400 px-4 py-2 font-bold text-center">{key}</td>
                    {group.map(event => {
                      const isEditing = editingCell && editingCell.index === event.index && editingCell.key === key;
                      return (
                        <td key={event.index} className="border border-gray-400 px-4 py-2 text-center"
                          onClick={() => handleCellClick(event.index, key as 'value1' | 'value2', event[key])}>
                          {isEditing ? (
                            <input autoFocus value={tempValue} onChange={e => setTempValue(e.target.value)}
                              onBlur={finishEdit} className="border px-1 w-full text-center" />
                          ) : event[key]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTable;
