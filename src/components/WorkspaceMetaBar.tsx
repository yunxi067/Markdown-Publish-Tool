interface WorkspaceMetaBarProps {
  lastSavedAt: string;
  status: string;
  autosavedLabel: string;
}

export function WorkspaceMetaBar({ lastSavedAt, status, autosavedLabel }: WorkspaceMetaBarProps) {
  return (
    <div className="workspace-meta">
      <span>{autosavedLabel}: {lastSavedAt}</span>
      <span>{status}</span>
    </div>
  );
}
