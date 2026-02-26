import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Lottie from 'lottie-react';
import animationData from '@/assets/created.json';
import { setActive, getSuccessActive } from '@/features/successAnimationSlice'

const SuccessAnimation = () => {
  const dispatch = useDispatch();
  const isActive = useSelector(getSuccessActive);
  // React.useEffect(() =>{
  //   const timer = setTimeout(() => {
  //     dispatch(setActive(false));
  //   }, 2000);
  //   return () => clearTimeout(timer);
  // },[])
  const handleComplete = () => {
    dispatch(setActive(false));
  };
  if(isActive){
  return (
  
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      zIndex: 1300, // Ensures it appears on top of other content
      transition: 'background-color 0.3s ease',
    }}
    >
        <Lottie
          animationData={animationData}
          loop={false}
          onComplete={handleComplete}
          style={{ width: 300, height: 300 }}
        />
    </div>

  )};
};

export default SuccessAnimation;