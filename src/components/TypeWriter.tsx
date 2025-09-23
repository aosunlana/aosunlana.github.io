import { useEffect, useState } from "react";

interface TypeWriterProps {
  text: string;
  typeSpeed?: number;
  eraseSpeed?: number;
  pauseDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TypeWriter = ({ 
  text, 
  typeSpeed = 80, 
  eraseSpeed = 50, 
  pauseDuration = 2000, 
  className = "", 
  style 
}: TypeWriterProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const typeText = () => {
      if (displayedText.length < text.length) {
        setDisplayedText(text.slice(0, displayedText.length + 1));
        timeoutId = setTimeout(typeText, typeSpeed);
      } else {
        setIsPaused(true);
        timeoutId = setTimeout(() => {
          setIsPaused(false);
          setIsTyping(false);
          eraseText();
        }, pauseDuration);
      }
    };

    const eraseText = () => {
      if (displayedText.length > 0) {
        setDisplayedText(displayedText.slice(0, -1));
        timeoutId = setTimeout(eraseText, eraseSpeed);
      } else {
        setIsPaused(true);
        timeoutId = setTimeout(() => {
          setIsPaused(false);
          setIsTyping(true);
          typeText();
        }, pauseDuration / 2);
      }
    };

    if (isTyping && !isPaused) {
      typeText();
    } else if (!isTyping && !isPaused) {
      eraseText();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [displayedText, isTyping, isPaused, text, typeSpeed, eraseSpeed, pauseDuration]);

  return (
    <span className={className} style={style}>
      {displayedText}
      <span 
        className="inline-block w-0.5 ml-1 bg-foreground animate-blink"
        style={{ height: '10px' }}
      />
    </span>
  );
};

export default TypeWriter;