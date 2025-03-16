import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { createRandomEvent, EventType } from '../utils';

interface LiveChartState {
  events: EventType[];
  paused: boolean;
}

type LiveChartAction =
  | { type: 'new_event'; payload: EventType }
  | { type: 'toggle_pause' }
  | {
    type: 'edit_value';
    payload: { 
      index: number;
      key: 'value1' | 'value2';
      newValue: number;
     };
  };

interface LiveChartContextType {
  data: LiveChartState;
  dispatch: React.Dispatch<LiveChartAction>;
}

const initialEvents: EventType[] = Array.from({ length: 50 }, (_, ix) => createRandomEvent(ix));

const initialData: LiveChartState = {
  events: initialEvents,
  paused: false, 
};

const LiveChartContext = createContext<LiveChartContextType | undefined>(undefined);

const liveChartReducer = (state: LiveChartState, action: LiveChartAction): LiveChartState => {
  switch (action.type) {
    case 'new_event':
      if (state.paused) {
        return state;
      }
      return {
        ...state,
        events: [...state.events, action.payload],
      };

    case 'toggle_pause':
      return {
        ...state,
        paused: !state.paused,
      };
    case 'edit_value': {
      const { index, key, newValue } = action.payload;
      return {
        ...state,
        events: state.events.map((ev) =>
          ev.index === index
            ? { ...ev, [key]: newValue }
            : ev
        ),
      }
    }

    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
};

export const LiveChartProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [data, dispatch] = useReducer(liveChartReducer, initialData);

  return (
    <LiveChartContext.Provider value={{ data, dispatch }}>
      {children}
    </LiveChartContext.Provider>
  );
};

export const useLiveChartContext = () => {
  const context = useContext(LiveChartContext);
  if (!context) {
    throw new Error('useLiveChartContext should be used within a LiveChartProvider');
  }
  return context;
};
