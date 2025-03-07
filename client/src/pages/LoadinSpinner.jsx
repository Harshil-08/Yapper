const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600 border-opacity-75"></div>
    </div>
  );
};

export default LoadingSpinner;
