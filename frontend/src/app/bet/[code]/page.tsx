"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { Check, Copy, Grid, List } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useAuth } from "~/features/auth/contexts/AuthProvider";
import BetForm from "~/features/bet/components/BetForm";
import EndBetForm from "~/features/bet/components/EndBetForm";
// import BetTable from "~/features/bet/components/BetTable";
import useBetDetails from "~/features/bet/hooks/useBetDetails";
import useCopy from "~/hooks/useCopy";
import { cn } from "~/lib/utils";

export default function BetDetails({ params }: { params: { code: string } }) {
  const [view, setView] = useState<"grid" | "list">("list");
  const [isCopied, copy] = useCopy();

  const { data, isLoading, isError } = useBetDetails(params.code);
  const { user } = useAuth();

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur</div>;

  const vote = data?.user_bets.find(bet => bet.user === user?.id);
  const hasVoted = !!vote;

  return (
    <div className="container">
      <div className="mt-8">
        <h1 className="text-2xl font-bold">{data?.name}</h1>
        <span>{data?.is_ended ? "Le pari est terminé" : "En cours"}</span>
      </div>

      <Button
        variant="outline"
        onClick={async () => copy(params.code)}
        className="relative rounded-lg px-16 py-8 text-xl font-bold"
      >
        {params.code}

        {isCopied ? (
          <Check className="absolute right-2 top-2" size={16} />
        ) : (
          <Copy className="absolute right-2 top-2" size={16} />
        )}
      </Button>

      <div className="mt-8 flex flex-col">
        <div className="grid grid-cols-4 gap-8">
          {/* Options card */}
          <div className="col-span-3 flex w-full flex-col rounded-xl border border-border bg-zinc-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>{hasVoted ? "Vous avez déjà voté" : "Vous n'avez pas encore voté"}</span>

              <div className="flex flex-wrap items-center gap-2">
                {/* End bet */}
                {!!data && data.author === user?.id && (
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Terminer le pari</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <EndBetForm
                          options={data.options.map(option => ({
                            id: option.id,
                            text: option.text,
                          }))}
                          signupCode={data.signup_code}
                          code={params.code}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {/* View actions (grid/list) */}
                <div className="inline-flex items-center gap-0.5 self-end justify-self-end rounded-xl border border-border bg-zinc-50 p-1">
                  <Button
                    aria-label="Vue en grille"
                    className="rounded-lg"
                    onClick={() => setView("grid")}
                    variant={view === "grid" ? "outline" : "ghost"}
                  >
                    <Grid />
                  </Button>
                  <Button
                    aria-label="Vue en liste"
                    className="rounded-lg"
                    variant={view === "list" ? "outline" : "ghost"}
                    onClick={() => setView("list")}
                  >
                    <List />
                  </Button>
                </div>
              </div>
            </div>

            {/* Options list */}
            <div
              className={cn(
                "mt-4 gap-1",
                view === "grid" && "grid grid-cols-2",
                view === "list" && "flex flex-col",
              )}
            >
              {data?.options.map(option => (
                <div
                  data-disabled={hasVoted}
                  data-voted={!!hasVoted && vote.option === option.id}
                  className="group flex items-center justify-between rounded-xl border border-border px-4 py-2 hover:bg-background data-[voted=true]:bg-green-200/20"
                  key={option.id}
                >
                  <span className="inline-flex items-center gap-1 font-semibold">
                    {option.text}
                    {!!hasVoted && vote.option === option.id && (
                      <Check className="text-emerald-800" />
                    )}
                  </span>

                  <div className="flex items-center gap-8">
                    <span>
                      {option.number_of_bets} vote{option.number_of_bets > 1 && "s"}
                    </span>
                    <span>{option.total_amount}</span>

                    <Dialog key={option.id.toString()}>
                      <DialogTrigger asChild>
                        <Button
                          disabled={hasVoted}
                          className="[disabled=true]:cursor-not-allowed"
                          variant="outline"
                        >
                          Parier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <BetForm
                          code={params.code}
                          betId={data.id}
                          name={data.name}
                          id={data.id}
                          optionId={option.id}
                          optionName={option.text}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="flex flex-col rounded-xl border border-border bg-zinc-50 p-4">
            {/* list of users sorted by amount */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Classement</h2>
              {data?.user_bets
                .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
                .map(bet => (
                  <div
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-2"
                    key={bet.user}
                  >
                    <span>{bet.user_username}</span>
                    <span>{bet.amount}€</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* <BetTable array={[{ name: "jar", odds: "" }]} /> */}
    </div>
  );
}
