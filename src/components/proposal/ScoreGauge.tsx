import { cn } from "../../lib/utils";


interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge = ({ score, label, size = 'md' }: ScoreGaugeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getTrackColor = (score: number) => {
    if (score >= 85) return 'stroke-success';
    if (score >= 70) return 'stroke-warning';
    return 'stroke-destructive';
  };

  const sizeConfig = {
    sm: { width: 48, strokeWidth: 4, fontSize: 'text-sm' },
    md: { width: 64, strokeWidth: 5, fontSize: 'text-lg' },
    lg: { width: 80, strokeWidth: 6, fontSize: 'text-2xl' },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          {/* Background track */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            className="stroke-muted"
          />
          {/* Progress track */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn('transition-all duration-500', getTrackColor(score))}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-semibold', config.fontSize, getScoreColor(score))}>
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-muted-foreground mt-2">{label}</span>
      )}
    </div>
  );
};
