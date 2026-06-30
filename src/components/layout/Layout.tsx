import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

export default function Layout({ children, fullWidth, noPadding }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className={`flex-1 ${noPadding ? '' : 'py-6 sm:py-10'}`}
      >
        <div className={fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
          {children}
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
