
import React, { useState } from 'react';

// --- Utils ---
export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'dashed';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600 shadow-sm",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
    ghost: "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
    outline: "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    dashed: "border border-dashed border-slate-300 bg-transparent hover:bg-slate-50 text-slate-600 hover:text-primary-600 hover:border-primary-300",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, className, id, icon, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            icon ? "pl-9" : "",
            error ? "border-red-500 focus:ring-red-500" : "",
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

// --- Textarea ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, id, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        id={id}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-y",
          error ? "border-red-500 focus:ring-red-500" : "",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

// --- Checkbox ---
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ className, label, id, ...props }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        className={cn(
          "h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600 cursor-pointer accent-primary-600",
          className
        )}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  );
};

// --- Card ---
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm", className)} {...props}>
    {children}
  </div>
);

// --- Dialog / Modal ---
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, description, children, footer, maxWidth = "max-w-lg" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn("relative z-50 w-full overflow-hidden rounded-xl bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]", maxWidth)}>
        <div className="p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex justify-between items-start">
             <div>
                <h2 className="text-lg font-semibold leading-none tracking-tight text-slate-900">{title}</h2>
                {description && <p className="text-sm text-slate-500 mt-1.5">{description}</p>}
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-6 pt-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Tooltip (Simple) ---
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 text-xs text-white bg-slate-800 rounded shadow-sm whitespace-nowrap -top-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-200 pointer-events-none">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
};

// --- Slider ---
interface SliderProps {
  value: number;
  max: number;
  onChange: (val: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, max, onChange, className }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("relative flex items-center select-none touch-none w-full h-5 group cursor-pointer", className)}>
      <input 
        type="range" 
        min={0} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
      />
      <div className="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-600 transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div 
        className="absolute w-3 h-3 bg-white border-2 border-primary-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ left: `calc(${percentage}% - 6px)` }}
      />
    </div>
  );
};

// --- Popover (Simple) ---
interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ trigger, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl border border-slate-100 p-1 z-50 min-w-[120px] animate-in fade-in zoom-in-95 duration-100">
           <div onClick={() => setIsOpen(false)}>
             {content}
           </div>
        </div>
      )}
    </div>
  );
};

// --- Tabs (Segmented Control) ---
interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeValue: value, onValueChange } as any);
        }
        return child;
      })}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeValue?: string;
  onValueChange?: (value: string) => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, activeValue, onValueChange }) => {
  const isActive = value === activeValue;
  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap",
        isActive 
          ? "bg-white text-primary-700 shadow-sm" 
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
      )}
    >
      {children}
    </button>
  );
};

// --- ProgressBar ---
interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("h-1.5 w-full bg-slate-800 rounded-full overflow-hidden", className)}>
      <div 
        className="h-full bg-primary-500 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
