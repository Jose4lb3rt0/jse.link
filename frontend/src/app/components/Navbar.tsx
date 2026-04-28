export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
                <div className="text-xl font-black tracking-tighter text-white bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-400">
                    JSE <span className="text-indigo-400">.link</span>
                </div>
                <div className="hidden md:flex space-x-8 text-slate-400 font-medium">
                    {/* <a href="/" className="hover:text-indigo-300 transition-colors">Acortador</a> */}
                    {/* <a href="#" className="hover:text-indigo-300 transition-colors">Features</a>
                    <a href="#" className="hover:text-indigo-300 transition-colors">Pricing</a>
                    <a href="#" className="hover:text-indigo-300 transition-colors">Analytics</a>
                    <a href="#" className="hover:text-indigo-300 transition-colors">API</a> */}
                </div>
                {/* <div className="flex items-center space-x-4">
                    <button className="text-white font-medium hover:text-indigo-300">Iniciar Sesión</button>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold transition-all">
                        Regístrate
                    </button>
                </div> */}
            </div>
        </nav>
    );
}