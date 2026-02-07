import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Image as KonvaImage, Group, Ellipse, Text, Rect } from 'react-konva';
import Konva from 'konva';
import { ThoughtCard, Position } from '../types';
import { thoughtToWorldPosition } from '../hooks/useIslandLayout';

interface KonvaPlantSpriteProps {
  thought: ThoughtCard;
  onClick: (thought: ThoughtCard) => void;
  onDragEnd?: (thoughtId: string, worldX: number, worldY: number) => void;
}

// Image cache: URL -> HTMLImageElement
const imageCache = new Map<string, HTMLImageElement>();

function useLoadImage(src: string): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(() => imageCache.get(src) ?? null);

  useEffect(() => {
    if (imageCache.has(src)) {
      setImage(imageCache.get(src)!);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      setImage(img);
    };
    img.onerror = () => {
      console.warn('Failed to load plant image:', src.slice(0, 60));
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return image;
}

function getPlantSize(stage: string): number {
  switch (stage) {
    case 'seed': return 64;
    case 'sprout': return 96;
    case 'bloom': return 128;
    case 'mature': return 160;
    default: return 96;
  }
}

export const KonvaPlantSprite: React.FC<KonvaPlantSpriteProps> = React.memo(({ thought, onClick, onDragEnd }) => {
  const image = useLoadImage(thought.imageUrl);
  const groupRef = useRef<Konva.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const bobAnimRef = useRef<Konva.Animation | null>(null);
  const bobBaseYRef = useRef<number>(0);

  const size = getPlantSize(thought.growthStage);
  const worldPos = thoughtToWorldPosition(thought);

  // Center horizontally, anchor near bottom (like the original -translate-y-[85%])
  const drawX = worldPos.x - size / 2;
  const drawY = worldPos.y - size * 0.85;

  // Entry animation + floating bob
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Start scaled to 0
    group.scaleX(0);
    group.scaleY(0);
    group.opacity(0);

    // Spring-like entry
    const entryTween = new Konva.Tween({
      node: group,
      duration: 0.5,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      easing: Konva.Easings.ElasticEaseOut,
    });
    entryTween.play();

    // Floating bob animation (looping)
    const bobDelay = Math.random() * 2000;
    const startY = group.y();
    bobBaseYRef.current = startY;

    const timerId = setTimeout(() => {
      const anim = new Konva.Animation((frame) => {
        if (!frame) return;
        const offset = Math.sin(frame.time / 1000) * 3;
        group.y(bobBaseYRef.current + offset);
      }, group.getLayer());
      bobAnimRef.current = anim;
      anim.start();
    }, bobDelay);

    return () => {
      clearTimeout(timerId);
      entryTween.destroy();
      if (bobAnimRef.current) bobAnimRef.current.stop();
    };
  }, []);

  const handleDragStart = useCallback(() => {
    setDragging(true);
    // Pause bob animation during drag
    if (bobAnimRef.current) {
      bobAnimRef.current.stop();
    }
    const group = groupRef.current;
    if (group) {
      group.scaleX(1.1);
      group.scaleY(1.1);
    }
  }, []);

  const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    setDragging(false);
    const group = groupRef.current;
    if (!group) return;

    // Remove lift effect
    group.scaleX(1);
    group.scaleY(1);

    // Calculate world position from the group's new position
    // The group position is the draw position (top-left corner of the plant).
    // Convert back to the "anchor point" (center-bottom of plant).
    const newDrawX = group.x();
    const newDrawY = group.y();
    const newWorldX = newDrawX + size / 2;
    const newWorldY = newDrawY + size * 0.85;

    // Update bob base Y to new position
    bobBaseYRef.current = newDrawY;

    // Resume bob animation
    if (bobAnimRef.current) {
      bobAnimRef.current.start();
    }

    if (onDragEnd) {
      onDragEnd(thought.id, newWorldX, newWorldY);
    }
  }, [thought.id, size, onDragEnd]);

  if (!image) return null;

  return (
    <Group
      ref={groupRef}
      x={drawX}
      y={drawY}
      draggable
      dragDistance={5}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        // dragDistance ensures this only fires for clicks, not drags
        onClick(thought);
      }}
      onTap={(e) => {
        onClick(thought);
      }}
      onMouseEnter={(e) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = dragging ? 'grabbing' : 'grab';
        setHovered(true);
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = 'default';
        setHovered(false);
      }}
    >
      {/* Grounding shadow */}
      <Ellipse
        x={size / 2}
        y={size * 0.92}
        radiusX={dragging ? size * 0.3 : size * 0.25}
        radiusY={dragging ? 5 : 3}
        fill={dragging ? "rgba(28, 25, 23, 0.12)" : "rgba(28, 25, 23, 0.08)"}
      />

      {/* Plant image */}
      <KonvaImage
        image={image}
        width={size}
        height={size}
        scaleX={hovered && !dragging ? 1.1 : 1}
        scaleY={hovered && !dragging ? 1.1 : 1}
        offsetX={hovered && !dragging ? size * 0.05 : 0}
        offsetY={hovered && !dragging ? size * 0.05 : 0}
      />

      {/* Hover label */}
      {hovered && !dragging && (
        <Group x={size / 2} y={-12}>
          <Rect
            offsetX={getTextWidth(thought.meta.topic.replace(/\b\w/g, c => c.toUpperCase())) / 2 + 10}
            offsetY={10}
            width={getTextWidth(thought.meta.topic.replace(/\b\w/g, c => c.toUpperCase())) + 20}
            height={24}
            fill="rgba(255,255,255,0.6)"
            cornerRadius={8}
            shadowColor="rgba(0,0,0,0.06)"
            shadowBlur={4}
            shadowOffsetY={2}
          />
          <Text
            text={thought.meta.topic.replace(/\b\w/g, c => c.toUpperCase())}
            fontSize={12}
            fontFamily="'Playfair Display', serif"
            fill="rgba(68,64,60,0.7)"
            offsetX={getTextWidth(thought.meta.topic.replace(/\b\w/g, c => c.toUpperCase())) / 2}
            offsetY={4}
          />
        </Group>
      )}
    </Group>
  );
});

KonvaPlantSprite.displayName = 'KonvaPlantSprite';

// Rough text width estimator for label centering
function getTextWidth(text: string): number {
  return text.length * 7;
}
