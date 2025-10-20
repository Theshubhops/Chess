import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px'
        }
      }}
    />
  );
};
