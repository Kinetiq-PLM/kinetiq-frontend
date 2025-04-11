const Heading = ({ Title, SubTitle }) => {
  return (
    <div className="border-b-2 border-[#E8E8E8] pb-[15px]">
      <div className="p-2">
        <h1 className="font-bold text-2xl text-[#1c1c1c] mb-1">{Title}</h1>
        <h2 className="text-gray-400 text-base">{SubTitle}</h2>
      </div>
    </div>
  );
};

export default Heading;
