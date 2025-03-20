"use client";

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
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/src/components/ui/tabs";
import { Textarea } from "@/src/components/ui/textarea";
import {
	ArrowRight,
	Edit,
	Eye,
	ImagePlus,
	Plus,
	Save,
	Trash2,
	X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface Photo {
	id: number;
	src: string;
	alt: string;
}

interface LandingPageData {
	hotelName: string;
	slug: string;
	description: string;
	location: string;
	bannerImage: string;
	photos: Photo[];
	amenities: string[];
}

const initialLandingPageData: LandingPageData = {
	hotelName: "Acme Luxury Resort",
	slug: "@acme-hotel",
	description:
		"Experience luxury like never before at our 5-star resort nestled in the heart of paradise. With stunning ocean views, world-class amenities, and exceptional service, Acme Luxury Resort offers the perfect getaway for those seeking relaxation and adventure.",
	location: "Coastal Paradise, Tropical Island",
	bannerImage: "/placeholder.svg?height=600&width=1200",
	photos: [
		{
			id: 1,
			src: "/placeholder.svg?height=600&width=800",
			alt: "Hotel exterior view with palm trees and ocean in background",
		},
		{
			id: 2,
			src: "/placeholder.svg?height=600&width=800",
			alt: "Luxury hotel room with king size bed and ocean view",
		},
		{
			id: 3,
			src: "/placeholder.svg?height=600&width=800",
			alt: "Hotel swimming pool surrounded by lounge chairs",
		},
		{
			id: 4,
			src: "/placeholder.svg?height=600&width=800",
			alt: "Hotel restaurant with elegant dining setup",
		},
	],
	amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym", "Beach Access"],
};

export default function LandingPageEditor() {
	const [landingPageData, setLandingPageData] = useState<LandingPageData>(
		initialLandingPageData,
	);
	const [newAmenity, setNewAmenity] = useState<string>("");
	const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [previewMode, setPreviewMode] = useState<boolean>(false);

	const handleChange = (field: keyof LandingPageData, value: string) => {
		setLandingPageData({
			...landingPageData,
			[field]: value,
		});
	};

	const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setLandingPageData({
				...landingPageData,
				bannerImage: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	const handlePhotoEdit = (photo: Photo) => {
		setEditingPhoto(photo);
	};

	const handlePhotoUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file =
			e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

		if (!file || !editingPhoto) {
			setEditingPhoto(null);
			return;
		}

		const objectUrl = URL.createObjectURL(file);

		setLandingPageData({
			...landingPageData,
			photos: landingPageData.photos.map((photo) =>
				photo.id === editingPhoto.id ? { ...photo, src: objectUrl } : photo,
			),
		});

		setEditingPhoto(null);
	};

	const handlePhotoDelete = (id: number) => {
		setLandingPageData({
			...landingPageData,
			photos: landingPageData.photos.filter((photo) => photo.id !== id),
		});
	};

	const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file =
			e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

		if (!file) {
			return;
		}

		const newId = Math.max(...landingPageData.photos.map((p) => p.id)) + 1;
		setLandingPageData({
			...landingPageData,
			photos: [
				...landingPageData.photos,
				{
					id: newId,
					src: URL.createObjectURL(file),
					alt: `New photo ${newId}`,
				},
			],
		});
	};

	const handleAddAmenity = () => {
		if (
			newAmenity.trim() &&
			!landingPageData.amenities.includes(newAmenity.trim())
		) {
			setLandingPageData({
				...landingPageData,
				amenities: [...landingPageData.amenities, newAmenity.trim()],
			});
			setNewAmenity("");
		}
	};

	const handleRemoveAmenity = (amenity: string) => {
		setLandingPageData({
			...landingPageData,
			amenities: landingPageData.amenities.filter((a) => a !== amenity),
		});
	};

	const handleSave = () => {
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
			alert("Alterações salvas com sucesso!");
		}, 1500);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">Landing Page</h1>
					<p className="text-muted-foreground">
						Personalize a página inicial do seu hotel
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-2">
					<Button
						variant="outline"
						onClick={() => setPreviewMode(!previewMode)}
					>
						{previewMode ? (
							<>
								<Edit className="mr-2 h-4 w-4" />
								Editar
							</>
						) : (
							<>
								<Eye className="mr-2 h-4 w-4" />
								Visualizar
							</>
						)}
					</Button>

					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? (
							"Salvando..."
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Salvar Alterações
							</>
						)}
					</Button>
				</div>
			</div>

			{previewMode ? (
				<PreviewMode data={landingPageData} />
			) : (
				<Tabs defaultValue="general">
					<TabsList className="mb-4">
						<TabsTrigger value="general">Informações Gerais</TabsTrigger>
						<TabsTrigger value="photos">Fotos</TabsTrigger>
						<TabsTrigger value="amenities">Comodidades</TabsTrigger>
					</TabsList>

					<TabsContent value="general" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Informações do Hotel</CardTitle>
								<CardDescription>
									Edite as informações básicas que serão exibidas na página
									inicial.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-2">
									<Label htmlFor="hotelName">Nome do Hotel</Label>
									<Input
										id="hotelName"
										value={landingPageData.hotelName}
										onChange={(e) => handleChange("hotelName", e.target.value)}
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										value={landingPageData.slug}
										onChange={(e) => handleChange("slug", e.target.value)}
									/>
									<p className="text-xs text-muted-foreground">
										O slug é usado na URL da sua página. Ex: reservou.com/
										{landingPageData.slug.replace("@", "")}
									</p>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="location">Localização</Label>
									<Input
										id="location"
										value={landingPageData.location}
										onChange={(e) => handleChange("location", e.target.value)}
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="description">Descrição</Label>
									<Textarea
										id="description"
										rows={5}
										value={landingPageData.description}
										onChange={(e) =>
											handleChange("description", e.target.value)
										}
									/>
									<p className="text-xs text-muted-foreground">
										Uma descrição atraente do seu hotel que será exibida na
										página inicial.
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Banner Principal</CardTitle>
								<CardDescription>
									Adicione uma imagem de destaque para a parte superior da sua
									página.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="relative aspect-[2/1] overflow-hidden rounded-md mb-4">
									<img
										src={landingPageData.bannerImage || "/placeholder.svg"}
										alt="Banner"
										className="object-cover w-full h-full"
									/>
								</div>

								<div className="flex items-center gap-2">
									<Label htmlFor="banner-upload" className="cursor-pointer">
										<div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20 transition-colors">
											<ImagePlus className="h-4 w-4" />
											<span>Alterar Banner</span>
										</div>
										<Input
											id="banner-upload"
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleBannerChange}
										/>
									</Label>
									<p className="text-xs text-muted-foreground">
										Recomendado: 1200 x 600 pixels
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="photos" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Galeria de Fotos</CardTitle>
								<CardDescription>
									Adicione fotos do seu hotel para exibir na página inicial.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
									{landingPageData.photos.map((photo) => (
										<div key={photo.id} className="relative group">
											<div className="relative aspect-[4/3] overflow-hidden rounded-md">
												<img
													src={photo.src || "/placeholder.svg"}
													alt={photo.alt}
													className="object-cover w-full h-full"
												/>
											</div>
											<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
												<Label
													htmlFor={`photo-edit-${photo.id}`}
													className="cursor-pointer"
												>
													<div className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
														<Edit className="h-4 w-4" />
													</div>
													<Input
														id={`photo-edit-${photo.id}`}
														type="file"
														accept="image/*"
														className="hidden"
														onChange={handlePhotoUpdate}
														onClick={() => handlePhotoEdit(photo)}
													/>
												</Label>

												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button
															variant="destructive"
															size="icon"
															className="rounded-full h-8 w-8 p-0"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Excluir Foto</AlertDialogTitle>
															<AlertDialogDescription>
																Tem certeza que deseja excluir esta foto? Esta
																ação não pode ser desfeita.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancelar</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handlePhotoDelete(photo.id)}
															>
																Excluir
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>

											<div className="mt-2">
												<Input
													value={photo.alt}
													onChange={(e) => {
														setLandingPageData({
															...landingPageData,
															photos: landingPageData.photos.map((p) =>
																p.id === photo.id
																	? { ...p, alt: e.target.value }
																	: p,
															),
														});
													}}
													placeholder="Descrição da imagem"
													className="text-sm"
												/>
											</div>
										</div>
									))}

									<Label htmlFor="add-photo" className="cursor-pointer">
										<div className="border-2 border-dashed border-muted-foreground/25 rounded-md aspect-[4/3] flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
											<ImagePlus className="h-8 w-8 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												Adicionar Foto
											</span>
										</div>
										<Input
											id="add-photo"
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleAddPhoto}
										/>
									</Label>
								</div>

								<p className="text-sm text-muted-foreground">
									Recomendado: Imagens de 800 x 600 pixels. Adicione fotos de
									alta qualidade que mostrem o melhor do seu hotel.
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="amenities" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Comodidades</CardTitle>
								<CardDescription>
									Adicione as comodidades que seu hotel oferece.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2 mb-4">
									{landingPageData.amenities.map((amenity) => (
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
												<X className="h-3 w-3" />
											</Button>
										</div>
									))}
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
										<Plus className="h-4 w-4" />
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
				</Tabs>
			)}
		</div>
	);
}

