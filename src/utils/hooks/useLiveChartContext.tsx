import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { createRandomEvent, EventType } from '../utils';

interface EditingCell {
  index: number;            
  key: 'value1' | 'value2'; 
}

interface LiveChartState {
  events: EventType[];
  paused: boolean;
  editingCell: EditingCell | null; 
  resetEvents: EventType[];
  offset: number;
  chartSize: number;
}

type LiveChartAction =
  | { type: 'new_event'; payload: EventType }
  | { type: 'toggle_pause' }
  | { type: 'start_edit'; payload: EditingCell } 
  | { type: 'edit_value'; payload: { newValue: number } } 
  | { type: 'reset_values' }
  | { type: 'set_offset'; payload: number }
  | { type: 'set_chart_size'; payload: number };

interface LiveChartContextType {
  data: LiveChartState;
  dispatch: React.Dispatch<LiveChartAction>;
}

const initialEvents: EventType[] = Array.from({ length: 50 }, (_, ix) => createRandomEvent(ix));

const initialData: LiveChartState = {
  events: initialEvents,
  paused: false,
  editingCell: null, 
  resetEvents: [...initialEvents],
  offset: 0,
  chartSize: 20,
};

const LiveChartContext = createContext<LiveChartContextType | undefined>(undefined);

const liveChartReducer = (state: LiveChartState, action: LiveChartAction): LiveChartState => {
  switch (action.type) {
    case 'new_event':
      return state.paused ? state : { ...state, events: [...state.events, action.payload] };

    case 'toggle_pause':
      return { ...state, paused: !state.paused };

    case 'start_edit':
      return { ...state, editingCell: action.payload };

    case 'edit_value': {
      if (!state.editingCell) return state;
      const { index, key } = state.editingCell;
      return {
        ...state,
        events: state.events.map(ev => ev.index === index ? { ...ev, [key]: action.payload.newValue } : ev),
        editingCell: null,
      };
    }

    case 'reset_values':
      return { ...state, events: [...state.resetEvents] };

    case 'set_offset': {
      const maxOffset = Math.max(0, state.events.length - state.chartSize);
      return { ...state, offset: Math.min(Math.max(0, action.payload), maxOffset) };
    }

    case 'set_chart_size':
      return { ...state, chartSize: action.payload, offset: 0 };

    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
};

export const LiveChartProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [data, dispatch] = useReducer(liveChartReducer, initialData);
  return <LiveChartContext.Provider value={{ data, dispatch }}>{children}</LiveChartContext.Provider>;
};

export const useLiveChartContext = () => {
  const context = useContext(LiveChartContext);
  if (!context) throw new Error('useLiveChartContext must be used within a LiveChartProvider');
  return context;
};
