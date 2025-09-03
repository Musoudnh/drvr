import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#3AB7BF] text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3AB7BF]"
      onFocus={(e) => {
        // Ensure the skip link is visible when focused
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.top = '1rem';
        e.currentTarget.style.left = '1rem';
        e.currentTarget.style.zIndex = '9999';
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;