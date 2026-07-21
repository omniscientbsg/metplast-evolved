"use client"

import React from 'react';
import { PageBlock } from './types';
import { InfoBlock } from './InfoBlock';
import { FeederMaterials } from './FeederMaterials';
import { AutoFlush } from './AutoFlush';
import { Customization } from './Customization';
import { UpgradePath } from './UpgradePath';
import { FeedingTrolley } from './FeedingTrolley';
import { Lighting } from './Lighting';

export function BlockRenderer({ block }: { block: PageBlock }) {
  switch (block.type) {
    case 'info':
      return (
        <InfoBlock
          id={block.id}
          heading={block.heading}
          lines={block.lines}
          note={block.note}
          columns={block.columns}
        />
      );
    case 'feeder-materials':
      return <FeederMaterials id={block.id} />;
    case 'auto-flush':
      return <AutoFlush id={block.id} />;
    case 'customization':
      return <Customization id={block.id} />;
    case 'upgrade-path':
      return <UpgradePath id={block.id} />;
    case 'feeding-trolley':
      return <FeedingTrolley id={block.id} />;
    case 'lighting':
      return <Lighting id={block.id} />;
    default:
      return null;
  }
}
