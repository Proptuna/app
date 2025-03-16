"use client"

import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  className?: string;
}

export function StatsCard({ title, value, className = "" }: StatsCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}
    >
      <div
        className="flex flex-col items-center justify-center h-full"
      >
        <div
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {value}
        </div>
        <div
          className="text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          {title}
        </div>
      </div>
    </div>
  );
}
