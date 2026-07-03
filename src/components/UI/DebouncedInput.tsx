'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onDebounce: (value: string) => void;
  delay?: number;
}

export function DebouncedInput({
  value,
  onDebounce,
  delay = 300,
  className,
  ...props
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const onDebounceRef = useRef(onDebounce);

  // Sync ref with latest callback
  useEffect(() => {
    onDebounceRef.current = onDebounce;
  }, [onDebounce]);

  // Sync with store value if it changes from outside
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onDebounceRef.current(localValue);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [localValue, delay, value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onDebounceRef.current(localValue);
    }
  };

  return (
    <input
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      className={className}
    />
  );
}

interface DebouncedTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onDebounce: (value: string) => void;
  delay?: number;
}

export function DebouncedTextarea({
  value,
  onDebounce,
  delay = 300,
  className,
  ...props
}: DebouncedTextareaProps) {
  const [localValue, setLocalValue] = useState(value);
  const onDebounceRef = useRef(onDebounce);

  // Sync ref with latest callback
  useEffect(() => {
    onDebounceRef.current = onDebounce;
  }, [onDebounce]);

  // Sync with store value if it changes from outside
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onDebounceRef.current(localValue);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [localValue, delay, value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onDebounceRef.current(localValue);
    }
  };

  return (
    <textarea
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      className={className}
    />
  );
}
