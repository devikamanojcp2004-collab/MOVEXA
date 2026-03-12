import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, User, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DancerLogo from '../common/DancerLogo';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
        setUserMenuOpen(false);
        setIsOpen(false);
    };

    const dashboardPath = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'dancer' ? '/dashboard/dancer' : '/dashboard/user';

    const navBg = isScrolled
        ? 'glass py-2'
        : 'bg-black/80 backdrop-blur-sm py-4';

    const linkColor = isScrolled ? 'text-gray-600 hover:text-maroon-700' : 'text-gray-200 hover:text-white';
    const logoColor = isScrolled ? 'text-gray-900' : 'text-white';

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 py-3 ${navBg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <DancerLogo className={`w-8 h-8 transition-colors ${isScrolled ? 'text-maroon-700' : 'text-maroon-400'}`} />
                        <span className={`text-2xl font-black tracking-tighter transition-colors ${logoColor}`}>MOVEXA</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user && user.role !== 'admin' && <Link to="/home" className={`font-semibold transition-all duration-300 ${linkColor}`}>Home</Link>}
                        {user?.role !== 'dancer' && user?.role !== 'admin' && <Link to="/workshops" className={`font-semibold transition-all duration-300 ${linkColor}`}>Find Workshops</Link>}
                    </div>

                    {/* Auth Buttons Desktop */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="relative">
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                                    <div className="w-8 h-8 rounded-full bg-maroon-700 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                                        {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="max-w-[100px] truncate">{user.name}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                                        </div>
                                        {user.role !== 'admin' && (
                                            <Link to="/home" onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-maroon-50 hover:text-maroon-700 transition-colors">
                                                <Home className="w-4 h-4" />Home
                                            </Link>
                                        )}
                                        <Link to={dashboardPath} onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-maroon-50 hover:text-maroon-700 transition-colors">
                                            <LayoutDashboard className="w-4 h-4" />Dashboard
                                        </Link>
                                        <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-maroon-50 hover:text-maroon-700 transition-colors">
                                            <User className="w-4 h-4" />Profile
                                        </Link>
                                        <hr className="border-gray-100 mx-3" />
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                            <LogOut className="w-4 h-4" />Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {!isLoginPage && <Link to="/login" className={`font-medium transition-colors px-4 py-2 rounded-xl ${isScrolled ? 'text-gray-600 hover:text-maroon-700' : 'text-gray-200 hover:text-white'}`}>Log in</Link>}
                                {!isRegisterPage && <Link to="/register" className="bg-maroon-800 hover:bg-maroon-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-maroon-900/40">Sign up</Link>}
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden ${isScrolled ? 'text-gray-600' : 'text-white'}`}>
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-4 px-4 flex flex-col space-y-2">
                    {user?.role !== 'dancer' && user?.role !== 'admin' && <Link to="/workshops" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-medium">Find Workshops</Link>}
                    <hr className="border-gray-100" />
                    {user ? (
                        <>
                            <div className="px-4 py-2">
                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                            </div>
                            <Link to={dashboardPath} onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-maroon-50 text-maroon-700 font-semibold flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" />Dashboard
                            </Link>
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-medium flex items-center gap-2">
                                <LogOut className="w-4 h-4" />Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {!isLoginPage && <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-medium">Log in</Link>}
                            {!isRegisterPage && <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl bg-maroon-800 text-white text-center font-semibold">Sign up</Link>}
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
