interface AvatarListProps {
  max?: number;
  users: {
    name: string;
    src?: string;
  }[];
}

export default function AvatarList(props: AvatarListProps) {
  const { users, max } = props;
  // const { length } = users;

  const renderedUsers = max ? users.slice(0, max) : users;

  return (
    <div className="flex -space-x-1 relative z-0 overflow-hidden">
      {renderedUsers.map((user, i) => {
        return (
          <img
            className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
            src={`${user.src || "../avatar_placeholder.png"}`}
            alt={user.name}
          />
        );
      })}
      {Number(max) > 0 && users.length > Number(max) && (
        <div className="relative text-xs text-white bg-gray-500 z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white flex align-center justify-center">
          +{users.length - Number(max)}
        </div>
      )}
    </div>
  );
}
