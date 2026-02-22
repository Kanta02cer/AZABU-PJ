export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-center z-50">
      <img 
        src="https://static.readdy.ai/image/b5df369270f37f8723a252918bb84c70/1d1d39e7560d42a68ddb982578300fcd.png" 
        alt="CHALLENGE AZABU+PJ" 
        className="w-[200px] sm:w-[280px] h-auto mb-8 sm:mb-10 animate-pulse"
      />
      <div className="w-[200px] h-[3px] bg-[#F5A623]/20 rounded-full overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-[#F5A623] to-[#FFD700] rounded-full animate-[loading_1.5s_ease-in-out_infinite] shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
      </div>
      <div className="mt-5 text-[#F5A623] text-sm font-medium tracking-[2px] animate-pulse">
        LOADING...
      </div>
    </div>
  );
}
