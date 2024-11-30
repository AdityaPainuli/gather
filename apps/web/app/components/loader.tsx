import React from 'react';

const EmojiSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-[spin_2s_linear_infinite,pulse_2s_ease-in-out_infinite] text-6xl ">
        🍊
      </div>
    </div>
  );
};

export default EmojiSpinner;