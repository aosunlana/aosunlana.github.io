export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 px-4 md:px-20 pt-10">
      <main className="flex-1">
        <div className="max-w-[542px] text-custom-gray-800">
          <h2 className="text-2xl md:text-3xl font-medium pt-8 md:pt-16 pb-4 md:pb-6 leading-snug">
            Exploring what happens <br />
            when <span className="text-custom-gray-400">designer</span> thinks
            like an <span className="text-custom-gray-400">engineer</span>.
          </h2>

          <p className="text-base md:text-lg leading-relaxed pb-4">
            Hi, I’m Emmanuel - a{" "}
            <span className="text-custom-gray-400">curious human</span> who
            designs interfaces and builds digital things for a living. Sometimes
            with Framer, sometimes with Figma, always with vibes.
          </p>

          <p className="text-base md:text-lg leading-relaxed">
            Explore my playground for a few things I’ve designed that actually
            shipped (and didn’t break the internet - in a good way :)
          </p>
        </div>
      </main>

      <footer className="w-full md:w-auto">
        
      </footer>
    </div>
  );
}
