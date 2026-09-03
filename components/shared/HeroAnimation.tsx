export default function HeroAnimation() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 flex items-center justify-center">
        
        {/* 1. Asosiy yorqin havoriy (Cyan) nur - Juda aniq ko'rinadigan qilingan */}
        <div className="absolute w-[500px] h-[500px] md:w-[750px] md:h-[750px] bg-cyan-500/30 rounded-full blur-[120px] animate-glow" />
        
        {/* 2. Galaktik Binafsha/Indigo nur */}
        <div className="absolute w-[450px] h-[450px] md:w-[650px] md:h-[650px] bg-purple-600/25 rounded-full blur-[140px] animate-glow-delayed -translate-x-32 translate-y-16" />
        
        {/* 3. Texnologik To'r (Tech Grid) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />
        
        {/* 4. Suzib yuruvchi nurli zarrachalar (Floating Tech Particles) */}
        <div className="absolute inset-0 overflow-hidden">
        {/* Har xil joylashgan, neon nurlanuvchi va vaqti-vaqti bilan miltillab turuvchi zarrachalar */}
        <div className="absolute top-[20%] left-[25%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee] animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-[35%] right-[22%] w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_15px_#c084fc] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[30%] left-[28%] w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-ping" style={{ animationDuration: '5s' }} />
        <div className="absolute top-[65%] right-[27%] w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_12px_#67e8f9] animate-pulse" style={{ animationDuration: '3.5s' }} />
        <div className="absolute top-[45%] left-[15%] w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_14px_#818cf8] animate-pulse" style={{ animationDuration: '4.5s' }} />
        <div className="absolute bottom-[20%] right-[35%] w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-ping" style={{ animationDuration: '6s' }} />
        </div>
        
        </div>
    );
}