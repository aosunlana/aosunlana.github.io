import { useEffect, useState } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TypeWriter = ({ text, speed = 100, className = "", style }: TypeWriterProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className} style={style}>
      {displayedText}
      <span 
        className={`inline-block w-0.5 h-5 ml-1 bg-foreground ${
          isComplete ? "animate-blink" : "opacity-100"
        }`}
      />
    </span>
  );
};

export default TypeWriter;