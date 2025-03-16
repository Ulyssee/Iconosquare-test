import React, { useContext, useReducer, createContext, ReactNode, Dispatch } from 'react';
import { createRandomEvent, EventType } from '../utils';

interface LiveChartState {
  events: EventType[];
}

interface LiveChartContextType {
  data: LiveChartState;
  dispatch: Dispatch<LiveChartAction>;
}

type LiveChartAction = { type: 'new_event'; payload: EventType };

const LiveChartContext = createContext<LiveChartContextType | undefined>(undefined);

const initialEvents: EventType[] = Array.from({ length: 50 }, (_, ix) => createRandomEvent(ix));
const initialData: LiveChartState = { events: initialEvents };

const liveChartReducer = (state: LiveChartState, action: LiveChartAction): LiveChartState => {
  switch (action.type) {
    case 'new_event':
      return { events: [...state.events, action.payload] };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const LiveChartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
    throw new Error('useLiveChartContext must be used within a LiveChartProvider');
  }
  return context;
};
