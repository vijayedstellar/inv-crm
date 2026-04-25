export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-navy">{title}</h2>
        {subtitle && <p className="text-ink-2 text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="bg-white border border-line rounded-xl p-6 shadow-sm">
        {children ?? (
          <p className="text-ink-3 text-sm">
            This module is scaffolded. Wire up the data layer in <code>app/api/</code>.
          </p>
        )}
      </div>
    </div>
  );
}
