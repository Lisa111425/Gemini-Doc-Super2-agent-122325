import { ArtistStyle } from './types';

export const ARTIST_STYLES: ArtistStyle[] = [
  {
    id: 'van_gogh',
    name: 'Vincent van Gogh',
    era: 'Post-Impressionism',
    description: 'Swirling clouds and starry nights.',
    bgGradient: 'bg-gradient-to-br from-[#1a237e] via-[#fbc02d] to-[#1a237e]',
    accentColor: 'text-[#fbc02d]',
    textColor: 'text-white',
    panelColor: 'bg-[#1a237e]/40',
    fontFamily: 'font-serif'
  },
  {
    id: 'monet',
    name: 'Claude Monet',
    era: 'Impressionism',
    description: 'Soft water lilies and light interaction.',
    bgGradient: 'bg-gradient-to-tr from-[#81d4fa] via-[#a5d6a7] to-[#f48fb1]',
    accentColor: 'text-[#0277bd]',
    textColor: 'text-gray-900',
    panelColor: 'bg-white/40',
    fontFamily: 'font-serif'
  },
  {
    id: 'da_vinci',
    name: 'Leonardo da Vinci',
    era: 'Renaissance',
    description: 'Sepia tones, sketches, and parchment.',
    bgGradient: 'bg-gradient-to-b from-[#d7ccc8] via-[#a1887f] to-[#5d4037]',
    accentColor: 'text-[#3e2723]',
    textColor: 'text-[#3e2723]',
    panelColor: 'bg-[#efebe9]/60',
    fontFamily: 'font-mono'
  },
  {
    id: 'warhol',
    name: 'Andy Warhol',
    era: 'Pop Art',
    description: 'High contrast, repetitive vibrant colors.',
    bgGradient: 'bg-gradient-to-r from-[#ffea00] via-[#ff1744] to-[#2979ff]',
    accentColor: 'text-[#000000]',
    textColor: 'text-black',
    panelColor: 'bg-white/80',
    fontFamily: 'font-sans'
  },
  {
    id: 'basquiat',
    name: 'Jean-Michel Basquiat',
    era: 'Neo-Expressionism',
    description: 'Chaotic, graffiti-like, bold contrasts.',
    bgGradient: 'bg-gradient-to-br from-[#212121] via-[#d50000] to-[#ffab00]',
    accentColor: 'text-[#ffab00]',
    textColor: 'text-white',
    panelColor: 'bg-black/60',
    fontFamily: 'font-mono'
  },
  {
    id: 'dali',
    name: 'Salvador Dalí',
    era: 'Surrealism',
    description: 'Dreamscapes, melting clocks, deserts.',
    bgGradient: 'bg-gradient-to-bl from-[#ffcc80] via-[#795548] to-[#0288d1]',
    accentColor: 'text-[#e65100]',
    textColor: 'text-gray-900',
    panelColor: 'bg-[#fff3e0]/50',
    fontFamily: 'font-serif'
  },
  {
    id: 'picasso',
    name: 'Pablo Picasso',
    era: 'Cubism',
    description: 'Fragmented shapes and earthy tones.',
    bgGradient: 'bg-gradient-to-tr from-[#8d6e63] via-[#ffa726] to-[#546e7a]',
    accentColor: 'text-[#37474f]',
    textColor: 'text-gray-900',
    panelColor: 'bg-[#eceff1]/60',
    fontFamily: 'font-sans'
  },
  {
    id: 'klimt',
    name: 'Gustav Klimt',
    era: 'Symbolism',
    description: 'Gold leaf, patterns, and romance.',
    bgGradient: 'bg-gradient-to-b from-[#263238] via-[#ffd700] to-[#3e2723]',
    accentColor: 'text-[#ffd700]',
    textColor: 'text-white',
    panelColor: 'bg-[#212121]/80',
    fontFamily: 'font-serif'
  },
  {
    id: 'hokusai',
    name: 'Hokusai',
    era: 'Ukiyo-e',
    description: 'Great waves, Prussian blue, Mt Fuji.',
    bgGradient: 'bg-gradient-to-br from-[#e0f7fa] via-[#0277bd] to-[#01579b]',
    accentColor: 'text-[#01579b]',
    textColor: 'text-gray-900',
    panelColor: 'bg-white/70',
    fontFamily: 'font-serif'
  },
  {
    id: 'kahlo',
    name: 'Frida Kahlo',
    era: 'Naïve Art',
    description: 'Vibrant Mexican flowers and jungle greens.',
    bgGradient: 'bg-gradient-to-tr from-[#1b5e20] via-[#c62828] to-[#fbc02d]',
    accentColor: 'text-[#c62828]',
    textColor: 'text-white',
    panelColor: 'bg-[#1b5e20]/40',
    fontFamily: 'font-sans'
  },
  {
    id: 'mondrian',
    name: 'Piet Mondrian',
    era: 'De Stijl',
    description: 'Grid lines, primary colors, white space.',
    bgGradient: 'bg-gradient-to-r from-white via-[#d50000] to-[#2962ff]',
    accentColor: 'text-black',
    textColor: 'text-black',
    panelColor: 'bg-white/90',
    fontFamily: 'font-mono'
  },
  {
    id: 'okeeffe',
    name: 'Georgia O\'Keeffe',
    era: 'American Modernism',
    description: 'Large flowers, deserts, smooth gradients.',
    bgGradient: 'bg-gradient-to-b from-[#f8bbd0] via-[#f48fb1] to-[#e1bee7]',
    accentColor: 'text-[#880e4f]',
    textColor: 'text-gray-800',
    panelColor: 'bg-white/50',
    fontFamily: 'font-serif'
  },
  {
    id: 'hopper',
    name: 'Edward Hopper',
    era: 'Realism',
    description: 'Urban solitude, harsh light, shadows.',
    bgGradient: 'bg-gradient-to-bl from-[#006064] via-[#00838f] to-[#ffb74d]',
    accentColor: 'text-[#e65100]',
    textColor: 'text-white',
    panelColor: 'bg-[#263238]/70',
    fontFamily: 'font-sans'
  },
  {
    id: 'kandinsky',
    name: 'Wassily Kandinsky',
    era: 'Abstract',
    description: 'Geometric shapes, musical compositions.',
    bgGradient: 'bg-gradient-to-tr from-[#304ffe] via-[#ff6d00] to-[#00c853]',
    accentColor: 'text-[#ffff00]',
    textColor: 'text-white',
    panelColor: 'bg-black/50',
    fontFamily: 'font-sans'
  },
  {
    id: 'rembrandt',
    name: 'Rembrandt',
    era: 'Baroque',
    description: 'Chiaroscuro, dark backgrounds, golden light.',
    bgGradient: 'bg-gradient-to-b from-[#000000] via-[#3e2723] to-[#8d6e63]',
    accentColor: 'text-[#ffd54f]',
    textColor: 'text-[#fff8e1]',
    panelColor: 'bg-black/70',
    fontFamily: 'font-serif'
  },
  {
    id: 'matisse',
    name: 'Henri Matisse',
    era: 'Fauvism',
    description: 'Paper cutouts, wild colors, simplicity.',
    bgGradient: 'bg-gradient-to-r from-[#d50000] via-[#304ffe] to-[#ffd600]',
    accentColor: 'text-[#304ffe]',
    textColor: 'text-gray-900',
    panelColor: 'bg-white/80',
    fontFamily: 'font-sans'
  },
  {
    id: 'rothko',
    name: 'Mark Rothko',
    era: 'Color Field',
    description: 'Large blocks of color, emotional depth.',
    bgGradient: 'bg-gradient-to-b from-[#b71c1c] via-[#b71c1c] to-[#ff6f00]',
    accentColor: 'text-[#ff6f00]',
    textColor: 'text-white',
    panelColor: 'bg-[#b71c1c]/30',
    fontFamily: 'font-sans'
  },
  {
    id: 'banksy',
    name: 'Banksy',
    era: 'Street Art',
    description: 'Stencils, grey concrete, red accents.',
    bgGradient: 'bg-gradient-to-br from-[#424242] via-[#616161] to-[#212121]',
    accentColor: 'text-[#ff1744]',
    textColor: 'text-white',
    panelColor: 'bg-[#bdbdbd]/20',
    fontFamily: 'font-mono'
  },
  {
    id: 'munch',
    name: 'Edvard Munch',
    era: 'Expressionism',
    description: 'The Scream, anxiety, wavy lines.',
    bgGradient: 'bg-gradient-to-tr from-[#ff5722] via-[#3d5afe] to-[#212121]',
    accentColor: 'text-[#ffccbc]',
    textColor: 'text-white',
    panelColor: 'bg-[#263238]/60',
    fontFamily: 'font-serif'
  },
  {
    id: 'vermeer',
    name: 'Johannes Vermeer',
    era: 'Dutch Golden Age',
    description: 'Domestic interiors, window light, pearl.',
    bgGradient: 'bg-gradient-to-bl from-[#263238] via-[#455a64] to-[#ffca28]',
    accentColor: 'text-[#ffca28]',
    textColor: 'text-white',
    panelColor: 'bg-[#37474f]/70',
    fontFamily: 'font-serif'
  }
];

export const MOCK_SUMMARY = `# Executive Summary

## 1. Introduction
This document provides a comprehensive analysis of the provided materials. It leverages advanced generative AI to synthesize key insights, identify strategic opportunities, and highlight potential risks.

## 2. Key Findings
*   **Strategic Alignment:** The documents suggest a strong alignment with market trends.
*   **Operational Efficiency:** Several bottlenecks were identified in the logistics chain.
*   **Financial Outlook:** Projected growth is estimated at 15% YoY.

## 3. Recommendations
1.  Implement automated auditing tools.
2.  Diversify supply chain partners.
3.  Invest in employee training programs.

## 4. Conclusion
The analysis indicates a positive trajectory, provided the recommended mitigations are enacted immediately.
`;