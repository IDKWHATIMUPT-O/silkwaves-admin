import { Database, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activePage, navItems, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__mark">SW</div>
        <div>
          <strong>SILKWAVES</strong>
          <span>Admin CMS</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Admin navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;

          return (
            <button
              className={isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar__status">
        <Database size={18} />
        <div>
          <strong>API Managed</strong>
          <span>No local product storage</span>
        </div>
      </div>

      <div className="sidebar__footer">
        <ShieldCheck size={16} />
        <span>Local admin portal</span>
      </div>
    </aside>
  );
}
