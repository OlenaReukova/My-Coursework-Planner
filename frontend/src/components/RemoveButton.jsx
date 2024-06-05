import React from 'react';
import Button from '@mui/material/Button';
import { FaTimes } from 'react-icons/fa';
import '../components/styles/RemoveButton.css';

const RemoveButton = ({ onClick }) => {
  return (
    <Button
      variant='contained'
      xs='true'
      className='remove-button'
      onClick={onClick}>
      <FaTimes className='remove-icon' />
      <span className='remove-text'>Delete</span>
    </Button>
  );
};

export default RemoveButton;
