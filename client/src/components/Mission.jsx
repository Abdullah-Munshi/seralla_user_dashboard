import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { BlkTitle, Box } from "./Utils";

const Mission = ({ mission }) => {
  function RenderWithBreaks(text) {
    const parts = text.split(/\{(\d+)\\n\}/g);
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            const count = parseInt(part);
            return Array.from({ length: count }, (_, i) => (
              <br key={`${index}-${i}`} />
            ));
          } else {
            return part;
          }
        })}
      </>
    );
  }

  const output = mission && RenderWithBreaks(mission);

  return (
    <Box>
      <div className="flex items-center gap-2 mb-2">
        <RocketLaunchIcon className="h-6 w-6 " />
        <BlkTitle icon={RocketLaunchIcon}>Mission:</BlkTitle>
      </div>

      <p className="ml-8 text-sm sm:text-base">{output}</p>
      <p className="ml-8 text-sm sm:text-base">
        {!mission && "No mission available."}
      </p>
    </Box>
  );
};

export default Mission;
