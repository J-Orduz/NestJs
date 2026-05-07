import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  delay?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  gradientFrom, 
  gradientTo, 
  delay = 0 
}) => {
  return (
    <div 
      className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
      <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/40 rounded-full animate-shimmer"></div>
      </div>
    </div>
  );
};

export default DashboardCard;