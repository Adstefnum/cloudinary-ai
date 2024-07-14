"use client"

import { useImageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { recolorImage } from "@/server/recolor"
import { useAction } from "next-safe-action/hooks"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo } from "react"
import { genRemove } from "@/server/gen-remove"
import { Eraser } from "lucide-react"
import { useLayerStore } from "@/lib/layer-store"

export default function GenRemove() {
  const tags = useImageStore((state) => state.tags)
  const setActiveTag = useImageStore((state) => state.setActiveTag)
  const generating = useImageStore((state) => state.generating)
  const activeTag = useImageStore((state) => state.activeTag)
  const activeColor = useImageStore((state) => state.activeColor)
  const setGenerating = useImageStore((state) => state.setGenerating)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  const addLayer = useLayerStore((state) => state.addLayer)
  const layers = useLayerStore((state) => state.layers)
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
  return (
    <div className="">
      <Popover>
        <PopoverTrigger disabled={!activeLayer?.url} asChild>
          <Button variant="outline">
            <span className="flex gap-2 items-center justify-center">
              <Eraser size={18} /> Smart AI Remove
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Smart AI Remove</h4>
              <p className="text-sm text-muted-foreground">
                Generative Remove any part of the image
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-xs">Suggested selections</h3>
              <div className="flex gap-2">
                {tags.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No tags available
                  </p>
                )}
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "px-2 py-1 rounded text-xs",
                      activeTag === tag && "bg-primary text-white"
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Selection</Label>
                <Input
                  className="col-span-2 h-8"
                  value={activeTag}
                  name="tag"
                  onChange={(e) => {
                    setActiveTag(e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            disabled={
              !activeTag || !activeColor || !activeLayer.url || generating
            }
            onClick={async () => {
              setGenerating(true)
              const res = await genRemove({
                activeImage: activeLayer.url!,
                prompt: activeTag,
              })
              if (res?.data?.success) {
                addLayer({
                  count: layers.length + 1,
                  url: res.data.success,
                  format: activeLayer.format,
                  height: activeLayer.height,
                  width: activeLayer.width,
                  name: activeLayer.name,
                  publicId: activeLayer.publicId,
                })
                setGenerating(false)
                setActiveLayer(layers.length + 1)
              }
            }}
          >
            Magic Remove 🎨
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
