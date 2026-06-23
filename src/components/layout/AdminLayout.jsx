import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AdminLayout({
  activePage,
  children,
  navItems,
  onNavigate,
  pageTitle,
  onLogout
}) {
  return (
    <div className="admin-shell">
      <Sidebar
        activePage={activePage}
        navItems={navItems}
        onNavigate={onNavigate}
      />

      <div className="workspace">

        <Topbar
          pageTitle={pageTitle}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '12px 20px'
          }}
        >
          <button
            onClick={onLogout}
            style={{
              padding: '8px 14px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <main className="workspace__main">
          {children}
        </main>

      </div>
    </div>
  );
}