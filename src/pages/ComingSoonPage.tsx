import React from 'react';
import { ViewRoute } from '../types';
import { ComingSoon } from '../components/ComingSoon';

interface ComingSoonPageProps {
  title?: string;
  subtitle?: string;
  onNavigate: (route: ViewRoute) => void;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ onNavigate }) => {
  return <ComingSoon onNavigate={onNavigate} />;
};
