
import React from 'react';
import type { ServiceCategory, LaundryItem, LaundryPartner } from './types';

export const WashingMachineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2H19.5A1.5 1.5 0 0 1 21 3.5V20.5A1.5 1.5 0 0 1 19.5 22H4.5A1.5 1.5 0 0 1 3 20.5Z" />
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M17 6h.01" />
    <path d="M14 6h.01" />
  </svg>
);

export const ShirtIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  </svg>
);

export const BedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4v16h20V4H2z" />
        <path d="M2 10h20" />
        <path d="M6 14v-4" />
        <path d="M10 14v-4" />
        <path d="M14 14v-4" />
        <path d="M18 14v-4" />
    </svg>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.94 14.32c.32.32.84.32 1.16 0l4.6-4.6c.32-.32.32-.84 0-1.16l-1.16-1.16c-.32-.32-.84-.32-1.16 0l-4.6 4.6c-.32.32-.32.84 0 1.16l1.16 1.16z" />
    <path d="M12 22s.84-2.28 2.3-3.26" />
    <path d="m21.16 12.8-1.16-1.16a.83.83 0 0 0-1.16 0l-4.6 4.6a.83.83 0 0 0 0 1.16l1.16 1.16c.32.32.84.32 1.16 0l4.6-4.6c.32-.32.32-.84 0-1.16z" />
    <path d="M12 2s-.84 2.28-2.3 3.26" />
    <path d="M2.84 11.2 4 12.36a.83.83 0 0 0 1.16 0l4.6-4.6a.83.83 0 0 0 0-1.16L8.6 5.44a.83.83 0 0 0-1.16 0l-4.6 4.6a.83.83 0 0 0 0 1.16z" />
  </svg>
);


export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'day_to_day', name: 'Roupas do Dia a Dia', description: 'Lavagem e secagem por Kg.', icon: <WashingMachineIcon className="w-8 h-8 text-blue-500" /> },
  { id: 'social', name: 'Peças Sociais', description: 'Cuidado especial para suas peças.', icon: <ShirtIcon className="w-8 h-8 text-blue-500" /> },
  { id: 'bed_bath', name: 'Cama e Banho', description: 'Edredons, lençóis e toalhas.', icon: <BedIcon className="w-8 h-8 text-blue-500" /> },
  { id: 'special', name: 'Limpeza Especial', description: 'Tapetes, cortinas e mais.', icon: <SparklesIcon className="w-8 h-8 text-blue-500" /> },
];

export const LAUNDRY_ITEMS: LaundryItem[] = [
    // Dia a Dia
    { id: 'kg_colorful', name: 'Roupa Colorida (Kg)', price: 15.00, category: 'day_to_day' },
    { id: 'kg_white', name: 'Roupa Branca (Kg)', price: 18.00, category: 'day_to_day' },
    // Social
    { id: 'social_shirt', name: 'Camisa Social', price: 12.00, category: 'social' },
    { id: 'trousers', name: 'Calça Social', price: 14.00, category: 'social' },
    { id: 'blazer', name: 'Blazer', price: 25.00, category: 'social' },
    { id: 'dress', name: 'Vestido de Festa', price: 40.00, category: 'social' },
    { id: 'suit', name: 'Terno Completo', price: 55.00, category: 'social' },
    // Cama e Banho
    { id: 'duvet', name: 'Edredom Casal', price: 35.00, category: 'bed_bath' },
    { id: 'sheet_set', name: 'Jogo de Lençol', price: 20.00, category: 'bed_bath' },
    { id: 'towel', name: 'Toalha de Banho', price: 8.00, category: 'bed_bath' },
    // Special
    { id: 'rug', name: 'Tapete (m²)', price: 30.00, category: 'special' },
    { id: 'curtain', name: 'Cortina (m²)', price: 22.00, category: 'special' },
];

export const MOCK_PARTNERS: LaundryPartner[] = [
    { id: 'p1', name: 'Lavanderia Clean & Fresh', rating: 4.9, deliveryTime: 'Amanhã', imageUrl: 'https://picsum.photos/seed/laundry1/400/300' },
    { id: 'p2', name: 'Lava Rápido do Bairro', rating: 4.7, deliveryTime: 'Amanhã', imageUrl: 'https://picsum.photos/seed/laundry2/400/300' },
    { id: 'p3', name: 'Toque de Cuidado Lavanderia', rating: 4.8, deliveryTime: '2 dias', imageUrl: 'https://picsum.photos/seed/laundry3/400/300' },
];
