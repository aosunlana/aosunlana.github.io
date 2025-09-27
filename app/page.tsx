

export default function Home() {
  return (
    <div className="items-left px-20 pr-20 pt-10 flex gap-6">
      <main>
       

        <div className="max-w-[542px] text-custom-gray-800">
          <h2 className="text-3xl font-medium pt-[64px] pb-6 line-height-[34px]">
            Exploring what happens <br />
            when <span className="text-custom-gray-400 ">designer</span> thinks
            like an <span className="text-custom-gray-400 ">engineer</span>.
          </h2>
          <p className="text-lg line-height-[22x] pb-4">
            Hi, I’m Emmanuel - A{" "}
            <span className="text-custom-gray-400 ">Curious human</span> who
            design interfaces and build digital things for a living. Sometimes
            with Framer, Sometimes with Figma, always with vibes.
          </p>

          <p>
            Explore my playground for few things I’ve designed that actually
            shipped (and didn’t break the internet - in a good way :)
          </p>
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
