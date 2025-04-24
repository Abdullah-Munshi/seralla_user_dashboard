import { CreditCardIcon } from "@heroicons/react/24/solid";
import { BlkTitle, Box } from "./Utils";

const Balance = ({ balance }) => {
  return (
    <Box>
      <div className="flex items-center gap-2 mb-2">
        <CreditCardIcon className="h-6 w-6 text-primary" />
        <BlkTitle>Accout Balance</BlkTitle>
      </div>
      <div className="bg-primary/10 p-4 rounded-lg text-center">
        <strong className="inline-block text-3xl md:text-4xl text-primary">
          ${balance}
        </strong>
      </div>
    </Box>
  );
};

export default Balance;
