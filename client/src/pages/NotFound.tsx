import { Link } from "react-router";
import { Clapperboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Clapperboard className="h-10 w-10 text-slate-500" />
      <h1 className="font-semibold text-3xl text-slate-100">Scene missing</h1>
      <p className="max-w-sm text-sm text-slate-400">
        We couldn't find that page. It may have been moved or never existed.
      </p>
      <Link to="/" className={buttonVariants()}>
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
