import { Badge } from "@/src/components/ui/badge";

import {
	Bed,
	CalendarClock,
	ChevronRight,
	Ticket,
	User,
	Wallet,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";

export default function DashboardPage() {
	return (
		<main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-8">
			<div className="max-w-7xl mx-auto space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">Dashboard</h1>
						<p className="text-muted-foreground">
							Gerencie seu hotel e reservas
						</p>
					</div>
					<Button>
						<ChevronRight className="mr-2 h-4 w-4" />
						Ver Site
					</Button>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					<Card className="p-6">
						<div className="flex items-center gap-4">
							<div className="bg-primary/10 p-3 rounded-full">
								<Bed className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Quartos</p>
								<p className="text-2xl font-bold">12</p>
							</div>
						</div>
					</Card>

					<Card className="p-6">
						<div className="flex items-center gap-4">
							<div className="bg-primary/10 p-3 rounded-full">
								<CalendarClock className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Reservas Ativas</p>
								<p className="text-2xl font-bold">8</p>
							</div>
						</div>
					</Card>

					<Card className="p-6">
						<div className="flex items-center gap-4">
							<div className="bg-primary/10 p-3 rounded-full">
								<Wallet className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Saldo</p>
								<p className="text-2xl font-bold">R$ 4.250,00</p>
							</div>
						</div>
					</Card>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-4">Reservas Recentes</h2>
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="bg-muted p-2 rounded-full">
											<User className="h-4 w-4" />
										</div>
										<div>
											<p className="font-medium">Cliente {i}</p>
											<p className="text-xs text-muted-foreground">
												Quarto Deluxe • 3 noites
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-medium">R$ {(i * 500).toFixed(2)}</p>
										<p className="text-xs text-muted-foreground">
											Check-in: 15/0{i}/2024
										</p>
									</div>
								</div>
							))}
						</div>
						<Separator className="my-4" />
						<Button variant="outline" className="w-full">
							Ver Todas
						</Button>
					</Card>

					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-4">Tickets Recentes</h2>
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="bg-muted p-2 rounded-full">
											<Ticket className="h-4 w-4" />
										</div>
										<div>
											<p className="font-medium">Ticket #{1000 + i}</p>
											<p className="text-xs text-muted-foreground">
												{i === 1
													? "Problema com pagamento"
													: i === 2
														? "Solicitação de cancelamento"
														: "Dúvida sobre check-in"}
											</p>
										</div>
									</div>
									<Badge
										variant={
											i === 1 ? "default" : i === 2 ? "destructive" : "outline"
										}
										className="text-xs"
									>
										{i === 1 ? "Novo" : i === 2 ? "Urgente" : "Resolvido"}
									</Badge>
								</div>
							))}
						</div>
						<Separator className="my-4" />
						<Button variant="outline" className="w-full">
							Ver Todos
						</Button>
					</Card>
				</div>
			</div>
		</main>
	);
}
