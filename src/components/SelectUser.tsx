import { useUser } from "../contexts/user";

const getUserAvatar = (name: string) => {
    const userAvatars= ['🐶', '🙈', '😈', '👹', '🧟‍♂️', '💀', '👾', '👺', '🎃', '🤡'];
    const index = hashStringToNumber(name);
    return userAvatars[index];
};

const hashStringToNumber = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash | 0;
    }
    return Math.abs(hash) % 10;
};

export const SelectUser = () => {
    const { users, selectedUser, selectUser, unselectUser } = useUser();

    const handleUserClick = (e: React.MouseEvent, user: typeof users[0]) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectedUser?.id === user.id) {
            unselectUser();
        } else {
            selectUser(user);
        }
    };

  return (
    <div className="py-20 bg-amber-50 min-h-screen bg-image-food">
      <h1 className="font-serif text-shadow-sm mt-2 text-center text-2xl font-bold text-sky-900 px-4 py-2 rounded-md bg-sky-100 outline outline-sky-900 relative z-2 max-w-120 mx-auto">Select User</h1>
      <ul className="mt-20 space-y-2 max-w-120 mx-auto relative z-2">
        {users.map((user, i) => {
            const isSelected = selectedUser?.id === user.id;
            return (
                <li
                    key={user.name+i}
                    onClick={(e) => handleUserClick(e, user)}
                    className={`
                        text-left text-lg px-4 py-3 rounded-lg cursor-pointer
                        transition-all duration-200 ease-in-out
                        border-2 shadow-sm
                        ${isSelected 
                            ? 'bg-blue-500 text-white border-blue-600 shadow-lg' 
                            : 'bg-white text-gray-800 border-amber-200 hover:bg-amber-50 hover:border-amber-500 hover:shadow-md'
                        }
                    `}
                >
                    <h2 className="text-lg font-bold">{getUserAvatar(user.name)} {user.name}</h2>
                    <small>{user.preferences.dietary_requirements.join(', ')}</small>
                    <div>{user.preferences.food_preferences.join(', ')}</div>
                </li>
            );
        })}
      </ul>
    </div>
  )
}