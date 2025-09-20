const Avatar = ({ name }: { name: string }) => {
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div
      className={`bg-primary-600 w-10 h-10 rounded-full flex items-center justify-center text-black font-semibold`}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
