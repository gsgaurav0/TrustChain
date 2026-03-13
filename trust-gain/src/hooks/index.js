import { useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};

export const useAnimationVariants = () => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  },
  cardHover: {
    whileHover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  },
  buttonHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
});

export const useNumberAnimation = (targetNumber) => {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    let currentNumber = 0;
    const increment = targetNumber / 50;
    const interval = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= targetNumber) {
        setDisplayNumber(targetNumber);
        clearInterval(interval);
      } else {
        setDisplayNumber(Math.floor(currentNumber));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return displayNumber;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETH',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(amount);
};

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const truncateAddress = (address) => {
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
};