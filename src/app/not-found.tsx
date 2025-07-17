
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Car, RotateCw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';

// --- Game Constants ---
const LANES = 3;
const LANE_HEIGHT = 50; // px
const CAR_WIDTH = 40; // px
const GAME_WIDTH = 400; // px
const OBSTACLE_SPEED = 5; // px per frame
const OBSTACLE_INTERVAL = 100; // frames between new obstacles

// --- Game Component ---
function DesertRacer404() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [carLane, setCarLane] = useState(1); // 0, 1, 2
  const [obstacles, setObstacles] = useState<{ id: number; lane: number; position: number }[]>([]);

  const gameLoopRef = useRef<number>();
  const obstacleCounterRef = useRef(0);
  const nextObstacleIdRef = useRef(0);

  const resetGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setScore(0);
    setCarLane(1);
    setObstacles([]);
    obstacleCounterRef.current = 0;
    nextObstacleIdRef.current = 0;
  };
  
  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const gameTick = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    // --- Update Score ---
    setScore(prev => prev + 1);

    // --- Update Obstacles ---
    setObstacles(prevObstacles => {
      const updatedObstacles = prevObstacles
        .map(obs => ({ ...obs, position: obs.position - OBSTACLE_SPEED }))
        .filter(obs => obs.position > -CAR_WIDTH); // Remove off-screen obstacles

      // --- Collision Detection ---
      for (const obs of updatedObstacles) {
        if (
          obs.lane === carLane &&
          obs.position < CAR_WIDTH &&
          obs.position > -CAR_WIDTH
        ) {
          setIsPlaying(false);
          setIsGameOver(true);
          return prevObstacles; // Stop movement on collision
        }
      }
      return updatedObstacles;
    });


    // --- Add New Obstacles ---
    obstacleCounterRef.current++;
    if (obstacleCounterRef.current > OBSTACLE_INTERVAL) {
      obstacleCounterRef.current = 0;
      const newLane = Math.floor(Math.random() * LANES);
      setObstacles(prev => [
        ...prev,
        { id: nextObstacleIdRef.current++, lane: newLane, position: GAME_WIDTH }
      ]);
    }
    
    gameLoopRef.current = requestAnimationFrame(gameTick);
  }, [isPlaying, isGameOver, carLane]);

  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = requestAnimationFrame(gameTick);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameTick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isPlaying) return;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCarLane(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setCarLane(prev => Math.min(LANES - 1, prev + 1));
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8">
        <div 
            className="relative w-full max-w-sm h-[150px] bg-muted overflow-hidden rounded-lg border shadow-inner"
            style={{ height: `${LANE_HEIGHT * LANES}px`, maxWidth: `${GAME_WIDTH}px` }}
        >
            {/* Lanes */}
            {[...Array(LANES - 1)].map((_, i) => (
                <div key={i} className="absolute w-full border-b border-dashed border-muted-foreground/30" style={{ top: `${(i + 1) * LANE_HEIGHT - 1}px` }} />
            ))}

            {/* Player Car */}
            <Car className="h-8 w-8 text-primary absolute transition-all duration-100 ease-linear" style={{ top: `${carLane * LANE_HEIGHT + (LANE_HEIGHT - 32) / 2}px`, left: '10px' }} />

            {/* Obstacles */}
            {obstacles.map(obs => (
                <Car key={obs.id} className="h-8 w-8 text-card-foreground/70 absolute transform -scale-x-100" style={{ top: `${obs.lane * LANE_HEIGHT + (LANE_HEIGHT - 32) / 2}px`, left: `${obs.position}px` }} />
            ))}
            
            {/* Game Over / Start Screen */}
            {(!isPlaying || isGameOver) && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                    {isGameOver ? (
                        <>
                            <h3 className="text-2xl font-bold">Game Over!</h3>
                            <p className="text-muted-foreground mb-4">Your Score: {score}</p>
                            <Button onClick={startGame}><RotateCw className="mr-2 h-4 w-4" /> Try Again</Button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-semibold">Desert Racer 404</h3>
                            <p className="text-sm text-muted-foreground mb-4">Use Up/Down arrows to dodge!</p>
                            <Button onClick={startGame}>Start Game</Button>
                        </>
                    )}
                </div>
            )}
        </div>
        <div className='font-mono text-2xl tracking-widest'>SCORE: {score}</div>
    </div>
  );
}


export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <TriangleAlert className="h-10 w-10 text-primary" />
            </div>
          <CardTitle className="text-3xl font-bold mt-4">404 - Lost in the Desert</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            This page is empty... but the road ahead isn't.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DesertRacer404 />
        </CardContent>
        <CardContent className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><ArrowLeft className="h-4 w-4"/> Use Up/Down keys to move</div>
        </CardContent>
         <CardContent>
          <Button asChild className="w-full" size="lg">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
