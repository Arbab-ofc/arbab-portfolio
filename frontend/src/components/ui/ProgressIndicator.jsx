import React from 'react';

const ProgressIndicator = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
    { id: 1, name: 'Basic Info', icon: '📝' },
    { id: 2, name: 'Technologies', icon: '⚙️' },
    { id: 3, name: 'Media', icon: '🖼️' },
    { id: 4, name: 'Settings', icon: '⚡' }
  ];

  return (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />

      {/* Progress Bar Fill */}
      <div
        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500 ease-out"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />

      {/* Step Indicators */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick && onStepClick(step.id)}
              disabled={isUpcoming}
              className={`
                group relative flex flex-col items-center gap-2 transition-all duration-300
                ${isUpcoming ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
              `}
            >
              {/* Step Circle */}
              <div className={`
                relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2
                transition-all duration-300 text-sm font-medium backdrop-blur-sm
                ${isCompleted
                  ? 'border-sky-500 bg-sky-500/20 text-sky-100 shadow-lg shadow-sky-500/25'
                  : isCurrent
                  ? 'border-white bg-white/10 text-white shadow-lg shadow-white/10 ring-4 ring-white/20'
                  : 'border-white/20 bg-white/5 text-white/60'
                }
              `}>
                {isCompleted ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="absolute -bottom-6 whitespace-nowrap">
                <span className={`
                  text-xs font-medium transition-colors duration-300
                  ${isCompleted || isCurrent ? 'text-white' : 'text-white/60'}
                `}>
                  {step.name}
                </span>
              </div>

              {/* Hover Tooltip */}
              <div className={`
                absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                pointer-events-none z-50
              `}>
                <div className="rounded-lg bg-black/80 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  {step.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Text */}
      <div className="mt-8 text-center">
        <span className="text-sm font-medium text-white/60">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;