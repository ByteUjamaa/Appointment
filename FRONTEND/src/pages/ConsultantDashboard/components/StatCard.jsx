export default function StatCard({ icon, label, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow bg-${color}-50 border`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
