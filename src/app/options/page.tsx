"use client";

import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/lp_imgs/login.png')" }}
    >
      <div className="w-[92vw] h-[80vh] bg-white rounded-3xl overflow-hidden flex">
        <div
          className="
            w-1/2 h-full
            flex flex-col justify-between
            px-16 py-14
            border-r border-gray-300
            bg-no-repeat bg-contain bg-left
          "
          style={{
            backgroundImage: "url('/options_imgs/opt1.png')",
            backgroundSize: "contain",
          }}
        >
          <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold w-fit">
            For Businesses
          </span>

          <button
            onClick={() => router.push("/create")}
            className="
              px-10 py-4 rounded-full
              bg-emerald-500 text-white text-lg
              hover:bg-emerald-600 transition
              w-fit
            "
          >
            Admin Page →
          </button>
        </div>

        <div
          className="
            w-1/2 h-full
            flex flex-col justify-between
            px-16 py-14
            bg-no-repeat bg-contain bg-right
          "
          style={{
            backgroundImage: "url('/options_imgs/opt2.png')",
            backgroundSize: "contain",
            marginBottom: "50px",
          }}
        >
          <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold w-fit">
            For Customers
          </span>

          <button
            onClick={() => router.push("/book")}
            className="
              px-10 py-4 rounded-full
              bg-emerald-500 text-white text-lg
              hover:bg-emerald-600 transition
              w-fit
            "
          >
            User Page →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
