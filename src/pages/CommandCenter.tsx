import { CommandDashboard } from '@/components/CommandDashboard';

export default function CommandCenter() {
  return (
    <div className="container-fluid py-3">
      <div className="page-title mb-3">
        <h4 className="mb-0">Command Center</h4>
        <p className="text-muted small mb-0">Real-time overview of base assets, missions, and activity.</p>
      </div>
      <CommandDashboard />
    </div>
  );
}
