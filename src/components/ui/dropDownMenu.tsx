"use client";

import { useState, ReactNode, useRef, useEffect } from "react";

interface DropdownMenuProps {
  children: ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block">{children}</div>;
}

interface DropdownMenuTriggerProps {
  children: ReactNode;
  onClick: () => void;
}

export function DropdownMenuTrigger({ children, onClick }: DropdownMenuTriggerProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200">
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function DropdownMenuContent({ children, isOpen, onClose }: DropdownMenuContentProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50">
      {children}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
}

export function DropdownMenuItem({ children, onClick }: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 cursor-pointer hover:bg-gray-200 transition"
    >
      {children}
    </div>
  );
}
