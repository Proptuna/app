import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  contentClassName?: string;
}

export function PageLayout({
  children,
  title,
  subtitle,
  actions,
  contentClassName = '',
}: PageLayoutProps) {
  return (
    <div className="flex-1 overflow-auto flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container max-w-screen-xl mx-auto px-6 py-6 pb-12 flex-1 flex flex-col">
        {(title || actions) && (
          <header className="mb-6 px-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              {title && (
                <div>
                  <h1 className="text-3xl font-medium text-gray-800 dark:text-gray-100 tracking-tight">{title}</h1>
                  {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1 text-base">{subtitle}</p>}
                </div>
              )}
              {actions && <div className="flex items-center gap-2 mt-3 md:mt-0">{actions}</div>}
            </div>
          </header>
        )}
        
        <div className={`flex-1 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
