export async function authenticate(username, password) {
  const res = await fetch("http://bank.com/api/auth", {
    headers: {
      username: username,
      password: password,
    },
    method: "GET",
  });

  return await res.json();
}

export async function closeSession(token) {
  const res = await fetch("http://bank.com/api/exit", {
    headers: {
      token: token,
    },
    method: "DELETE",
  });

  if (res.status === 401) {
    return await res.json();
  } else {
    return null;
  }
}

export async function createUser(username, password, name, surname) {
  const res = await fetch("http://bank.com/api/user", {
    headers: {
      username: username,
      password: password,
      name: name,
      surname: surname,
    },
    method: "POST",
  });

  return await res.json();
}

export async function getUser(token) {
  const res = await fetch("http://bank.com/api/user", {
    headers: {
      token: token,
    },
    method: "GET",
  });

  return await res.json();
}

export async function createDeposits(token, name, type) {
  const res = await fetch("http://bank.com/api/deposit", {
    headers: {
      token: token,
      name: name,
      type: type,
    },
    method: "POST",
  });

  return await res.json();
}

export async function getDeposits(token) {
  const res = await fetch("http://bank.com/api/deposit", {
    headers: {
      token: token,
    },
    method: "GET",
  });

  return await res.json();
}

export async function getDeposit(token, name) {
  const res = await fetch("http://bank.com/api/deposit", {
    headers: {
      token: token,
      name: name,
    },
    method: "GET",
  });

  return await res.json();
}
