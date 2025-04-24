import { ReceiptRefundIcon } from "@heroicons/react/24/solid";
import { BlkTitle, Box } from "./Utils";

const ReImbursement = () => {
  return (
    <Box>
      <div className="flex items-center gap-2 mb-2">
        <ReceiptRefundIcon className="h-6 w-6 " />
        <BlkTitle>Reimbursement</BlkTitle>
      </div>
      <div>
        <p className="text-sm sm:text-base">
          Transportation costs are not automatically included. Please send your
          receipts to your recruiter to be reimbursed.
        </p>
        <button className="inline-block text-primary text-base cursor-pointer text-semibold mt-4">
          Contact your recruiter
        </button>
      </div>
    </Box>
  );
};

export default ReImbursement;
