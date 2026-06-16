import { ReactNode } from "react";

interface UserMenuListProps {
  onToggle: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}

const UserMenuList = ({ onToggle, children }: UserMenuListProps) => {
  return (
    <>
      <div onClick={onToggle} className="fixed inset-0" />
      <ul className="absolute right-0 top-[115%] w-48 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 py-2 text-slate-200 shadow-2xl">
        {children}
      </ul>
    </>
  );
};

export default UserMenuList;
