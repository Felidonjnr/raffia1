import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ViewRoute } from '../types';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  onNavigate: (route: ViewRoute) => void;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ onNavigate }) => {
  return (
    <div className="launch-prep-screen">
      {/* Animated Loom Weave Visual Accent */}
      <div className="prep-weave-ambient" aria-hidden="true">
        <div className="prep-loom-thread t1" />
        <div className="prep-loom-thread t2" />
        <div className="prep-loom-thread t3" />
        <div className="prep-loom-thread t4" />
        <div className="prep-loom-thread t5" />
      </div>

      <div className="launch-prep-inner">
        {/* Animated Spindle Seal */}
        <div className="spindle-seal-wrap">
          <div className="spindle-seal">
            <svg viewBox="0 0 100 100" className="spindle-svg">
              <path
                id="spindleCircle"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text fontSize="8.5" letterSpacing="2.5" fill="currentColor">
                <textPath href="#spindleCircle" startOffset="0%">
                  RAFFIA LEGACY · 29 OCT 2026 ·
                </textPath>
              </text>
            </svg>
            <div className="spindle-center-node" />
          </div>
        </div>

        {/* Bold, clean copy per user instruction */}
        <h1 className="prep-heading">
          THE PAGE IS STILL BEING PREPARED<br />
          <em>TO THE LEGACY PROJECT LAUNCH.</em>
        </h1>

        <p className="prep-statement">
          In the meantime you can check our marketplace
        </p>

        {/* Action Buttons */}
        <div className="prep-actions">
          <button
            onClick={() => onNavigate({ type: 'marketplace' })}
            className="button button-dark prep-btn-main"
          >
            CHECK OUR MARKETPLACE <ArrowUpRight size={17} />
          </button>
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="button button-outline prep-btn-sub"
          >
            <ArrowLeft size={16} /> RETURN HOME
          </button>
        </div>
      </div>
    </div>
  );
};
