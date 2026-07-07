import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, src, alt = "", ...props }: AvatarImageProps) {
  const [error, setError] = React.useState(false);
  if (!src || error) return null;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
