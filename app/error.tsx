"use client";

type ErrorProps = {
  error: Error; // Or `unknown` if you're unsure
  reset: () => void;
};

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <button
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
};

export default Error;