import React, { ButtonHTMLAttributes } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"

interface ButtonProps {}

const buttonVariants = cva(
	// cette ligne c'est pour les elements de style qui seront toujours presents peu importe le variante e bouton choisie
	'active:scale-95 inline-flex cursor:pointer items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus-ring-slate-400 focus-ring-offset-2 disabled:opacity-50 ',
	{
		variants: {
			variant: {
				default: 'bg-green-900 text-white hover:bg-slate-800',
				ghost: 'bg-transparant hover:text-slate-900 hover:bg-slate-200',
			},
			size: {
				default: 'h-10 py-2 px-4',
				sm: 'h-9 px-2',
				lg: 'h11 px-8',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	isLoading?: boolean
}

export default function Button({className, children, variant, isLoading, size, ...props}: buttonProps) {
	return (
		<button className={cn(buttonVariants({ variant, size, className }))} disabled={isLoading} {...props}>
			{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
			{children}
		</button>
	);
}