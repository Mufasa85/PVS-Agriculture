import { notFound } from "next/navigation";

import UserForm from "@/components/admin/UserForm";
import { prisma } from "@/lib/prisma";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-[26px] font-bold text-brand-900">
          Éditer « {user.name} »
        </h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Modifiez les informations et les permissions de cet utilisateur.
        </p>
      </div>
      <div className="max-w-[720px] rounded-pvs border border-line bg-white p-8 shadow-soft">
        <UserForm
          initialValues={{
            id: user.id,
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            isActive: user.isActive,
          }}
        />
      </div>
    </div>
  );
}
