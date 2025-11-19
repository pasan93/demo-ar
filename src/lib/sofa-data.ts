export type SofaDimensions = {
  width: number;
  depth: number;
  height: number;
};

export type Sofa = {
  id: string;
  name: string;
  price: number;
  dimensions: SofaDimensions;
  modelPath: string;
  thumbnail: string;
  description: string;
  material: string;
};

export const sofa: Sofa = {
  id: "sofa-001",
  name: "Modern 3-Seater Sofa",
  price: 1299,
  dimensions: {
    width: 210,
    depth: 90,
    height: 85,
  },
  modelPath: "https://raw.githubusercontent.com/pasan93/demo-ar/main/public/models/sofa.glb",
  thumbnail: "/images/sofa-thumbnail.jpg",
  description: "Comfortable modern sofa with premium fabric upholstery and solid wood frame",
  material: "Premium Fabric",
};

export function formatDimensions(dimensions: SofaDimensions): string {
  return `${dimensions.width} × ${dimensions.depth} × ${dimensions.height} cm`;
}
