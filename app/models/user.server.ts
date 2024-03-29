import type { Users, Signs } from "@prisma/client";

import { prisma } from "~/servers/db.server";

export async function getUserById(id: Users["id"]) {
  return prisma.users.findUnique({ where: { id } });
}

export async function getUserByEmail(email: Users["email"]) {
  return prisma.users.findUnique({ where: { email } });
}

export async function createUser(email: Users["email"], idProviderUserId: Users["idProviderUserId"]) {
  return prisma.users.create({
    data: {
      email,
      idProviderUserId
    },
  });
}

export async function deleteUserByEmail(email: Users["email"]) {
  return prisma.users.delete({ where: { email } });
}

/*
export async function verifyLogin(
  email: User["email"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
*/