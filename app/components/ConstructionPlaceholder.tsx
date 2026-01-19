import Link from "next/link";
import { Icon } from "@iconify/react";

export default function ConstructionPlaceholder({ title = "Still Baking..." }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-[50vh]">
      <div className="mb-8 p-6 rounded-full bg-custom-gray-50 dark:bg-app-card-dark  text-custom-gray-900 dark:text-white">
        <div>
          <Icon icon="solar:sledgehammer-outline" className="w-8 h-8" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-custom-gray-900 dark:text-white mb-4 tracking-tight">
        {title}
      </h2>
      
      <p className="text-lg text-custom-gray-600 dark:text-custom-gray-300 max-w-[400px] mx-auto mb-10 leading-relaxed font-medium">
        I only work on this portfolio on Sundays. <br />
        <span className="text-custom-gray-400 dark:text-app-text-dark text-base">(If I don&apos;t oversleep).</span>
      </p>
      
      <Link 
        href="/notes" 
        className="group relative inline-flex items-center gap-2 text-custom-gray-900 dark:text-white underline decoration-dotted decoration-current underline-offset-6 hover:decoration-2 hover:text-app-link-text-hover transition-colors text-lg"
      >
        <span>Read my notes</span>
        <Icon icon="solar:arrow-right-linear" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
      
      <p className="mt-8 flex items-center justify-center gap-2 text-sm text-custom-gray-400 dark:text-app-text-dark font-medium">
        <span>It&apos;s where I spill the real tea</span>
        <Icon icon="solar:cup-hot-linear" className="w-4 h-4" />
      </p>
    </div>
  );
}
