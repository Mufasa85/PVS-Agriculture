import UserForm from "@/components/admin/UserForm";

export default function NewUserPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-[26px] font-bold text-brand-900">
          Nouvel utilisateur
        </h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Ajoutez un nouveau membre à l'équipe d'administration.
        </p>
      </div>
      <div className="max-w-[720px] rounded-pvs border border-line bg-white p-8 shadow-soft">
        <UserForm />
      </div>
    </div>
  );
}
