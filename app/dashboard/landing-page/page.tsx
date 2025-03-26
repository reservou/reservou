"use client";

import { Loading } from "@/src/components/animations/loading";
import { LandingPagePreview } from "@/src/components/landing-page-preview";
import { Photo } from "@/src/components/photo";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
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
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/src/components/ui/tabs";
import { Textarea } from "@/src/components/ui/textarea";
import { useGallery } from "@/src/hooks/use-gallery";
import { useHotel } from "@/src/hooks/use-hotel";
import { MAX_PHOTOS_NUM } from "@/src/modules/gallery/constants";
import { updateBanner } from "@/src/modules/hotel/actions/update-banner";
import { updateHotelGeneralInfo } from "@/src/modules/hotel/actions/update-general-info";
import { updateHotelAmenities } from "@/src/modules/hotel/actions/update-hotel-amenities";
import { updateHotelLocation } from "@/src/modules/hotel/actions/update-location";
import { MAX_AMENITIES } from "@/src/modules/hotel/constants";
import { locationSchema } from "@/src/modules/hotel/schemas/hotel-setup-schema";
import { generalInfoSchema } from "@/src/modules/hotel/schemas/landing-page-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	CheckIcon,
	EditIcon,
	EyeIcon,
	ImagePlusIcon,
	PencilIcon,
	PlusIcon,
	SaveIcon,
	TrashIcon,
	XIcon,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { GeneralInfo, LocationInfo } from "./types";

