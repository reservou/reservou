"use client";

import { getZipCodeDetails } from "@/src/modules/hotel/actions/get-zipcode-details";
import { locationSchema } from "@/src/modules/hotel/schemas/hotel-setup-schema";
import type { LocationFormValues } from "@/src/modules/hotel/schemas/landing-page-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { ResetButton } from "../reset-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type LocationFormRefProps = {
	getValues: () => LocationFormValues;
	trigger: () => Promise<boolean>;
	reset: (values?: LocationFormValues) => void;
	hasEdited: () => boolean;
} | null;

export type LocationFormProps = {
	ref: React.Ref<LocationFormRefProps>;
	initialValues: LocationFormValues;
	setHasEdited: React.Dispatch<React.SetStateAction<boolean>>;
	hasEdited: boolean;
};

export function LocationForm({
	initialValues,
	ref,
	setHasEdited,
	hasEdited,
}: LocationFormProps) {
	const [detailsFetched, setDetailsFetched] = React.useState(false);

	const form = useForm({
		resolver: zodResolver(locationSchema),
		defaultValues: initialValues,
	});

	React.useImperativeHandle(ref, () => ({
		getValues: () => form.getValues(),
		trigger: () => form.trigger(),
		reset: (values?: LocationFormValues) => form.reset(values || initialValues),
		hasEdited: () => hasEdited,
	}));

	const handleReset = () => {
		form.reset(initialValues);
		setHasEdited(false);
		setDetailsFetched(false);
	};

	const handleZipCodeBlur = async () => {
		const valid = await form.trigger("zipCode");
		const value = form.getValues().zipCode;
		if (!value || !valid) {
			setDetailsFetched(false);
			return;
		}

		form.setValue("zipCode", value.replace("-", ""));

		const detailsOutput = await getZipCodeDetails(value);

		if (detailsOutput.success) {
			form.setValue("city", detailsOutput.data.city);
			form.setValue("state", detailsOutput.data.state);
			form.setValue("country", detailsOutput.data.country);
			form.setValue("address", detailsOutput.data.street);
			setDetailsFetched(true);
		} else {
			setDetailsFetched(false);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader className="flex-row justify-between">
				<div className="flex flex-col gap-2">
					<CardTitle> Localização</CardTitle>
					<CardDescription>
						Adicione a localização do seu hotel.
					</CardDescription>
				</div>
				<ResetButton canReset={hasEdited} handleReset={handleReset} />
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onChange={() => setHasEdited(true)} className="space-y-6">
						<FormField
							control={form.control}
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<Label htmlFor="city">Cidade</Label>
										<FormControl>
											<Input disabled={detailsFetched} id="city" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<Label htmlFor="state">Estado</Label>
										<FormControl>
											<Input disabled={detailsFetched} id="state" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<Label htmlFor="country">País</Label>
										<FormControl>
											<Input
												disabled={detailsFetched}
												id="country"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="zipCode"
								render={({ field }) => (
									<FormItem>
										<Label htmlFor="zipCode">CEP</Label>
										<FormControl>
											<Input
												id="zipCode"
												{...field}
												onBlur={() => handleZipCodeBlur()}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
