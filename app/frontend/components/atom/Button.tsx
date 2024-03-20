import React, { ButtonHTMLAttributes } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import "../../app/styles.css";
import FadeMenuInfos from "@/models/ChatRoom/FadeMenuInfos";
import MemberLogo from "./chat/MemberLogo";

interface ButtonProps {}

const buttonVariants = cva(
  // cette ligne c'est pour les elements de style qui seront toujours presents peu importe le variante e bouton choisie
  "inline-flex cursor:pointer items-center transition-color focus:outline-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default: "bg-green-900 text-white hover:bg-slate-800",
        header: "text-white hover:scale-110",
        publicChannel:
          "bg-transparant p-1.5 text-xl rounded-full overflow-hidden",
        protectedChannel:
          "bg-transparant p-1.5 text-xl rounded-full overflow-hidden ",
        rounded:
          "bg-[#6E82B6] justify-center items-center rounded-full hover:bg-[#53648f] hover:text-gray-300 ",
        chatSwitch: "justify-center rounded-t-2xl text-lg",
        chatMember: "bg-transparant p-1.5 text-xl rounded-full overflow-hidden",
      },
      size: {
        default: "h-10 py-2 px-4",
        h_7_w_16: "h-7 w-16",
        h36px_w95px: "h-[36px] w-[95px]",
        sm: "h-9 px-2",
        lg: "h11 px-8",
        channel: "h-[10%] w-full",
        square: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface buttonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  infos?: FadeMenuInfos;
}

export default function Button({
  className,
  children,
  variant,
  isLoading,
  infos,
  size,
  ...props
}: buttonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {variant === "protectedChannel" ? (
        <div className="flex flex-row justify-between w-full">
          <span>{children}</span>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
        </div>
      ) : variant === "chatMember" && infos ? (
        <div className="flex flex-row justify-between w-full">
          <span>{children}</span>
          <MemberLogo {...infos} />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
