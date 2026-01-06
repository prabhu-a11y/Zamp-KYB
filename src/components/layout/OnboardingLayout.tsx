import { ReactNode, useState } from "react";
import { ProgressStepper, Step } from "@/components/chat/ProgressStepper";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import wioLogo from "@/assets/wio-logo.png";
import { OnboardingData, ScreenId } from "@/hooks/useOnboardingFlow";
import { HelpChatButton } from "@/components/chat/HelpChatButton";

interface OnboardingLayoutProps {
  children: ReactNode;
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  data?: OnboardingData;
  currentScreen?: ScreenId;
}

export const OnboardingLayout = ({
  children,
  steps,
  currentStep,
  completedSteps,
  data,
  currentScreen,
}: OnboardingLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Sidebar - Full height */}
      {sidebarOpen && (
        <aside
          className="fixed top-0 left-0 h-screen w-80 bg-sidebar border-r border-border flex-col transition-all duration-300 z-30 hidden lg:flex"
        >
          {/* Fixed Logo Header - Non-scrollable */}
          <div className="p-6 pb-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 p-1">
                <img src={wioLogo} alt="Wio" className="w-full h-full object-contain dark:invert" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">Wio Onboarding</p>
                <p className="text-xs text-muted-foreground">powered by Pace</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 pt-4 flex-1 overflow-y-auto">
            {/* Progress section */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Tracking Progress
              </p>
              <ProgressStepper
                steps={steps}
                currentStep={currentStep}
                completedSteps={completedSteps}
                data={data}
              />
            </div>
          </div>
        </aside>
      )}

      {/* Main content area - pushed right by sidebar */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          sidebarOpen ? "lg:ml-80" : "lg:ml-0"
        )}
      >
        {/* Header - only on the right side */}
        <header className="h-14 border-b border-border bg-background flex items-center px-4 sticky top-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-base font-semibold text-foreground">
            Wio Onboarding Assistant
          </h1>
        </header>

        {/* Mobile progress indicator */}
        <div className="lg:hidden p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${(completedSteps.length / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-h-0 bg-background">
          {children}
        </main>
      </div>

      {/* Help Chat FAB */}
      <HelpChatButton currentScreen={currentScreen} data={data} />
    </div>
  );
};
