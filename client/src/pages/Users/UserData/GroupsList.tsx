import { admin_directory_v1 } from "googleapis";

interface GroupListProps {
  userGroups: admin_directory_v1.Schema$Group[];
}

export default function GroupList(props: GroupListProps) {
  return (
    <div>
      <h3 className="mb-6">Groups</h3>
      {props.userGroups.map((group) => (
        <div className="mb-3 flex" key={group.id}>
          <input
            aria-describedby="group"
            type="checkbox"
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ml-1 mr-2"
          />
          <div>
            <div className="font-medium mb-1">{group.name}</div>
            <div className="font-light text-gray-400" style={{ fontSize: 13 }}>
              {group.email}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
