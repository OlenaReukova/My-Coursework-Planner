import React from 'react';
import Button from '@mui/material/Button';
import { FaTimes } from 'react-icons/fa';
import '../components/styles/RemoveButton.css';

const RemoveButton = ({ video, onClick }) => {
  return (
    <Button variant='contained' xs='true' className='remove-button'>
      <FaTimes className='remove-icon' />
      <span className='remove-text'>Delete</span>
    </Button>
  );
};

export default RemoveButton;
