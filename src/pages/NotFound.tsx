import { useLocation, Link } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  
  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="absolute bottom-0 text-9xl md:text-[12rem] font-black text-gray-50 select-none pointer-events-none z-0">
        404
      </h1>
      <div className="relative z-10">
        <h1 className="text-xl md:text-2xl font-semibold mt-6">ページが見つかりませんでした</h1>
        <p className="mt-2 text-base text-gray-400 font-mono">{location.pathname}</p>
        <p className="mt-4 text-lg md:text-xl text-gray-500">お探しのページは存在しないか、移動した可能性があります</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#1A2B4C] text-[#1A2B4C] text-sm sm:text-base font-bold hover:bg-[#1A2B4C] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap group"
        >
          <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
          <span>Homeに戻る</span>
        </Link>
      </div>
    </div>
  );
}