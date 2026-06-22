import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Toaster } from "sonner";
import { DiscordSupport } from "@/components/DiscordSupport";
import { FakeReviewsCarousel } from "@/components/FakeReviewsCarousel";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SHOP+ — Boutique premium" },
      { name: "description", content: "Comptes streaming, gaming, VPN et bonus exclusifs. Livraison instantanée, paiement PayPal." },
      { name: "theme-color", content: "#dc2626" },
      { property: "og:title", content: "SHOP+ — Boutique premium" },
      { property: "og:description", content: "Comptes streaming, gaming, VPN et bonus exclusifs. Livraison instantanée, paiement PayPal." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://shop-plus-nu.vercel.app/banner.png?v=2" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://shop-plus-nu.vercel.app/banner.png?v=2" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { SettingsProvider, useSettings } from "@/lib/settings";

function AppContent() {
  const [showReviews, setShowReviews] = useState(false);
  const settings = useSettings();

  if (settings.maintenance_mode === "true") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <h1 className="text-4xl font-black text-primary mb-4">Maintenance</h1>
          <p className="text-muted-foreground">La boutique revient très vite !</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {settings.banner_text && (
        <div className="w-full bg-primary text-primary-foreground py-1.5 px-4 overflow-hidden relative z-50">
          <div className="whitespace-nowrap animate-marquee text-xs font-bold tracking-wider">
            {settings.banner_text} &nbsp; ✨ &nbsp; {settings.banner_text} &nbsp; ✨ &nbsp; {settings.banner_text}
          </div>
        </div>
      )}
      
      <div className="fixed inset-0 hero-red-pulse pointer-events-none -z-10" />
      <Outlet />
      <DiscordSupport link={settings.discord_link} />
      
      {showReviews ? (
        <FakeReviewsCarousel />
      ) : (
        <div className="flex justify-center py-8">
          <button 
            onClick={() => setShowReviews(true)}
            className="px-6 py-2 rounded-full border border-border bg-background/50 hover:bg-muted text-sm font-medium transition-colors"
          >
            Afficher les avis clients
          </button>
        </div>
      )}
      
      <DiscordSupport link={settings.discord_link} />
      <AudioPlayer />
      
      <Toaster theme="dark" position="top-right" richColors />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
