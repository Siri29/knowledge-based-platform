import React from 'react';
import { Form } from 'react-bootstrap';

function FormInput({ label, type, name, value, onChange, required, placeholder }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </Form.Group>
  );
}

export default FormInput;