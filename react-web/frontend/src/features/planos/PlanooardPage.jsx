import { useParams } from "react-router-dom";
import { LayoutList } from "lucide-react";

export function PlanoBoardPage() {
  const { planoId } = useParams();

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Quadro do plano
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Plano #{planoId} — será implementado na Etapa 3
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 dark:from-brand-400/10 dark:to-brand-600/10 flex items-center justify-center mb-6">
          <LayoutList className="w-8 h-8 text-brand-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Quadro em construção
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          As listas e cartões deste plano estarão disponíveis em breve.
        </p>
      </div>
    </div>
  );
}
