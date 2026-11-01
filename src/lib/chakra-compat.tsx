'use client';

import React, { useState, createContext, useContext } from 'react';
import toast from 'react-hot-toast';

export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onToggle: () => setIsOpen((prev) => !prev),
  };
}

export function useColorModeValue<T>(lightVal: T, darkVal: T): T {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return darkVal;
  }
  return lightVal;
}

export function useToast() {
  return React.useCallback((options: any) => {
    if (!options) return;
    const msg = options.title || options.description || '';
    if (options.status === 'success') {
      toast.success(msg);
    } else if (options.status === 'error') {
      toast.error(msg);
    } else {
      toast(msg);
    }
  }, []);
}

export function useBreakpointValue(values: Record<string, any> | any[]) {
  if (Array.isArray(values)) {
    return values[values.length - 1];
  }
  if (typeof values === 'object' && values !== null) {
    return values.lg ?? values.md ?? values.sm ?? values.base ?? Object.values(values)[0];
  }
  return values;
}

export function extendTheme(config: any) {
  return config || {};
}

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Box({ children, className = '', ...props }: any) {
  return <div className={className} {...props}>{children}</div>;
}

export function Flex({ children, className = '', direction = 'row', align, justify, ...props }: any) {
  return (
    <div
      className={`flex ${direction === 'column' ? 'flex-col' : 'flex-row'} ${
        align ? `items-${align}` : ''
      } ${justify ? `justify-${justify}` : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function VStack({ children, className = '', spacing, ...props }: any) {
  return (
    <div className={`flex flex-col ${spacing ? `gap-${spacing}` : 'gap-2'} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function HStack({ children, className = '', spacing, ...props }: any) {
  return (
    <div className={`flex flex-row items-center ${spacing ? `gap-${spacing}` : 'gap-2'} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Text({ children, className = '', as: Component = 'p', ...props }: any) {
  return <Component className={className} {...props}>{children}</Component>;
}

export function Code({ children, className = '', ...props }: any) {
  return (
    <code className={`font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded ${className}`} {...props}>
      {children}
    </code>
  );
}

export function Spinner({ size = 'md', className = '', ...props }: any) {
  const sizeClasses =
    size === 'xs' ? 'h-3 w-3' : size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : size === 'xl' ? 'h-12 w-12' : 'h-5 w-5';
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] ${sizeClasses} ${className}`}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function Button({
  children,
  className = '',
  onClick,
  isDisabled,
  disabled,
  isLoading,
  leftIcon,
  rightIcon,
  ...props
}: any) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors px-4 py-2 ${
        isDisabled || disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}

export function Progress({ value = 0, max = 100, className = '', ...props }: any) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden ${className}`} {...props}>
      <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function CircularProgress({ value = 0, size = '48px', children, className = '', ...props }: any) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }} {...props}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-200 dark:text-gray-700 stroke-current"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-amber-500 stroke-current"
          strokeDasharray={`${value}, 100`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      {children}
    </div>
  );
}

export function CircularProgressLabel({ children, className = '' }: any) {
  return <span className={`absolute text-xs font-semibold text-center ${className}`}>{children}</span>;
}

export function Tooltip({ label, children, className = '' }: any) {
  return (
    <div className={`relative group inline-block ${className}`} title={label}>
      {children}
    </div>
  );
}

// Drawer components
export function Drawer({ isOpen, onClose, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DrawerOverlay() {
  return null;
}

export function DrawerContent({ children, className = '' }: any) {
  return <div className={`flex flex-col h-full ${className}`}>{children}</div>;
}

export function DrawerHeader({ children, className = '' }: any) {
  return <div className={`p-4 border-b border-gray-200 dark:border-gray-800 ${className}`}>{children}</div>;
}

export function DrawerBody({ children, className = '' }: any) {
  return <div className={`flex-1 overflow-y-auto p-4 ${className}`}>{children}</div>;
}

// Modal components
export function Modal({ isOpen, onClose, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 max-w-lg w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export function ModalOverlay() {
  return null;
}

export function ModalContent({ children, className = '' }: any) {
  return <div className={className}>{children}</div>;
}

export function ModalHeader({ children, className = '' }: any) {
  return <div className={`text-lg font-bold border-b border-gray-200 dark:border-gray-800 pb-3 mb-4 ${className}`}>{children}</div>;
}

export function ModalBody({ children, className = '' }: any) {
  return <div className={className}>{children}</div>;
}

export function ModalFooter({ children, className = '' }: any) {
  return <div className={`border-t border-gray-200 dark:border-gray-800 pt-3 mt-4 flex justify-end gap-2 ${className}`}>{children}</div>;
}

export function ModalCloseButton({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer text-xl"
    >
      ×
    </button>
  );
}

// Tabs
interface TabsContextType {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}
const TabsContext = createContext<TabsContextType>({
  activeIndex: 0,
  setActiveIndex: () => {},
});

export function Tabs({ children, className = '', index, defaultIndex = 0, onChange }: any) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = index !== undefined ? index : internalIndex;

  const handleSelect = (idx: number) => {
    if (index === undefined) setInternalIndex(idx);
    if (onChange) onChange(idx);
  };

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex: handleSelect }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className = '' }: any) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <div className={`flex border-b border-gray-200 dark:border-gray-800 ${className}`}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as any, {
          isSelected: activeIndex === idx,
          onClick: () => setActiveIndex(idx),
        });
      })}
    </div>
  );
}

export function Tab({ children, className = '', isSelected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
        isSelected
          ? 'border-amber-500 text-amber-600 dark:text-amber-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabPanels({ children, className = '' }: any) {
  const { activeIndex } = useContext(TabsContext);
  return (
    <div className={`pt-4 ${className}`}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        if (activeIndex !== idx) return null;
        return child;
      })}
    </div>
  );
}

export function TabPanel({ children, className = '' }: any) {
  return <div className={className}>{children}</div>;
}

// Accordion
interface AccordionContextType {
  openIndices: number[];
  toggleIndex: (i: number) => void;
}
const AccordionContext = createContext<AccordionContextType>({
  openIndices: [],
  toggleIndex: () => {},
});

export function Accordion({ children, className = '', allowToggle = true, allowMultiple = false, ...props }: any) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleIndex = (idx: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(idx) ? (allowToggle ? [] : prev) : [idx]));
    }
  };

  return (
    <AccordionContext.Provider value={{ openIndices, toggleIndex }}>
      <div className={`divide-y divide-gray-200 dark:divide-gray-800 ${className}`} {...props}>
        {React.Children.map(children, (child, idx) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as any, { itemIndex: idx });
        })}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ children, className = '', itemIndex, ...props }: any) {
  const { openIndices, toggleIndex } = useContext(AccordionContext);
  const isOpen = openIndices.includes(itemIndex ?? 0);

  return (
    <div className={`border-b border-gray-200 dark:border-gray-800 ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as any, {
          isOpen,
          onToggle: () => toggleIndex(itemIndex ?? 0),
        });
      })}
    </div>
  );
}

export function AccordionButton({ children, isOpen, onToggle, className = '', ...props }: any) {
  return (
    <button
      onClick={onToggle}
      className={`w-full py-3 px-4 flex justify-between items-center text-left font-medium hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AccordionPanel({ children, isOpen, className = '', ...props }: any) {
  if (!isOpen) return null;
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
}

export function AccordionIcon({ isOpen, className = '' }: any) {
  return (
    <span className={`transform transition-transform text-xs inline-block ${isOpen ? 'rotate-180' : ''} ${className}`}>
      ▼
    </span>
  );
}
