import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = ({ className, label, ...props }: InputProps) => {
    return (
        <div className="relative">
            {label && (
                <label className="block text-xs text-gray-500 font-mono mb-2 tracking-wider">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full bg-void/50 border border-white/10 rounded p-4 text-white font-mono",
                    "focus:border-cyan focus:outline-none focus:shadow-glow-cyan transition-all duration-300",
                    "placeholder:text-gray-600",
                    className
                )}
                {...props}
            />
        </div>
    );
};
