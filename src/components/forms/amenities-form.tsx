"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ResetButton } from "../reset-button";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const amenityFormSchema = z.object({
	amenity: z
		.string()
		.min(2, {
			message: "O nome da comodidade deve ter pelo menos 2 caracteres",
		})
		.max(30, {
			message: "O nome da comodidade não pode exceder 30 caracteres",
		}),
});

const amenitiesSchema = z.array(amenityFormSchema);

export type AmenityFormValues = string[];

export type AmenityFormRefProps = {
	getValues: () => AmenityFormValues;
	reset: (values?: AmenityFormValues) => void;
	hasEdited: () => boolean;
} | null;

export type AmenityFormProps = {
	ref: React.RefObject<AmenityFormRefProps>;
	initialValues: AmenityFormValues;
	setHasEdited: React.Dispatch<React.SetStateAction<boolean>>;
	hasEdited: boolean;
};

export function AmenitiesForm({
	ref,
	initialValues,
	setHasEdited,
	hasEdited,
}: AmenityFormProps) {
	const [amenities, setAmenities] = React.useState(initialValues);

	const exampleAmenities = [
		"Café da manhã",
		"Cama King",
		"TV",
		"Banheira",
		"Vista pro mar",
	];

	const form = useForm({
		resolver: zodResolver(amenityFormSchema),
		defaultValues: {
			amenity: "",
		},
	});

	const handleAddAmenity = () => {
		const amenitiesSet = new Set(amenities);
		const lengthBefore = amenitiesSet.size;
		amenitiesSet.add(form.getValues().amenity);
		const lengthAfter = amenitiesSet.size;

		if (lengthBefore !== lengthAfter) {
			setAmenities(Array.from(amenitiesSet));
			form.reset();
			setHasEdited(true);
			return;
		}

		form.setError("amenity", { message: "Comodidade já adicionada" });
		form.reset();
	};

	const handleRemoveAmenity = (amenity: string) => {
		const lengthBefore = amenities.length;
		const filteredAmenities = amenities.filter((item) => item !== amenity);

		setAmenities(filteredAmenities);

		const lengthAfter = filteredAmenities.length;

		if (lengthBefore !== lengthAfter) {
			setHasEdited(true);
		}
	};

	const handleReset = (values?: AmenityFormValues) => {
		setAmenities([...initialValues]);
		setHasEdited(false);
		form.clearErrors();
		if (values) {
			setAmenities(values);
		}
	};

	React.useImperativeHandle(ref, () => ({
		getValues: () => amenities,
		hasEdited: () => hasEdited,
		reset: (values?: AmenityFormValues) => handleReset(values),
	}));

	return (
		<Card>
			<CardHeader className="flex-row justify-between">
				<div className="flex flex-col gap-2">
					<CardTitle>Comodidades</CardTitle>
					<CardDescription>
						Adicione as comodidades que seu hotel oferece.
					</CardDescription>
				</div>
				<ResetButton canReset={hasEdited} handleReset={handleReset} />
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap gap-2 mb-4">
					{amenities.length === 0 ? (
						<div className="flex gap-2 flex-wrap">
							<p className="text-sm text-muted-foreground">Exemplos: </p>
							{exampleAmenities.map((amenity) => (
								<Badge variant={"secondary"} key={amenity}>
									{amenity}
								</Badge>
							))}
						</div>
					) : (
						amenities.map((amenity) => (
							<Badge className="text-sm" key={amenity}>
								<span>{amenity}</span>
								<Button
									variant="ghost"
									size="icon"
									className="h-5 w-5 rounded-full p-0 hover:bg-destructive/10 hover:text-destructive"
									onClick={() => handleRemoveAmenity(amenity)}
								>
									<XIcon className="h-3 w-3" />
								</Button>
							</Badge>
						))
					)}
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleAddAmenity)}
						className="flex gap-2"
					>
						<FormField
							control={form.control}
							name="amenity"
							render={({ field }) => {
								return (
									<FormItem className="w-full">
										<Input
											id="amenity"
											placeholder="Adicione uma comodidade"
											{...field}
										/>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<Button type="submit">
							<PlusIcon className="h-4 w-4" />
						</Button>
					</form>
				</Form>

				<p className="text-sm text-muted-foreground mt-4">
					Adicione comodidades como Wi-Fi, piscina, academia, restaurante, etc.
					Estas comodidades serão exibidas na página inicial do seu hotel.
				</p>
			</CardContent>
		</Card>
	);
}
