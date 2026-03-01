
interface Plan {
  category: string;
  items: string[];
  color: string;
  bgColor: string;
}

interface Props {
  plans: Plan[];
  progress: Record<string, boolean>;
  onToggle: (key: string, value: boolean) => void;
}

export default function SelfCarePlan({ plans, progress, onToggle }: Props) {
  const toggle = (planIdx: number, itemIdx: number) => {
    const key = `${planIdx}-${itemIdx}`;
    onToggle(key, !progress[key]);
  };

  return (
    <section className="bg-white rounded-2xl p-8 shadow-soft mb-12" aria-label="Self care plan">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Self-Care Plan</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 border border-gray-200 hover:shadow-softLg transition-all`}
          >
            <div
              className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-semibold mb-4`}
            >
              {plan.category}
            </div>
            <ul className="space-y-3">
              {plan.items.map((item, i) => {
                const key = `${idx}-${i}`;
                return (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <input
                      type="checkbox"
                      checked={progress[key] ?? false}
                      onChange={() => toggle(idx, i)}
                      className="w-4 h-4 rounded border-gray-300 text-mint-600 focus:ring-mint-500 cursor-pointer"
                      aria-label={`Mark ${item} complete`}
                    />
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
