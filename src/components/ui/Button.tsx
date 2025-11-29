import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "gold" | "ghost" | "danger";
}

export const Button = ({ className, variant = "primary", children, ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-cyan/10 border border-cyan/30 text-cyan hover:bg-cyan/20 hover:shadow-glow-cyan",
        gold: "bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:shadow-glow-gold",
        ghost: "bg-transparent text-gray-400 hover:text-white border border-transparent",
        danger: "bg-alert/10 border border-alert/30 text-alert hover:bg-alert/20",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "px-6 py-3 rounded font-heading font-bold tracking-widest uppercase transition-all duration-300 backdrop-blur-sm",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};
