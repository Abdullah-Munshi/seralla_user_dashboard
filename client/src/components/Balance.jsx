import { BlkTitle, Box } from "./Utils";

const Balance = ({ balance }) => {
  return (
    <Box>
      <div className="flex items-center gap-2 mb-2">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 122.88 108.91"
          className="w-6 h-5  -translate-y-0.5"
        >
          <g>
            <path
              fill="black"
              d="M2.79,41.59L61.44,0l58.95,41.59L2.79,41.59L2.79,41.59z M0,102.28h9.08v-6.33h1.32v-3.02l3.85,0V56.7H6.38 v-8.68h110.11v8.68h-7.86v36.23h3.85v3.02l1.32,0v6.33h9.08v6.63H0V102.28L0,102.28z M32.59,95.95h4.44v-3.02l3.85,0V56.7H28.74 v36.23h3.85V95.95L32.59,95.95L32.59,95.95z M59.22,95.95h4.45v-3.02l3.84,0V56.7H55.37v36.23h3.85V95.95L59.22,95.95L59.22,95.95z M85.85,95.95h4.45v-3.02l3.85,0V56.7H82v36.23h3.85V95.95L85.85,95.95L85.85,95.95z M41.69,31.1l19.84-15.22L81.48,31.1H41.69 L41.69,31.1z"
            />
          </g>
        </svg>
        <BlkTitle>Account Balance</BlkTitle>
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
