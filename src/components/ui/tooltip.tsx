"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  // 6 rather than 4. With the arrow gone there is nothing bridging the gap, so
  // the bubble has to hold itself clear of the trigger to read as a separate
  // thing rather than as a lump growing off its edge.
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            // Trimmed rather than restyled: `px-2 py-1` where it was `px-3
            // py-1.5`, and 11px medium where it was 12px regular. A tooltip is
            // one or two words and was sitting in a box built for a sentence.
            // The weight comes back up a step because small text reversed out of
            // a solid fill loses more than it does the right way round.
            //
            // `shadow-sm` so it sits above the surface instead of being painted
            // onto it — the job the arrow used to do, done by depth instead.
            //
            // Inverted in light, where a dark bubble is the tooltip idiom and
            // reads instantly as an annotation rather than as more UI. Not in
            // dark: inverting there paints a near-white slab, the brightest
            // thing on screen, for a two-word label. So dark drops it onto
            // `--popover` with the dropdowns' own hairline — a menu and a
            // tooltip are both small things floating over the app, and there is
            // no reason for them to be different colours.
            //
            // Movement is shorter and quicker to match: 1 unit of travel over
            // 150ms. At this size a 2-unit slide reads as the label arriving
            // from somewhere rather than as it appearing where it belongs.
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-sm duration-150 dark:bg-popover dark:text-popover-foreground dark:shadow-md dark:ring-1 dark:ring-foreground/10 has-data-[slot=kbd]:pr-1 data-[side=bottom]:slide-in-from-top-1 data-[side=inline-end]:slide-in-from-left-1 data-[side=inline-start]:slide-in-from-right-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          {/* No arrow. A tooltip is a label for the thing under the pointer, and
              at this size the pointer is already saying which thing that is — the
              tail only added a second, smaller shape to the smallest surface in
              the app. The `sideOffset` above is what keeps the bubble clear of
              its trigger now that nothing bridges the gap. */}
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
