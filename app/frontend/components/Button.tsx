import React, { ButtonHTMLAttributes } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"
import '../app/styles.css'

interface ButtonProps {}

const buttonVariants = cva(
	// cette ligne c'est pour les elements de style qui seront toujours presents peu importe le variante e bouton choisie
	'inline-flex cursor:pointer items-center transition-color focus:outline-none disabled:opacity-50 ',
	{
		variants: {
			variant: {
				default: 'bg-green-900 text-white hover:bg-slate-800',
				channel: 'bg-transparant p-1.5 text-xl rounded-full',
				rounded: 'bg-[#6E82B6] justify-center items-center rounded-full hover:bg-[#53648f] hover:text-gray-300 ',
				chatSwitch: 'justify-center rounded-t-2xl text-lg'
			},
			size: {
				default: 'h-10 py-2 px-4',
				h_7_w_16: 'h-7 w-16',
				h36px_w95px: 'h-[36px] w-[95px]',
				sm: 'h-9 px-2',
				lg: 'h11 px-8',
				channel: 'h-[10%] w-full',
				square: 'h-7 w-7'
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