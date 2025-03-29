"use client";

import {
	type GeneralInfoFormValues,
	generalInfoSchema,
} from "@/src/modules/hotel/schemas/landing-page-schema";
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
import { Textarea } from "../ui/textarea";

export type GeneralInfoFormProps = React.HTMLAttributes<HTMLFormElement> & {
	initialValues: GeneralInfoFormValues;
	ref: React.RefObject<GeneralInfoFormRefProps>;
	setHasEdited: (value: boolean) => void;
	hasEdited: boolean;
};

export type GeneralInfoFormRefProps = {
	getChangedValues: () => Partial<GeneralInfoFormValues>;
	getValues: () => GeneralInfoFormValues;
	trigger: () => Promise<boolean>;
	reset: (values?: Partial<GeneralInfoFormValues>) => void;
} | null;

export function GeneralInfoForm({
	ref,
	initialValues,
	hasEdited,
	setHasEdited,
	...props
}: GeneralInfoFormProps) {
	const [changedValues, setChangedValues] = React.useState<
		Partial<GeneralInfoFormValues>
	>({});

	const generalInfoForm = useForm({
		resolver: zodResolver(generalInfoSchema),
		values: initialValues,
	});

	const getChangedValues = (): Partial<GeneralInfoFormValues> => {
		const currentValues = generalInfoForm.getValues();
		const keys = Object.keys(currentValues) as (keyof GeneralInfoFormValues)[];
		const updatedValues: Partial<GeneralInfoFormValues> = { ...changedValues };

		for (const key of keys) {
			const value = currentValues[key];

			if (value !== initialValues[key]) {
				updatedValues[key] = value;
			} else {
				delete updatedValues[key];
			}
		}

		setChangedValues(updatedValues);
		return updatedValues;
	};

	const handleReset = (values?: Partial<GeneralInfoFormValues>) => {
		generalInfoForm.reset(values || initialValues);
		setChangedValues({});
		setHasEdited(false);
	};

	React.useImperativeHandle(ref, () => ({
		getChangedValues: () => getChangedValues(),
		getValues: () => generalInfoForm.getValues(),
		trigger: () => generalInfoForm.trigger(),
		reset: (values?: Partial<GeneralInfoFormValues>) => handleReset(values),
	}));

	return (
		<Card>
			<CardHeader className="flex-row justify-between items-start">
				<div className="flex flex-col gap-2">
					<CardTitle>Informações Gerais</CardTitle>
					<CardDescription>
						Adicione informações gerais sobre o seu hotel, como nome, descrição
						e localização.
					</CardDescription>
				</div>
				<ResetButton canReset={hasEdited} handleReset={handleReset} />
			</CardHeader>
			<CardContent>
				<Form {...generalInfoForm}>
					<form
						className="space-y-4"
						onChange={() => !hasEdited && setHasEdited(true)}
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
										O slug é usado na URL da sua página. Ex: reservou.com/
										{initialValues.slug.replace("@", "")}
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
										<Textarea id="description" {...field} />
									</FormControl>
									<p className="text-xs text-muted-foreground">
										Uma descrição atraente do seu hotel que será exibida na
										página inicial.
									</p>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
