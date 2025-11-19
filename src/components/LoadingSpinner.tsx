interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = "Loading" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-600">
      <span
        className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500"
        aria-hidden="true"
      />
      <p className="text-sm font-medium tracking-wide">{label}…</p>
    </div>
  );
}
