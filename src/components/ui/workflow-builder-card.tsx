import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  src: string;
  fallback: string;
}

interface Action {
  Icon: React.ElementType;
  bgColor: string;
}

interface WorkflowBuilderCardProps {
  /** Gradient background class for the icon header area, e.g. "from-indigo-500 to-blue-600" */
  headerGradient: string;
  /** Icon rendered in the header area */
  headerIcon: React.ReactNode;
  status: "Active" | "Inactive";
  lastUpdated: string;
  title: string;
  description: string;
  tags: string[];
  users: User[];
  actions: Action[];
  className?: string;
  onClick?: () => void;
}

export const WorkflowBuilderCard = ({
  headerGradient,
  headerIcon,
  status,
  lastUpdated,
  title,
  description,
  tags,
  users,
  actions,
  className,
  onClick,
}: WorkflowBuilderCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const detailVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: "0.75rem",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={cn("w-full max-w-sm cursor-pointer", className)}
      onClick={onClick}
    >
      <Card className="overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl">
        {/* Icon header */}
        <div className={cn("relative flex items-center justify-center h-28 w-full bg-gradient-to-br", headerGradient)}>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-6 -mb-6" />
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
            {headerIcon}
          </div>
        </div>

        <div className="p-4">
          {/* Header content */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{lastUpdated}</span>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      status === "Active" ? "bg-green-500" : "bg-red-500"
                    )}
                    aria-label={status}
                  />
                  <span>{status}</span>
                </div>
              </div>
              <h3 className="mt-1 text-lg font-semibold text-card-foreground">
                {title}
              </h3>
            </div>
            <button
              aria-label="More options"
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Animated details */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="details"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={detailVariants}
                className="overflow-hidden"
              >
                <p className="text-sm text-muted-foreground">{description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-4">
          <div className="flex -space-x-2">
            {users.map((user, index) => (
              <Avatar
                key={index}
                className="h-7 w-7 border-2 border-card"
                aria-label={user.fallback}
              >
                <AvatarImage src={user.src} />
                <AvatarFallback className="text-[10px] font-semibold">{user.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center -space-x-2">
            {actions.map(({ Icon, bgColor }, index) => (
              <div
                key={index}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-white",
                  bgColor
                )}
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