export default function LandingPageEditor() {
	const [hasEditedGeneralInfo, setHasEditedGeneralInfo] = React.useState(false);
	const [hasEditedLocationInfo, setHasEditedLocationInfo] =
		React.useState(false);
	const [hasEditedAmenities, setHasEditedAmenities] = React.useState(false);
	const [hasEditedBanner, setHasEditedBanner] = React.useState(false);
	const [previewMode, setPreviewMode] = React.useState(false);
	const [generalInfo, setGeneralInfo] = React.useState<GeneralInfo>({
		name: "",
		description: "",
		slug: "",
	});
	const [locationInfo, setLocationInfo] = React.useState<LocationInfo>({
		address: "",
		city: "",
		state: "",
		country: "",
		zipCode: "",
	});
	const [amenities, setAmenities] = React.useState<string[]>([]);
	const [newAmenity, setNewAmenity] = React.useState("");
	const [isSaved, setIsSaved] = React.useState(false);
	const [isSaving, setIsSaving] = React.useState(false);
	const [banner, setBanner] = React.useState<{
		url: string;
		file: File | null;
	}>({
		file: null,
		url: "/placeholder.svg",
	});
	const {
		photos,
		canUpload,
		handleAddPhoto,
		handleDeletePhoto,
		handleEditPhoto,
		handleSave: handleSaveGallery,
		isLoading,
		isSaved: hasSavedGallery,
		isSaving: isSavingGallery,
		hasChanged: hasEditedGallery,
	} = useGallery();
	const { error, hotel, loading } = useHotel();

	React.useEffect(() => {
		if (hotel) {
			setGeneralInfo({
				description: hotel.description,
				name: hotel.name,
				slug: hotel.slug,
			});

			setLocationInfo({
				address: hotel.formattedAddress,
				city: hotel.location.city,
				state: hotel.location.state,
				country: hotel.location.country,
				zipCode: hotel.location.zipCode,
			});

			setBanner({
				file: null,
				url: hotel.bannerUrl,
			});

			setAmenities(hotel.amenities);
		}
	}, [hotel]);

	const generalInfoForm = useForm({
		resolver: zodResolver(generalInfoSchema),
		values: generalInfo,
	});

	const locationForm = useForm({
		resolver: zodResolver(locationSchema),
		values: {
			address: locationInfo.address,
			city: locationInfo.city,
			state: locationInfo.state,
			country: locationInfo.country,
			zipCode: locationInfo.zipCode ?? "",
		},
	});

	const handleSaveAmenitites = async () => {
		const output = await updateHotelAmenities(amenities);

		if (output.success) {
			setHasEditedAmenities(false);
			return;
		}

		toast.error(output.message);
	};

	const handleChangeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setBanner({
				url,
				file,
			});
			setHasEditedBanner(true);
		}
	};

	const handleSaveBanner = async () => {
		if (banner.file) {
			const output = await updateBanner(banner.file);
			if (output.success) {
				return setHasEditedBanner(false);
			}

			toast.error(output.message);
		}
	};

	const handleAddAmenity = () => {
		const currentAmenities = new Set(amenities);
		if (newAmenity === "") {
			return;
		}

		if (currentAmenities.size >= MAX_AMENITIES) {
			return toast.error(
				`Vocẽ só pode adicionar até ${MAX_AMENITIES} comodidades`,
			);
		}
		currentAmenities.add(newAmenity);

		setAmenities([...currentAmenities]);
		setNewAmenity("");
		setHasEditedAmenities(true);
	};

	const handleRemoveAmenity = (amenityToDelete: string) => {
		setAmenities([
			...amenities.filter((amenity) => amenity !== amenityToDelete),
		]);
		setHasEditedAmenities(true);
	};

	const handleSaveGeneralInfo = async () => {
		const output = await updateHotelGeneralInfo(generalInfoForm.getValues());
		if (output.success) {
			toast.success("Informações gerais salvas com sucesso");
			setIsSaved(true);
			setHasEditedGeneralInfo(false);
			setTimeout(() => setIsSaved(false), 3000);
			return;
		}

		toast.error(output.message);
	};

	const handleSaveLocationInfo = async () => {
		const output = await updateHotelLocation(locationForm.getValues());
		if (output.success) {
			toast.success("Localização atualizada com sucesso");
			setIsSaved(true);
			setHasEditedLocationInfo(false);
			setTimeout(() => setIsSaved(false), 3000);
			return;
		}

		toast.error(output.message);
	};

	async function handleSave() {
		setIsSaving(true);
		const [generalInfoIsValid, locationInfoIsValid] = await Promise.all([
			generalInfoForm.trigger(),
			locationForm.trigger(),
		]);

		if (!generalInfoIsValid || !locationInfoIsValid) {
			setIsSaving(false);
			return;
		}

		const promises = [];

		if (hasEditedGeneralInfo) {
			promises.push(handleSaveGeneralInfo());
		}

		if (hasEditedLocationInfo) {
			promises.push(handleSaveLocationInfo());
		}

		if (hasEditedGallery) {
			promises.push(handleSaveGallery());
		}

		if (hasEditedAmenities) {
			promises.push(handleSaveAmenitites());
		}

		if (hasEditedBanner) {
			promises.push(handleSaveBanner());
		}

		await Promise.all(promises);
		setIsSaving(false);
	}

	const PreviewToggle = () => {
		if (previewMode) {
			return (
				<Button variant={"outline"} onClick={() => setPreviewMode(false)}>
					<EditIcon />
					<span>Voltar para edição</span>
				</Button>
			);
		}

		return (
			<Button variant={"outline"} onClick={() => setPreviewMode(true)}>
				<EyeIcon />
				<span>Visualizar página</span>
			</Button>
		);
	};

	const SaveButton = () => {
		const canSave =
			hasEditedGeneralInfo ||
			hasEditedLocationInfo ||
			hasEditedBanner ||
			hasEditedGallery ||
			hasEditedAmenities;

		return isSaving || isSavingGallery ? (
			<Button disabled variant="outline">
				<Loading /> Salvando...
			</Button>
		) : isSaved || hasSavedGallery ? (
			<Button variant="outline" disabled>
				<CheckIcon className="w-5 h-5 mr-2" /> Salvo
			</Button>
		) : (
			<Button disabled={!canSave} variant="default" onClick={handleSave}>
				<SaveIcon className="w-5 h-5 mr-2" /> Salvar alterações
			</Button>
		);
	};

	if (loading) {
		return <Skeleton className="w-full h-full rounded" />;
	}

	if (error) {
		return <p className="text-destructive-foreground">{error}</p>;
	}

	if (!hotel) {
		return (
			<p className="text-destructive-foreground">
				Não foi possível encontrar o hotel
			</p>
		);
	}

	return (
		<section className="space-y-4">
			<header className="flex flex-col sm:flex-row gap-4 justify-between">
				<section className="flex flex-col sm:gap-2">
					<h1 className="text-2xl text-foreground font-semibold">
						Customize sua página inicial
					</h1>
					<p className="text-muted-foreground">
						Esse será o primeiro contato com o cliente!
					</p>
				</section>
				<section className="flex sm:flex-row flex-col gap-2">
					<PreviewToggle />
					<SaveButton />
				</section>
			</header>

			<main>
				{previewMode ? (
					<LandingPagePreview
						amenities={amenities}
						gallery={photos}
						generalInfo={generalInfo}
						locationInfo={locationInfo}
						banner={banner}
					/>
				) : (
					<Tabs defaultValue={"general"}>
						<TabsList>
							<TabsTrigger key={"general-tab-trigger"} value={"general"}>
								Informações Gerais
							</TabsTrigger>
							<TabsTrigger key={"location-tab-trigger"} value={"location"}>
								Localização
							</TabsTrigger>
							<TabsTrigger key={"gallery-tab-trigger"} value={"gallery"}>
								Fotos
							</TabsTrigger>
						</TabsList>

						<TabsContent className="space-y-4" value={"general"}>
							<Card>
								<CardHeader>
									<CardTitle>Informações Gerais</CardTitle>
									<CardDescription>
										Adicione informações gerais sobre o seu hotel, como nome,
										descrição e localização.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Form {...generalInfoForm}>
										<form
											className="space-y-4"
											onChange={() =>
												!hasEditedGeneralInfo && setHasEditedGeneralInfo(true)
											}
										>
											<FormField
												control={generalInfoForm.control}
												name="name"
												render={({ field }) => {
													return (
														<FormItem>
															<Label htmlFor="name">Nome do hotel</Label>
															<FormControl>
																<Input id="name" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													);
												}}
											/>

											<FormField
												control={generalInfoForm.control}
												name="slug"
												render={({ field }) => (
													<FormItem>
														<Label htmlFor="slug">Slug</Label>
														<FormControl>
															<Input id="slug" {...field} />
														</FormControl>
														<p className="text-xs text-muted-foreground">
															O slug é usado na URL da sua página. Ex:
															reservou.com/
															{generalInfo.slug.replace("@", "")}
														</p>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={generalInfoForm.control}
												name="description"
												render={({ field }) => (
													<FormItem>
														<Label htmlFor="description">Descrição</Label>
														<FormControl>
															<Textarea id="description" rows={5} {...field} />
														</FormControl>
														<p className="text-xs text-muted-foreground">
															Uma descrição atraente do seu hotel que será
															exibida na página inicial.
														</p>
														<FormMessage />
													</FormItem>
												)}
											/>
										</form>
									</Form>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Comodidades</CardTitle>
									<CardDescription>
										Adicione as comodidades que seu hotel oferece.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-2 mb-4">
										{amenities.length === 0 ? (
											<p className="text-xs text-muted-foreground">
												Parece que você não tem comodidades registradas ainda
											</p>
										) : (
											amenities.map((amenity) => (
												<div
													key={amenity}
													className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
												>
													<span>{amenity}</span>
													<Button
														variant="ghost"
														size="icon"
														className="h-5 w-5 rounded-full p-0 hover:bg-destructive/10 hover:text-destructive"
														onClick={() => handleRemoveAmenity(amenity)}
													>
														<XIcon className="h-3 w-3" />
													</Button>
												</div>
											))
										)}
									</div>

									<div className="flex gap-2">
										<Input
											placeholder="Nova comodidade"
											value={newAmenity}
											onChange={(e) => setNewAmenity(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleAddAmenity();
												}
											}}
										/>
										<Button onClick={handleAddAmenity}>
											<PlusIcon className="h-4 w-4" />
										</Button>
									</div>

									<p className="text-sm text-muted-foreground mt-4">
										Adicione comodidades como Wi-Fi, piscina, academia,
										restaurante, etc. Estas comodidades serão exibidas na página
										inicial do seu hotel.
									</p>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value={"location"}>
							<Card>
								<CardHeader>
									<CardTitle> Localização</CardTitle>
									<CardDescription>
										Adicione a localização do seu hotel.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Form {...locationForm}>
										<form
											onChange={() => setHasEditedLocationInfo(true)}
											className="space-y-4"
										>
											<FormField
												control={locationForm.control}
												name="address"
												render={({ field }) => (
													<FormItem>
														<Label htmlFor="address">Endereço</Label>
														<FormControl>
															<Input id="address" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={locationForm.control}
												name="city"
												render={({ field }) => (
													<FormItem>
														<Label htmlFor="city">Cidade</Label>
														<FormControl>
															<Input id="city" {...field} />
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
														<Label htmlFor="state">Estado</Label>
														<FormControl>
															<Input id="state" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={locationForm.control}
												name="country"
												render={({ field }) => (
													<FormItem>
														<Label htmlFor="country">País</Label>
														<FormControl>
															<Input id="country" {...field} />
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
														<Label htmlFor="zipCode">CEP</Label>
														<FormControl>
															<Input id="zipCode" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</form>
									</Form>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent className="space-y-4" value={"gallery"}>
							<Card>
								<CardHeader>
									<CardTitle>Banner Principal</CardTitle>
									<CardDescription>
										Adicione uma imagem de destaque para a parte superior da sua
										página.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Photo
										className="aspect-[2/1] mb-4"
										photo={{
											alt: `${hotel.name}'s banner`,
											url: banner.url,
										}}
									/>

									<div className="flex items-center gap-2">
										<Label htmlFor="banner-upload" className="cursor-pointer">
											<div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20 transition-colors">
												<ImagePlusIcon className="h-4 w-4" />
												<span>Alterar Banner</span>
											</div>
											<Input
												id="banner-upload"
												type="file"
												accept="image/*"
												className="hidden"
												onChange={handleChangeBanner}
											/>
										</Label>
										<p className="text-xs text-muted-foreground">
											Recomendado: 1200 x 600 pixels
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Fotos</CardTitle>
									<CardDescription>
										Adicione fotos do seu hotel para exibir na página inicial.
									</CardDescription>
								</CardHeader>

								<CardContent>
									<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
										{isLoading
											? Array.from({ length: MAX_PHOTOS_NUM }).map(
													(_, index) => (
														<Skeleton
															// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
															key={index}
															className="aspect-[4/3] rounded-md"
														/>
													),
												)
											: [
													...photos.filter(
														(photo) =>
															!photo.fromServer ||
															(photo.fromServer && !photo.hasBeenDeleted),
													),
												].map((photo, index) => (
													<figure
														// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
														key={index}
														className="relative group"
													>
														<Photo photo={photo} />
														<figcaption className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
															<Label
																htmlFor={`photo-edit-${index}`}
																className="cursor-pointer"
															>
																<div className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
																	<PencilIcon className="h-4 w-4" />
																</div>
																<Input
																	id={`photo-edit-${index}`}
																	type="file"
																	accept="image/*"
																	className="hidden"
																	onChange={(e) => handleEditPhoto(photo.id, e)}
																/>
															</Label>
															<AlertDialog>
																<AlertDialogTrigger asChild>
																	<Button
																		variant="destructive"
																		size="icon"
																		className="rounded-full h-8 w-8 p-0"
																	>
																		<TrashIcon className="h-4 w-4" />
																	</Button>
																</AlertDialogTrigger>
																<AlertDialogContent>
																	<AlertDialogHeader>
																		<AlertDialogTitle>
																			Excluir Foto
																		</AlertDialogTitle>
																		<AlertDialogDescription>
																			Tem certeza que deseja excluir esta foto?
																			Esta ação não pode ser desfeita.
																		</AlertDialogDescription>
																	</AlertDialogHeader>
																	<AlertDialogFooter>
																		<AlertDialogCancel>
																			Cancelar
																		</AlertDialogCancel>
																		<AlertDialogAction
																			onClick={() =>
																				handleDeletePhoto(photo.id)
																			}
																		>
																			Excluir
																		</AlertDialogAction>
																	</AlertDialogFooter>
																</AlertDialogContent>
															</AlertDialog>
														</figcaption>
													</figure>
												))}
										{canUpload && (
											<Label
												htmlFor="add-photo"
												className="cursor-pointer border-2 border-dashed border-muted-foreground/25 rounded-md aspect-[4/3] flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
											>
												<ImagePlusIcon className="h-8 w-8 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">
													Adicionar Foto
												</span>
												<Input
													id="add-photo"
													type="file"
													accept="image/*"
													className="hidden"
													onChange={handleAddPhoto}
												/>
											</Label>
										)}
									</section>

									<p className="text-sm text-muted-foreground">
										Recomendado: Imagens de 800 x 600 pixels. Adicione fotos de
										alta qualidade que mostrem o melhor do seu hotel.
									</p>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				)}
			</main>
		</section>
	);
}
