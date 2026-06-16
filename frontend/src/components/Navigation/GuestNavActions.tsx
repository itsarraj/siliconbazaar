import { LinkButton } from "@/components/UI/Button";
import { UserIcon, UserPlusIcon } from "@heroicons/react/20/solid";

const GuestNavActions = () => {
  return (
    <>
      <li>
        <LinkButton to="/login" variant="transparent">
          <span className="flex items-center gap-3">
            <UserIcon className="h-5 w-5 flex-shrink-0" />
            <span className="hidden md:block">Login</span>
          </span>
        </LinkButton>
      </li>
      <li>
        <LinkButton to="/register" variant="brand">
          <span className="flex items-center gap-3">
            <UserPlusIcon className="h-5 w-5 flex-shrink-0" />
            <span className="hidden md:block">Register</span>
          </span>
        </LinkButton>
      </li>
    </>
  );
};

export default GuestNavActions;
