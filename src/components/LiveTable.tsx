import React, { useState } from 'react';
import { useLiveChartContext } from '../utils/hooks/useLiveChartContext';

const LiveTable: React.FC = () => {
  const { data, dispatch } = useLiveChartContext();
  const nbTotalEvents = data.events.length;
  const eventsFiltered = data.events.slice(nbTotalEvents - 20, nbTotalEvents);

  const [tempValue, setTempValue] = useState<string>('');

  const editingCell = data.editingCell;

  const handleCellClick = (eventIndex: number, key: 'value1' | 'value2', currentValue: number) => {
    dispatch({ type: 'start_edit', payload: { index: eventIndex, key } });
    setTempValue(String(currentValue));
  };

  const finishEdit = () => {
    const newValue = parseFloat(tempValue) || 0;
    dispatch({ type: 'edit_value', payload: { newValue } });
    setTempValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEdit();
    }
  };

  return (
    <div className="flex border border-gray-300 rounded">
      <div>
        <div className="p-2">Index</div>
        <div className="p-2 border-t border-gray-300">Value 1</div>
        <div className="p-2 border-t border-gray-300">Value 2</div>
      </div>

      {eventsFiltered.map((event) => {
        const isEditingValue1 = editingCell && editingCell.index === event.index && editingCell.key === 'value1';
        const isEditingValue2 = editingCell && editingCell.index === event.index && editingCell.key === 'value2';

        return (
          <div key={event.index} className="border-l border-gray-300 flex-1">
            <div className="p-2">{event.index}</div>

            <div
              className="p-2 border-t border-gray-300"
              onClick={() => handleCellClick(event.index, 'value1', event.value1)}
            >
              {isEditingValue1 ? (
                <input
                  autoFocus
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={finishEdit}
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
              {isEditingValue2 ? (
                <input
                  autoFocus
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={finishEdit}
                  onKeyDown={handleKeyDown}
                  className="border px-1"
                />
              ) : (
                event.value2
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveTable;
