export const Container = ({ children }) => {
  return <div className="max-w-[1140px] mx-auto px-4">{children}</div>;
};

export const BlkTitle = ({ children }) => {
  return <h3 className="text-xl font-semibold"> {children}</h3>;
};

export const Box = ({ children }) => {
  return (
    <div className="bg-white border border-[#ddd] rounded-lg p-4 lg:p-6">
      {children}
    </div>
  );
};
