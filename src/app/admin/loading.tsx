export default function AdminLoading() {
  return (
    <div>
      <div className="admin-skeleton" style={{ width: "100%", height: 96, borderRadius: 12, marginBottom: 24 }} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="admin-skeleton" style={{ height: 80, borderRadius: 12 }} />
        ))}
      </div>

      <div className="admin-skeleton" style={{ width: 120, height: 36, borderRadius: 8, marginBottom: 24 }} />

      <div className="admin-card">
        <div className="admin-skeleton" style={{ width: 80, height: 14, marginBottom: 16, borderRadius: 4 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="admin-skeleton" style={{ width: "100%", height: 44, borderRadius: 8, marginBottom: 8 }} />
        ))}
      </div>
    </div>
  );
}
