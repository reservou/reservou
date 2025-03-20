"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowRight,
	Building2,
	Check,
	Globe,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";

import { hotelSetup } from "@/src/actions/hotel-setup";
import { useAction } from "@/src/hooks/use-action";
import {
	type BasicInfoFormValues,
	type ContactFormValues,
	type HotelSetupFormValues,
	type LocationFormValues,
	basicInfoSchema,
	contactSchema,
	hotelSetupSchema,
	locationSchema,
} from "@/src/schemas/hotel-setup-schema";

const hotelCategories = [
	{ id: "hotel", name: "Hotel" },
	{ id: "resort", name: "Resort" },
	{ id: "inn", name: "Pousada" },
	{ id: "hostel", name: "Hostel" },
	{ id: "apartment", name: "Apartamento" },
	{ id: "other", name: "Outro" },
];

export default function SetupPage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<HotelSetupFormValues>({
		name: "",
		category: "",
		description: "",
		address: "",
		city: "",
		state: "",
		country: "",
		zipCode: "",
		email: "",
		phone: "",
		website: "",
	});

	const basicInfoForm = useForm<BasicInfoFormValues>({
		resolver: zodResolver(basicInfoSchema),
		defaultValues: {
			name: formData.name,
			category: formData.category,
			description: formData.description,
		},
	});

	const locationForm = useForm<LocationFormValues>({
		resolver: zodResolver(locationSchema),
		defaultValues: {
			address: formData.address,
			city: formData.city,
			state: formData.state,
			country: formData.country,
			zipCode: formData.zipCode,
		},
	});

	const contactForm = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			email: formData.email,
			phone: formData.phone,
			website: formData.website,
		},
	});

	const { execute: executeHotelSetup, isLoading: isHotelSetupLoading } =
		useAction(hotelSetup, {
			showSuccessToast: true,
			showErrorToast: true,
			successMessage: "Hotel configurado com sucesso!",
			onSuccess: () => router.push("/dashboard"),
		});

	const onBasicInfoSubmit = (data: BasicInfoFormValues) => {
		setFormData({ ...formData, ...data });
		setCurrentStep(2);
	};

	const onLocationSubmit = (data: LocationFormValues) => {
		setFormData({ ...formData, ...data });
		setCurrentStep(3);
	};

	const onContactSubmit = async (data: ContactFormValues) => {
		const completeFormData = { ...formData, ...data };
		setFormData(completeFormData);
		setIsSubmitting(true);

		try {
			hotelSetupSchema.parse(completeFormData);

			const response = await executeHotelSetup(completeFormData);

			if (!response.success) {
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error("Validation error:", error);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
			<Card className="w-full max-w-3xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">
						Configure seu hotel no Reservou
					</CardTitle>
					<CardDescription>
						Preencha as informações abaixo para começar a receber reservas
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-8">
						<div className="flex justify-between">
							{[1, 2, 3].map((step) => (
								<div key={step} className="flex w-1/4 flex-col items-center">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${
											step < currentStep
												? "bg-primary text-primary-foreground"
												: step === currentStep
													? "bg-primary/20 text-primary border-2 border-primary"
													: "bg-muted text-muted-foreground"
										}`}
									>
										{step < currentStep ? <Check className="h-5 w-5" /> : step}
									</div>
									<span
										className={`text-xs mt-2 ${step <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
									>
										{step === 1
											? "Informações Básicas"
											: step === 2
												? "Localização"
												: "Contato"}
									</span>
								</div>
							))}
						</div>
						<div className="relative mt-2">
							<div className="absolute top-0 h-1 w-full bg-muted rounded-full" />
							<div
								className="absolute top-0 h-1 bg-primary rounded-full transition-all duration-300"
								style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
							/>
						</div>
					</div>

					{/* Step 1: Basic Information */}
					{currentStep === 1 && (
						<Form {...basicInfoForm}>
							<form
								onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)}
								className="space-y-4"
							>
								<FormField
									control={basicInfoForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome do Hotel</FormLabel>
											<FormControl>
												<div className="flex items-center gap-2">
													<Building2 className="h-4 w-4 text-muted-foreground" />
													<Input placeholder="Ex: Hotel Paraíso" {...field} />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={basicInfoForm.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Categoria</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Selecione uma categoria" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{hotelCategories.map((category) => (
														<SelectItem key={category.id} value={category.id}>
															{category.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={basicInfoForm.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Descrição</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Descreva seu hotel em poucas palavras..."
													rows={4}
													{...field}
												/>
											</FormControl>
											<FormMessage />
											<p className="text-xs text-muted-foreground">
												Uma breve descrição do seu hotel que será exibida na
												página inicial.
											</p>
										</FormItem>
									)}
								/>

								<div className="pt-4 flex justify-end">
									<Button type="submit">
										Próximo
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</div>
							</form>
						</Form>
					)}

					{/* Step 2: Location */}
					{currentStep === 2 && (
						<Form {...locationForm}>
							<form
								onSubmit={locationForm.handleSubmit(onLocationSubmit)}
								className="space-y-4"
							>
								<FormField
									control={locationForm.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Endereço</FormLabel>
											<FormControl>
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4 text-muted-foreground" />
													<Input
														placeholder="Ex: Av. Beira Mar, 1000"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={locationForm.control}
										name="city"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Cidade</FormLabel>
												<FormControl>
													<Input placeholder="Ex: Rio de Janeiro" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={locationForm.control}
										name="state"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Estado</FormLabel>
												<FormControl>
													<Input placeholder="Ex: RJ" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={locationForm.control}
										name="country"
										render={({ field }) => (
											<FormItem>
												<FormLabel>País</FormLabel>
												<FormControl>
													<Input placeholder="Ex: Brasil" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={locationForm.control}
										name="zipCode"
										render={({ field }) => (
											<FormItem>
												<FormLabel>CEP</FormLabel>
												<FormControl>
													<Input placeholder="Ex: 22000-000" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="pt-4 flex justify-between">
									<Button
										type="button"
										variant="outline"
										onClick={() => setCurrentStep(1)}
									>
										Voltar
									</Button>
									<Button type="submit">
										Próximo
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</div>
							</form>
						</Form>
					)}

					{/* Step 3: Contact */}
					{currentStep === 3 && (
						<Form {...contactForm}>
							<form
								onSubmit={contactForm.handleSubmit(onContactSubmit)}
								className="space-y-4"
							>
								<FormField
									control={contactForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<div className="flex items-center gap-2">
													<Mail className="h-4 w-4 text-muted-foreground" />
													<Input
														placeholder="Ex: contato@seuhotel.com"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={contactForm.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Telefone</FormLabel>
											<FormControl>
												<div className="flex items-center gap-2">
													<Phone className="h-4 w-4 text-muted-foreground" />
													<Input placeholder="Ex: (21) 99999-9999" {...field} />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={contactForm.control}
									name="website"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Website (opcional)</FormLabel>
											<FormControl>
												<div className="flex items-center gap-2">
													<Globe className="h-4 w-4 text-muted-foreground" />
													<Input
														placeholder="Ex: https://www.seuhotel.com"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="bg-muted/50 p-4 rounded-lg mt-6">
									<h3 className="font-medium mb-2">Resumo das informações</h3>
									<div className="grid grid-cols-2 gap-2 text-sm">
										<div>
											<p className="text-muted-foreground">Nome:</p>
											<p>{formData.name}</p>
										</div>
										<div>
											<p className="text-muted-foreground">Categoria:</p>
											<p>
												{hotelCategories.find((c) => c.id === formData.category)
													?.name || formData.category}
											</p>
										</div>
										<div className="col-span-2">
											<p className="text-muted-foreground">Endereço:</p>
											<p>{`${formData.address}, ${formData.city} - ${formData.state}, ${formData.country}`}</p>
										</div>
										<div>
											<p className="text-muted-foreground">Email:</p>
											<p>{formData.email || contactForm.getValues().email}</p>
										</div>
										<div>
											<p className="text-muted-foreground">Telefone:</p>
											<p>{formData.phone || contactForm.getValues().phone}</p>
										</div>
									</div>
								</div>

								<div className="pt-4 flex justify-between">
									<Button
										type="button"
										variant="outline"
										onClick={() => setCurrentStep(2)}
									>
										Voltar
									</Button>
									<Button
										type="submit"
										disabled={isSubmitting || isHotelSetupLoading}
									>
										{isSubmitting || isHotelSetupLoading
											? "Configurando..."
											: "Concluir Configuração"}
									</Button>
								</div>
							</form>
						</Form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
