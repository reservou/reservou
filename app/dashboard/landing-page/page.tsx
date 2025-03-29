"use client";

import {
	AmenitiesForm,
	type AmenityFormRefProps,
} from "@/src/components/forms/amenities-form";
import {
	GeneralInfoForm,
	type GeneralInfoFormRefProps,
} from "@/src/components/forms/general-info-form";
import {
	LocationForm,
	type LocationFormRefProps,
} from "@/src/components/forms/location-form";
import {
	type LandingPageFormValues,
	LandingPagePreview,
} from "@/src/components/landing-page-preview";
import {
	BannerManager,
	type BannerManagerRefProps,
} from "@/src/components/managers/banner-manager";
import GalleryManager, {
	type GalleryManagerRefProps,
} from "@/src/components/managers/gallery-manager";
import { PreviewToggle } from "@/src/components/preview-toggle";
import { SaveButton } from "@/src/components/save-button";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/src/components/ui/tabs";
import { useHotel } from "@/src/hooks/use-hotel";
import { cn } from "@/src/lib/utils";
import { updateLandingPage } from "@/src/modules/hotel/actions/update-landing-page";
import { buildAddressString } from "@/src/modules/hotel/utils/build-address-string";
import React from "react";
import { toast } from "sonner";

enum EditorTabs {
	GENERAL = "general",
	GALLERY = "gallery",
}

export default function LandingPageRefactor() {
	const [isSaving, setIsSaving] = React.useState(false);
	const [isSaved, setIsSaved] = React.useState(false);
	const [previewMode, setPreviewMode] = React.useState(false);
	const [activeTab, setActiveTab] = React.useState<string>(EditorTabs.GENERAL);

	const generalInfoFormRef = React.useRef<GeneralInfoFormRefProps>(null);
	const amenitiesFormRef = React.useRef<AmenityFormRefProps>(null);
	const locationFormRef = React.useRef<LocationFormRefProps>(null);
	const galleryManagerRef = React.useRef<GalleryManagerRefProps>(null);
	const bannerManagerRef = React.useRef<BannerManagerRefProps>(null);

	const [hasEditedGeneral, setHasEditedGeneral] = React.useState(false);
	const [hasEditedAmenities, setHasEditedAmenities] = React.useState(false);
	const [hasEditedLocation, setHasEditedLocation] = React.useState(false);

	const canSave = hasEditedGeneral || hasEditedAmenities || hasEditedLocation;

	const getValues = () => {
		if (
			!generalInfoFormRef.current ||
			!locationFormRef.current ||
			!amenitiesFormRef.current ||
			!bannerManagerRef.current ||
			!galleryManagerRef.current
		) {
			throw new Error("References are null");
		}

		const { description, name, slug } = generalInfoFormRef.current.getValues();
		const location = locationFormRef.current.getValues();
		const amenities = amenitiesFormRef.current.getValues();
		const banner = bannerManagerRef.current.getBanner();
		const photos = galleryManagerRef.current.getPhotos();

		return {
			amenities,
			banner: banner ?? {
				alt: "Mocked banner",
				fileKey: "placeholder",
				url: "/placeholder.svg",
			},
			description,
			location,
			name,
			slug,
			photos,
		} satisfies LandingPageFormValues;
	};

	const { loading, error, hotel } = useHotel();

	const handleSave = async () => {
		if (
			!generalInfoFormRef.current ||
			!locationFormRef.current ||
			!amenitiesFormRef.current
		) {
			return;
		}

		const generalValid = await generalInfoFormRef.current.trigger();
		const locationValid = await locationFormRef.current.trigger();

		if (!generalValid || !locationValid) {
			return;
		}

		setIsSaving(true);

		const output = await updateLandingPage({
			...generalInfoFormRef.current.getChangedValues(),
			...locationFormRef.current.getValues(),
			amenities: amenitiesFormRef.current.getValues(),
		});
		setIsSaving(false);

		if (!output.success) {
			setIsSaving(false);
			toast.error("Não foi possível salvar as alterações");
			toast.error(output.message);
			return;
		}

		toast.success("Alterações salvas com sucesso");
		setIsSaved(false);
		setHasEditedGeneral(false);
		setHasEditedAmenities(false);
		setHasEditedLocation(false);

		generalInfoFormRef.current.reset(
			generalInfoFormRef.current.getChangedValues(),
		);
		locationFormRef.current.reset(locationFormRef.current.getValues());
		amenitiesFormRef.current.reset(amenitiesFormRef.current.getValues());
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
		<section>
			<header className="flex flex-col sm:flex-row gap-4 justify-between mb-3">
				<section className="flex flex-col sm:gap-2">
					<h1 className="text-2xl text-foreground font-semibold">
						Customize sua página inicial
					</h1>
					<p className="text-muted-foreground">
						Esse será o primeiro contato com o cliente!
					</p>
				</section>
				<section className="flex sm:flex-row flex-col gap-2">
					<PreviewToggle
						previewMode={previewMode}
						setPreviewMode={setPreviewMode}
					/>
					<SaveButton
						canSave={canSave}
						isSaved={isSaved}
						isSaving={isSaving}
						onClick={handleSave}
					/>
				</section>
			</header>

			{previewMode && (
				<LandingPagePreview
					previewMode={previewMode}
					getCurrentValues={getValues}
				/>
			)}
			<main className={cn(previewMode && "hidden")}>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="mb-2">
						<TabsTrigger key={"general-tab-trigger"} value={EditorTabs.GENERAL}>
							Informações Gerais
						</TabsTrigger>
						<TabsTrigger key={"gallery-tab-trigger"} value={EditorTabs.GALLERY}>
							Fotos
						</TabsTrigger>
					</TabsList>

					<div
						className={cn(
							"space-y-4",
							activeTab !== EditorTabs.GENERAL && "hidden",
						)}
					>
						<GeneralInfoForm
							hasEdited={hasEditedGeneral}
							setHasEdited={setHasEditedGeneral}
							initialValues={{
								description: hotel.description,
								name: hotel.name,
								slug: hotel.slug,
							}}
							ref={generalInfoFormRef}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							<LocationForm
								setHasEdited={setHasEditedLocation}
								hasEdited={hasEditedLocation}
								ref={locationFormRef}
								initialValues={hotel.location}
							/>

							<AmenitiesForm
								setHasEdited={setHasEditedAmenities}
								hasEdited={hasEditedAmenities}
								initialValues={hotel.amenities}
								ref={amenitiesFormRef}
							/>
						</div>
					</div>

					<div
						className={cn(
							"space-y-4",
							activeTab !== EditorTabs.GALLERY && "hidden",
						)}
					>
						<BannerManager
							ref={bannerManagerRef}
							initialBanner={hotel.banner}
						/>
						<GalleryManager
							ref={galleryManagerRef}
							initialPhotos={hotel.photos}
						/>
					</div>
				</Tabs>
			</main>
		</section>
	);
}
