type PromptCardProps = {
  isRevealed: boolean;
  text: string | null;
  lockedLabel: string;
};

export function PromptCard({ isRevealed, text, lockedLabel }: PromptCardProps) {
  if (!isRevealed) {
    return (
      <div className="w-full p-8 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
        <div className="text-4xl mb-4">🔒</div>
        <p className="font-semibold text-gray-900 dark:text-white">{lockedLabel}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
      <p className="text-lg text-gray-900 leading-relaxed dark:text-white">{text}</p>
    </div>
  );
}
