import { Bell, Search, UserRound } from 'lucide-react';

export default function Topbar({ pageTitle }) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">Product Administration</p>
        <h1>{pageTitle}</h1>
      </div>

      <div className="topbar__actions">
        <label className="topbar__search">
          <Search size={17} />
          <input aria-label="Search admin workspace" placeholder="Search products" type="search" />
        </label>
        <button aria-label="Notifications" className="icon-button" type="button">
          <Bell size={18} />
        </button>
        <button aria-label="Admin profile" className="profile-button" type="button">
          <UserRound size={18} />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
}
