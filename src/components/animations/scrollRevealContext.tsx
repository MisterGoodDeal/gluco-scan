import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type FC,
  type ReactNode,
} from 'react';

type ScrollRevealContextValue = {
  subscribe: (check: () => void) => () => void;
  notifyScroll: () => void;
};

const ScrollRevealContext = createContext<ScrollRevealContextValue | null>(null);

type ScrollRevealProviderProps = {
  children: ReactNode;
};

export const ScrollRevealProvider: FC<ScrollRevealProviderProps> = ({ children }) => {
  const checksRef = useRef(new Set<() => void>());

  const subscribe = useCallback((check: () => void) => {
    checksRef.current.add(check);
    return () => {
      checksRef.current.delete(check);
    };
  }, []);

  const notifyScroll = useCallback(() => {
    checksRef.current.forEach((check) => check());
  }, []);

  const value = useMemo(
    () => ({
      subscribe,
      notifyScroll,
    }),
    [subscribe, notifyScroll],
  );

  return <ScrollRevealContext.Provider value={value}>{children}</ScrollRevealContext.Provider>;
};

export const useScrollRevealContext = (): ScrollRevealContextValue => {
  const context = useContext(ScrollRevealContext);
  if (!context) {
    throw new Error('useScrollRevealContext must be used within ScrollRevealProvider');
  }
  return context;
};

export const useScrollRevealOnScroll = () => {
  const { notifyScroll } = useScrollRevealContext();
  return notifyScroll;
};
