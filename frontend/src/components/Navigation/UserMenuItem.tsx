import { ReactNode } from "react";

interface UserMenuItemProps {
  label: string;
  icon: ReactNode;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}

const UserMenuItem = ({ label, icon, onClick }: UserMenuItemProps) => {
  return (
    <li
      onClick={onClick}
      className="cursor-pointer px-3 py-2 transition-colors hover:bg-slate-800 hover:text-brand-400"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
    </li>
  );
};

export default UserMenuItem;
