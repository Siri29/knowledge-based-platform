import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function PasswordDisplay({ password }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="d-flex align-items-center">
      <code className="text-danger me-2">
        {showPassword ? password : '••••••••'}
      </code>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FiEyeOff size={12} /> : <FiEye size={12} />}
      </Button>
    </div>
  );
}

export default PasswordDisplay;