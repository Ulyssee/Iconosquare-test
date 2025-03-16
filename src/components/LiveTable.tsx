import React, { useState } from 'react';
import { useLiveChartContext } from '../utils/hooks/useLiveChartContext';

const LiveTable: React.FC = () => {
  const { data, dispatch } = useLiveChartContext();
  const nbTotalEvents = data.events.length;
  const eventsFiltered = data.events.slice(nbTotalEvents - 20, nbTotalEvents);


  const [editingCell, setEditingCell] = useState<{
    index: number;
    key: 'value1' | 'value2';
  } | null>(null);

  const [tempValue, setTempValue] = useState<string>('');

  const handleCellClick = (
    eventIndex: number,
    key: 'value1' | 'value2',
    currentValue: number
  ) => {
    setEditingCell({ index: eventIndex, key });
    setTempValue(String(currentValue));
  };

  const handleBlur = () => {
    if (editingCell) {
      const newValue = parseFloat(tempValue) || 0; 
      dispatch({
        type: 'edit_value',
        payload: {
          index: editingCell.index,
          key: editingCell.key,
          newValue,
        },
      });
      setEditingCell(null);
      setTempValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="flex border border-gray-300 rounded">
      <div>
        <div className="p-2">Index</div>
        <div className="p-2 border-t border-gray-300">Value 1</div>
        <div className="p-2 border-t border-gray-300">Value 2</div>
      </div>

      {eventsFiltered.map((event) => (
        <div key={event.index} className="border-l border-gray-300 flex-1">
          <div className="p-2">{event.index}</div>

          <div
            className="p-2 border-t border-gray-300"
            onClick={() => handleCellClick(event.index, 'value1', event.value1)}
          >
            {editingCell?.index === event.index &&
            editingCell?.key === 'value1' ? (
              <input
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="border px-1"
              />
            ) : (
              event.value1
            )}
          </div>

          <div
            className="p-2 border-t border-gray-300"
            onClick={() => handleCellClick(event.index, 'value2', event.value2)}
          >
            {editingCell?.index === event.index &&
            editingCell?.key === 'value2' ? (
              <input
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="border px-1"
              />
            ) : (
              event.value2
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveTable;
