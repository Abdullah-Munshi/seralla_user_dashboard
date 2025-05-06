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

  const output = mission.text && RenderWithBreaks(mission.text);

  return (
    <Box>
      <div className="grid grid-cols-1 md:grid-cols-[auto_250px] gap-6 items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BlkTitle>Mission:</BlkTitle>
          </div>

          <p className="text-sm sm:text-base">{output}</p>
          <p className="text-sm sm:text-base">
            {!mission && "No mission available."}
          </p>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <p className="font-semibold">Status: </p>

          {mission.status === 0 && (
            <p className="inline-flex items-center gap-1 font-medium text-sm">
              <span className="w-5 h-5 bg-[#3399FF] grid place-content-center rounded-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#fff"
                  className="w-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </span>
              Ongoing
            </p>
          )}

          {mission.status === 1 && (
            <p className="inline-flex items-center gap-1 font-medium text-sm">
              <span className="w-5 h-5 bg-[#61d345] grid place-content-center rounded-sm">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  width="122.877px"
                  height="101.052px"
                  viewBox="0 0 122.877 101.052"
                  className="w-2.5 h-2.5"
                >
                  <g>
                    <path
                      fill="white"
                      d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"
                    />
                  </g>
                </svg>
              </span>
              Completed
            </p>
          )}
        </div>
      </div>
    </Box>
  );
};

export default Mission;
