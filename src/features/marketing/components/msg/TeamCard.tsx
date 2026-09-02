type Props = {
  name: string;
  role: string;
  group: string;
  tasks: string[];
};

export default function TeamCard({
  name,
  role,
  group,
  tasks,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">{name}</h2>

      <p className="mt-1 text-sm text-blue-600 font-medium">
        {role}
      </p>

      <div className="mt-4">
        <p className="font-semibold">Group</p>

        <p className="text-gray-600">{group}</p>
      </div>

      <div className="mt-5">
        <p className="font-semibold mb-2">
          Responsibilities
        </p>

        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="flex gap-2">
              <span>✅</span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}