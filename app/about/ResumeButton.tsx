"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import gsap from "gsap";

export default function ResumeButton() {
  const [status, setStatus] = useState<"idle" | "downloading" | "completed">("idle");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Reset text when going back to idle
  useEffect(() => {
    let ctx = gsap.context(() => {
        if (status === "idle" && textRef.current) {
            textRef.current.innerText = "Download Resume";
            gsap.to([textRef.current, iconRef.current], {
                y: 0,
                opacity: 1,
                duration: 0.3,
            });
            gsap.to(buttonRef.current, {
                backgroundColor: "",
                borderColor: "",
                duration: 0.3
            });
             gsap.set(progressRef.current, { width: "0%", opacity: 0 });
        }
    }, buttonRef);
    return () => ctx.revert();
  }, [status]);

  const handleDownload = () => {
    if (status !== "idle") return;

    setStatus("downloading");

    const ctx = gsap.context(() => {
        // Create a timeline for the download animation
        const tl = gsap.timeline({
        onComplete: () => {
            setStatus("completed");
            // Trigger actual download
            const link = document.createElement("a");
            link.href = "/resume.pdf"; // Placeholder path
            link.download = "Emmanuel_Resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Reset after a delay
            setTimeout(() => {
            setStatus("idle");
            }, 3000);
        },
        });

        // 1. Morph/Change button state
        tl.to(textRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        });

        tl.to(
        iconRef.current,
        {
            y: -20,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
        },
        "<"
        );

        // 2. Show Progress Bar
        tl.set(progressRef.current, { opacity: 0.1 });
        tl.to(progressRef.current, {
        width: "100%",
        duration: 1.5,
        ease: "power1.inOut",
        });

        // 3. Success State
        tl.to(textRef.current, {
        y: 0,
        opacity: 1,
        onStart: () => {
            if (textRef.current) textRef.current.innerText = "Downloaded!";
        },
        duration: 0.3,
        ease: "back.out(1.7)",
        });
        
        tl.to(buttonRef.current, {
            backgroundColor: "#22c55e", // Green-500
            borderColor: "#22c55e",
            duration: 0.3
        }, "<");
    }, buttonRef);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleDownload}
      disabled={status !== "idle"}
      className="relative group overflow-hidden w-full sm:w-auto min-w-[200px] h-12 rounded-xl border border-custom-gray-200 dark:border-app-border-dark bg-white dark:bg-app-card-dark hover:bg-custom-gray-50 dark:hover:bg-custom-gray-800/50 transition-colors flex items-center justify-center gap-2 px-6"
    >
      {/* Progress Bar Background */}
      <div
        ref={progressRef}
        className="absolute left-0 top-0 bottom-0 bg-custom-gray-200 dark:bg-custom-gray-700 opacity-0 z-0"
        style={{ width: "0%" }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        <div ref={iconRef}>
            <Icon
            icon="solar:file-download-linear"
            className="w-5 h-5 text-custom-gray-500 dark:text-custom-gray-400 group-hover:text-custom-gray-700 dark:group-hover:text-custom-gray-300 transition-colors"
            />
        </div>
        <span
          ref={textRef}
          className="text-sm font-medium text-custom-gray-700 dark:text-custom-gray-300"
        >
          Download Resume
        </span>
      </div>
    </button>
  );
}
