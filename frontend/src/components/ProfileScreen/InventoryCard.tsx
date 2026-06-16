import { LinkButton } from "@/components/UI/Button";
import { cardClass } from "@/lib/ui";
import { InboxStackIcon } from "@heroicons/react/20/solid";

const InventoryCard = () => {
  return (
    <div className={`${cardClass} flex flex-col gap-6`}>
      <p className="font-display text-2xl font-semibold text-slate-100">Inventory</p>
      <p className="text-sm text-slate-400">Review stock and toggle product availability.</p>
      <LinkButton to="/inventory" variant="brand" className="w-fit">
        <span className="flex items-center gap-3">
          <InboxStackIcon className="h-5 w-5 flex-shrink-0" />
          Open inventory
        </span>
      </LinkButton>
    </div>
  );
};

export default InventoryCard;
