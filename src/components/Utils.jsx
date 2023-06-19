import React from 'react';
import { IconContext } from 'react-icons';

export function Icon(props) {
  return (
    <IconContext.Provider value={{ size: '1.3em', className: 'icon' }}>
      {props.children}
    </IconContext.Provider>
  );
}
