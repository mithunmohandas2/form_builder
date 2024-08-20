import Logo from "../../../public/images/logo.png";
import { useState } from 'react';

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="px-[16px] md:px-8 2xl:px-10 py-1 z-50 bg-white border-b">
            <div className="flex justify-between items-center my-1">
                <div className="logo">
                    <img src={Logo} alt="Logo" className="w-[174px] h-auto" />
                </div>

                {/* Large display Header */}
                <div className="hidden md:flex md:gap-5">
                    <div className="cursor-pointer px-2 py-1 rounded hover:bg-headerHoverBg">
                        <img src="/icons/home.svg" alt="home" className="w-[22px]" />
                    </div>
                    <div className="text-[15px] font-[300] cursor-pointer text-headerSelectedText bg-headerSelectedBg px-2 py-1 rounded hover:bg-headerHoverBg hover:text-primary">
                        <span>Forms</span>
                    </div>
                    <div className="text-[15px] font-[300] cursor-pointer text-headerText px-2 py-1 rounded hover:bg-headerHoverBg hover:text-primary">
                        <span>Templates</span>
                    </div>
                    <div className="text-[15px] font-[300] cursor-pointer text-headerText px-2 py-1 rounded hover:bg-headerHoverBg hover:text-primary">
                        <span>Settings</span>
                    </div>
                </div>

                <div className="md:flex items-baseline hidden">
                    <img src="/icons/logout.svg" alt="logout" className="w-[20px] cursor-pointer" />
                </div>

                {/* --------------------------------------------- */}

                {/* Hamburger icon for mobile */}
                <button id="mobileOpenButton" className="text-3xl md:hidden z-50 focus:outline-none  text-gray-600" onClick={toggleMenu}>
                    &#9776;
                </button>

                {/* Mobile Header */}
                {isOpen && (
                    <div className="md:hidden z-50 absolute top-0 left-0 w-full bg-white p-8 h-[100vh]">
                        <div className="relative flex flex-col  mx-4 my-4 gap-8 py-5">

                            <div className="flex items-center justify-end px-4 w-full ">
                                <span className="material-symbols-outlined cursor-pointer" onClick={toggleMenu}> close </span>
                            </div>

                            <div className=" text-2xl cursor-pointer text-headerText"> Home </div>
                            <div className=" text-2xl cursor-pointer text-headerSelectedText"> Forms </div>
                            <div className=" text-2xl cursor-pointer text-headerText"> Templates </div>
                            <div className=" text-2xl cursor-pointer text-headerText"> Settings </div>

                            <span className="text-headerText/80"> Logout </span>
                        </div>
                    </div>
                )}

            </div>
        </header>
    )
}

export default Header