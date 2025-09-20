import Logo from '@/components/common/Logo';

const LoadingScreen = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-dark-primary flex items-center justify-center z-50">
      <div className="animate-spin">
        <Logo link="" />
      </div>
    </div>
  );
};

export default LoadingScreen;
