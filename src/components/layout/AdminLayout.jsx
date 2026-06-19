import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function AdminLayout({ activePage, children, navItems, onNavigate, pageTitle }) {
  return (
    <div className="admin-shell">
      <Sidebar activePage={activePage} navItems={navItems} onNavigate={onNavigate} />
      <div className="workspace">
        <Topbar pageTitle={pageTitle} />
        <main className="workspace__main">{children}</main>
      </div>
    </div>
  );
}