function PreviewMode({ data }: { data: LandingPageData }) {
	return (
		<div className="border rounded-lg overflow-hidden">
			<div className="p-4 bg-muted flex items-center justify-between">
				<p className="text-sm font-medium">Visualização da Página Inicial</p>
				<Button variant="outline" size="sm" asChild>
					<a href="/" target="_blank" rel="noopener noreferrer">
						Abrir em Nova Aba
						<ArrowRight className="ml-2 h-4 w-4" />
					</a>
				</Button>
			</div>

			<div className="p-6 bg-background">
				<div className="max-w-5xl mx-auto">
					<div className="relative aspect-[2/1] overflow-hidden rounded-lg mb-6">
						<img
							src={data.bannerImage || "/placeholder.svg"}
							alt="Banner"
							className="object-cover w-full h-full"
						/>
					</div>

					<div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
						<div className="flex items-center justify-center bg-primary/10 rounded-full p-3">
							<svg
								className="h-8 w-8 text-primary"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"
									fill="currentColor"
								/>
							</svg>
						</div>
						<div className="space-y-1">
							<div className="flex flex-col md:flex-row md:items-center gap-2">
								<h1 className="text-2xl md:text-3xl font-bold">
									{data.hotelName}
								</h1>
								<div className="px-2 py-0.5 border rounded-full text-sm text-muted-foreground w-fit">
									{data.slug}
								</div>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
										fill="currentColor"
									/>
								</svg>
								<span className="text-sm">{data.location}</span>
							</div>
						</div>
					</div>

					<div className="space-y-6 mb-6">
						<div>
							<h2 className="text-xl font-semibold mb-2">Sobre</h2>
							<p className="text-muted-foreground">{data.description}</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-3">Comodidades</h2>
							<div className="flex flex-wrap gap-2">
								{data.amenities.map((amenity) => (
									<div
										key={amenity}
										className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
									>
										{amenity}
									</div>
								))}
							</div>
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-3">Fotos</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{data.photos.map((photo) => (
									<div
										key={photo.id}
										className="relative aspect-[4/3] overflow-hidden rounded-lg"
									>
										<img
											src={photo.src || "/placeholder.svg"}
											alt={photo.alt}
											className="object-cover w-full h-full"
										/>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
						<div className="text-center sm:text-left">
							<p className="text-sm text-muted-foreground">
								Ready to experience luxury?
							</p>
							<p className="font-semibold">Book your stay now!</p>
						</div>
						<Button className="w-full sm:w-auto gap-2">
							<svg
								className="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"
									fill="currentColor"
								/>
							</svg>
							Reserve Now
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
