import { LinkButton } from "@/components/UI/Button";
import { cardClass } from "@/lib/ui";
import { PlusIcon } from "@heroicons/react/20/solid";

const AddProductCard = () => {
  return (
    <div className={`${cardClass} flex flex-col gap-6`}>
      <p className="font-display text-2xl font-semibold text-slate-100">Create product</p>
      <p className="text-sm text-slate-400">Add new components to the storefront inventory.</p>
      <LinkButton to="/createproduct" variant="brand" className="w-fit">
        <span className="flex items-center gap-3">
          <PlusIcon className="h-5 w-5 flex-shrink-0" />
          Add product
        </span>
      </LinkButton>
    </div>
  );
};

export default AddProductCard;
