import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { ViewRoute } from '../types';

interface ComingSoonProps {
  title: string;
  subtitle: string;
  contextKicker?: string;
  onNavigate: (route: ViewRoute) => void;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ title, subtitle, onNavigate }) => (
  <main className="under-construction">
    <div className="construction-mark"><Construction size={28} /></div>
    <p className="eyebrow">RAFFIA LEGACY · BUILD IN PROGRESS</p>
    <h1>PAGE<br /><em>UNDER CONSTRUCTION.</em></h1>
    <p className="construction-title">{title}</p>
    <p className="construction-copy">{subtitle}</p>
    <button className="button button-dark" onClick={() => onNavigate({ type:'home' })}>
      <ArrowLeft size={17} /> RETURN HOME
    </button>
  </main>
);