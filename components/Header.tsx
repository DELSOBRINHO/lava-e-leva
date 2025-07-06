import React from 'react';
import type { Session } from '@supabase/supabase-js';
import { WashingMachineIcon } from '../constants';

interface HeaderProps {
    onLogoClick: () => void;
    session: Session | null;
    onLoginClick: () => void;
    onLogout: () => Promise<void>;
    onViewHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, session, onLoginClick, onLogout, onViewHistory }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
            <button onClick={onLogoClick} className="flex items-center space-x-3 cursor-pointer">
                <WashingMachineIcon className="w-10 h-10 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">
                    Lava <span className="text-blue-600">&</span> Leva
                </h1>
            </button>
            <div className="flex items-center space-x-4">
                {session ? (
                    <>
                        <span className="text-sm text-gray-600 hidden sm:block" aria-label="Usuário logado">{session.user.email}</span>
                        <button
                            onClick={onViewHistory}
                            className="font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Meus Pedidos
                        </button>
                        <button
                            onClick={onLogout}
                            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Sair
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-300"
                    >
                        Entrar
                    </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
