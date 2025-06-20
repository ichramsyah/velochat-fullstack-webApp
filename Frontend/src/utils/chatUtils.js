export const getSenderName = (loggedUser, users) => {
  if (!users || users.length < 2) return '';
  return users[0]._id === loggedUser._id ? users[1]?.name : users[0]?.name;
};

export const getOtherUser = (loggedUser, users) => {
  if (!users || users.length < 2) return null;
  return users.find((user) => user._id !== loggedUser?._id);
};
