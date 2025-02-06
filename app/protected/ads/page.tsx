import AdBanner from "@/components/features/ads/GoogleAd";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <nav className="bg-gray-800 py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-white">My Blog</h1>
          <a href="#" className="text-gray-400 hover:text-white">
            About
          </a>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        <div className="flex flex-wrap justify-between">
          <div className="mb-8 w-full px-4 md:w-8/12">
            <div className="mb-5 bg-black">
              <AdBanner
                dataAdFormat="auto"
                dataFullWidthResponsive={true}
                dataAdSlot="4196406083"
              />
            </div>

            <img
              src="https://via.placeholder.com/1200x600"
              alt="Featured Image"
              className="h-64 w-full rounded object-cover"
            />
            <h2 className="mb-2 mt-4 text-4xl font-bold">My First Blog Post</h2>
            <p className="mb-4 text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mb-4 text-gray-700">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <p className="mb-4 text-gray-700">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
          <div className="mb-8 w-full px-4 md:w-4/12">
            <div className="mb-5 bg-black"></div>
            <div className="rounded bg-gray-100 px-4 py-6">
              <h3 className="mb-2 text-lg font-bold">Categories</h3>
              <ul className="list-inside list-disc">
                <li>
                  <a href="#" className="text-gray-700 hover:text-gray-900">
                    Technology
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-gray-900">
                    Travel
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-gray-900">
                    Food
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-5 bg-black"></div>
          </div>
        </div>
      </main>
    </>
  );
}
