import React from 'react';
import { EuiSwitch } from '@elastic/eui';

interface SettingsToggleProps {
  includeSystem: boolean;
  onChange: (checked: boolean) => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({ includeSystem, onChange }) => {
  return (
    <EuiSwitch
      label="Include system indices"
      checked={includeSystem}
      onChange={(e) => onChange(e.target.checked)}
      compressed
    />
  );
}; 