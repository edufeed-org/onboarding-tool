"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { StarterPack } from '@/hooks/useStarterPacks';
import { Users, Plus, ExternalLink } from 'lucide-react';

export interface StarterPackCardProps {
  starterPack: StarterPack;
  onFollow?: (starterPack: StarterPack) => void;
  onViewDetails?: (starterPack: StarterPack) => void;
  className?: string;
  showActions?: boolean;
}

export function StarterPackCard({ 
  starterPack, 
  onFollow, 
  onViewDetails, 
  className = "",
  showActions = true
}: StarterPackCardProps) {
  const handleFollow = () => {
    onFollow?.(starterPack);
  };

  const handleViewDetails = () => {
    onViewDetails?.(starterPack);
  };

  const formatProfileCount = (count: number) => {
    if (count === 1) return '1 profile';
    return `${count} profiles`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-4 md:p-6 transition-all duration-200 hover:shadow-md hover:border-primary/30 ${className}`}
    >
      {/* Header with image and title */}
      <div className="flex items-start gap-3 mb-3">
        {starterPack.image && (
          <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
            <img
              src={starterPack.image}
              alt={starterPack.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1 truncate">
            {starterPack.title}
          </h3>
          
          {/* Author info */}
          {starterPack.author && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              {starterPack.author.picture && (
                <div className="w-4 h-4 rounded-full overflow-hidden bg-secondary">
                  <img
                    src={starterPack.author.picture}
                    alt={starterPack.author.name || 'Author'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <span className="truncate">
                by {starterPack.author.name || 'Anonymous'}
              </span>
            </div>
          )}

          {/* Profile count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{formatProfileCount(starterPack.profiles.length)}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {starterPack.description && (
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {truncateText(starterPack.description, 150)}
        </p>
      )}

      {/* Profile previews */}
      {starterPack.profiles.length > 0 && (
        <div className="mb-4">
          <div className="flex -space-x-2 overflow-hidden">
            {starterPack.profiles.slice(0, 8).map((pubkey, index) => (
              <div
                key={pubkey}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-card flex items-center justify-center text-xs font-medium"
                style={{
                  zIndex: starterPack.profiles.length - index
                }}
              >
                {index + 1}
              </div>
            ))}
            {starterPack.profiles.length > 8 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{starterPack.profiles.length - 8}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <Button
            onClick={handleFollow}
            className="flex-1 text-sm"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Follow Pack
          </Button>
          
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="text-sm"
            size="sm"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Created date */}
      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
        {new Date(starterPack.created_at * 1000).toLocaleDateString()}
      </div>
    </div>
  );
}

// Loading skeleton component
export function StarterPackCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 md:p-6 animate-pulse ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-lg flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-4/5"></div>
      </div>

      {/* Profile previews */}
      <div className="flex -space-x-2 mb-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-8 h-8 bg-muted rounded-full border-2 border-card"
          ></div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 h-8 bg-muted rounded"></div>
        <div className="h-8 w-10 bg-muted rounded"></div>
      </div>

      {/* Date */}
      <div className="pt-3 border-t border-border">
        <div className="h-3 bg-muted rounded w-20"></div>
      </div>
    </div>
  );
}