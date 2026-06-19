export default function DashboardCard({ icon: Icon, label, tone = 'default', value }) {
  return (
    <article className={`dashboard-card dashboard-card--${tone}`}>
      <div className="dashboard-card__icon">{Icon && <Icon size={21} />}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
