let usersTable = [];

const User = {
  findOrCreate(user) {
    let userFromDB = usersTable.filter(u => u.id === user.id);

    if (userFromDB.length === 0) {
      usersTable.push(user);
      return user;
    }
    return userFromDB[0];
  }
};

exports.User = User;
