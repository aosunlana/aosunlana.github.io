import Header from "./components/header/Header";

export default function Home() {
  return (
    <div className="items-left px-20 pr-20 pt-10 gap-6">
      <main>
        <Header />

        <div className="max-w-[542px] ">
          <h2 className="text-3xl font-medium pt-[64px] pb-6 line-height-[34px]">
            Exploring what happens <br />
            when <span>designer</span> thinks like an <span>engineer</span>.
          </h2>
          <p className="text-base">
            Hi, I’m Emmanuel - A Curious human who design interfaces and build
            digital things for a living. Sometimes with Framer, Sometimes with
            Figma, always with vibes.
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
