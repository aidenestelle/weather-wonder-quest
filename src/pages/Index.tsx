import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '@/components/LoadingAnimation';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate('/');
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingAnimation message="Loading Weather Wonder Quest..." />
    </div>
  );
};

export default Index;
