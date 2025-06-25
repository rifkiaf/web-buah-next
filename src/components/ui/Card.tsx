import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = true,
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md
        ${padding ? "p-6" : ""}
        ${hover ? "transition-transform hover:scale-[1.02]" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;