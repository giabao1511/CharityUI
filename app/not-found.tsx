import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Heading, BodyText } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[60vh] py-12">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
        <Heading level={2}>Page Not Found</Heading>
        <BodyText muted className="max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The campaign or page may have been removed or doesn't exist.
        </BodyText>
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
