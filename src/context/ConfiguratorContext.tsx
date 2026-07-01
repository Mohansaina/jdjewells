'use client';

import React, { createContext, useContext, useState } from 'react';
import { VdbDiamond } from '@/services/vdb';

export type JewelryCategory = 'Rings' | 'Engagement Rings' | 'Wedding Bands' | 'Earrings' | 'Pendants' | 'Bracelets' | 'Necklaces' | 'Custom Jewelry';
export type DiamondShape = 'Round' | 'Oval' | 'Cushion' | 'Princess' | 'Emerald' | 'Pear' | 'Marquise' | 'Radiant' | 'Heart';
export type SettingStyle = 'Solitaire' | 'Halo' | 'Vintage' | 'Three Stone' | 'Pavé' | 'Cathedral';
export type MetalType = 'Yellow Gold' | 'White Gold' | 'Rose Gold' | 'Platinum';

interface ConfiguratorContextType {
  category: JewelryCategory;
  shape: DiamondShape;
  setting: SettingStyle;
  metal: MetalType;
  size: string;
  selectedDiamond: VdbDiamond | null;
  step: number;
  setCategory: (cat: JewelryCategory) => void;
  setShape: (shape: DiamondShape) => void;
  setSetting: (setting: SettingStyle) => void;
  setMetal: (metal: MetalType) => void;
  setSize: (size: string) => void;
  setSelectedDiamond: (diamond: VdbDiamond | null) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetConfig: () => void;
  getSettingPrice: () => number;
  getTotalPrice: () => number;
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

export const ConfiguratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [category, setCategoryState] = useState<JewelryCategory>('Engagement Rings');
  const [shape, setShapeState] = useState<DiamondShape>('Round');
  const [setting, setSettingState] = useState<SettingStyle>('Solitaire');
  const [metal, setMetalState] = useState<MetalType>('White Gold');
  const [size, setSizeState] = useState<string>('6.5');
  const [selectedDiamond, setSelectedDiamondState] = useState<VdbDiamond | null>(null);
  const [step, setStepState] = useState<number>(1);

  const setCategory = (cat: JewelryCategory) => {
    setCategoryState(cat);
  };

  const setShape = (sh: DiamondShape) => {
    setShapeState(sh);
  };

  const setSetting = (se: SettingStyle) => {
    setSettingState(se);
  };

  const setMetal = (me: MetalType) => {
    setMetalState(me);
  };

  const setSize = (sz: string) => {
    setSizeState(sz);
  };

  const setSelectedDiamond = (dia: VdbDiamond | null) => {
    setSelectedDiamondState(dia);
  };

  const setStep = (st: number) => {
    setStepState(Math.max(1, Math.min(6, st)));
  };

  const nextStep = () => {
    setStepState((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setStepState((prev) => Math.max(prev - 1, 1));
  };

  const resetConfig = () => {
    setCategoryState('Engagement Rings');
    setShapeState('Round');
    setSettingState('Solitaire');
    setMetalState('White Gold');
    setSizeState('6.5');
    setSelectedDiamondState(null);
    setStepState(1);
  };

  // Calculate pricing for the base setting (band + structure)
  const getSettingPrice = (): number => {
    let base = 800; // Standard band starting cost

    // Setting complexity
    switch (setting) {
      case 'Solitaire': base += 0; break;
      case 'Cathedral': base += 250; break;
      case 'Vintage': base += 450; break;
      case 'Pavé': base += 550; break;
      case 'Halo': base += 700; break;
      case 'Three Stone': base += 900; break;
    }

    // Metal cost factor
    switch (metal) {
      case 'Yellow Gold': base += 450; break;
      case 'Rose Gold': base += 450; break;
      case 'White Gold': base += 500; break;
      case 'Platinum': base += 1100; break;
    }

    // Category offset
    if (category === 'Custom Jewelry') base += 300;

    return base;
  };

  const getTotalPrice = (): number => {
    const settingPrice = getSettingPrice();
    const diamondPrice = selectedDiamond ? selectedDiamond.price : 0;
    return settingPrice + diamondPrice;
  };

  return (
    <ConfiguratorContext.Provider
      value={{
        category,
        shape,
        setting,
        metal,
        size,
        selectedDiamond,
        step,
        setCategory,
        setShape,
        setSetting,
        setMetal,
        setSize,
        setSelectedDiamond,
        setStep,
        nextStep,
        prevStep,
        resetConfig,
        getSettingPrice,
        getTotalPrice,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider');
  }
  return context;
};
