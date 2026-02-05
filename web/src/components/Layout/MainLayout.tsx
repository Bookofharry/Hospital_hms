import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="app-shell">
            <div className="app-background" aria-hidden="true" />
            <Sidebar />
            <div className="app-main">
                <Header />
                <main className="app-content">
                    <div className="app-container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
